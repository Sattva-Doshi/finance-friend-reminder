
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Initialize Supabase Admin client with service role key for background processing
const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

// Configure SMTP settings
const SMTP_HOST = Deno.env.get("SMTP_HOST");
const SMTP_PORT = parseInt(Deno.env.get("SMTP_PORT") || "587");
const SMTP_USERNAME = Deno.env.get("SMTP_USERNAME");
const SMTP_PASSWORD = Deno.env.get("SMTP_PASSWORD");
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "notifications@fintrack.app";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!SMTP_HOST || !SMTP_USERNAME || !SMTP_PASSWORD) {
      throw new Error("SMTP configuration is missing");
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Format date range for queries - start of tomorrow to end of tomorrow
    const tomorrowStart = new Date(tomorrow.setHours(0, 0, 0, 0)).toISOString();
    const tomorrowEnd = new Date(tomorrow.setHours(23, 59, 59, 999)).toISOString();

    console.log(`Checking for payments due between ${tomorrowStart} and ${tomorrowEnd}`);

    // Get all upcoming reminders due tomorrow
    const { data: upcomingReminders, error: remindersError } = await supabaseAdmin
      .from('reminders')
      .select('*, profiles(email)')
      .eq('paid', false)
      .gte('due_date', tomorrowStart)
      .lte('due_date', tomorrowEnd);
    
    if (remindersError) {
      console.error("Error fetching upcoming reminders:", remindersError);
      throw remindersError;
    }

    // Get all upcoming subscription renewals due tomorrow
    const { data: upcomingSubscriptions, error: subscriptionsError } = await supabaseAdmin
      .from('subscriptions')
      .select('*, profiles(email)')
      .eq('active', true)
      .gte('next_billing_date', tomorrowStart)
      .lte('next_billing_date', tomorrowEnd);
    
    if (subscriptionsError) {
      console.error("Error fetching upcoming subscriptions:", subscriptionsError);
      throw subscriptionsError;
    }

    console.log(`Found ${upcomingReminders?.length || 0} reminders and ${upcomingSubscriptions?.length || 0} subscriptions due tomorrow`);

    // Configure SMTP client
    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: true,
        auth: {
          username: SMTP_USERNAME,
          password: SMTP_PASSWORD,
        },
      },
    });

    // Process reminders
    for (const reminder of upcomingReminders || []) {
      // Get user email using the user_id
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(reminder.user_id);
      const userEmail = userData?.user?.email;
      
      if (!userEmail) {
        console.log(`No email found for user ${reminder.user_id}, skipping notification`);
        continue;
      }

      const userName = userEmail.split('@')[0]; // Simple username extraction
      const formattedDate = new Date(reminder.due_date).toLocaleDateString();
      
      // Generate email for reminder
      const reminderEmailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #333; margin-bottom: 20px;">Payment Due Tomorrow</h1>
          <p>Hello ${userName},</p>
          <p>This is a friendly reminder that your payment for <strong>${reminder.title}</strong> is due tomorrow.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${reminder.amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${formattedDate}</p>
            <p><strong>Category:</strong> ${reminder.category}</p>
          </div>
          <p>Please ensure your payment is made on time to avoid any late fees or service interruptions.</p>
          <a href="${Deno.env.get("APP_URL") || "http://localhost:5173"}/reminders" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px;">View Reminder</a>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;

      // Send the email
      try {
        const sendResult = await client.send({
          from: FROM_EMAIL,
          to: userEmail,
          subject: `Payment Reminder: ${reminder.title} Due Tomorrow`,
          html: reminderEmailContent,
        });
        
        console.log(`Sent reminder email to ${userEmail} for ${reminder.title}`);
        
        // Log the notification in the database
        await supabaseAdmin.from('email_notifications').insert({
          user_id: reminder.user_id,
          reminder_id: reminder.id,
          notification_type: 'reminder_due_tomorrow',
        });
      } catch (emailError) {
        console.error(`Error sending reminder email to ${userEmail}:`, emailError);
      }
    }

    // Process subscriptions
    for (const subscription of upcomingSubscriptions || []) {
      // Get user email using the user_id
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(subscription.user_id);
      const userEmail = userData?.user?.email;
      
      if (!userEmail) {
        console.log(`No email found for user ${subscription.user_id}, skipping notification`);
        continue;
      }

      const userName = userEmail.split('@')[0]; // Simple username extraction
      const formattedDate = new Date(subscription.next_billing_date).toLocaleDateString();
      
      // Generate email for subscription
      const subscriptionEmailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #333; margin-bottom: 20px;">Subscription Renewal Tomorrow</h1>
          <p>Hello ${userName},</p>
          <p>Your subscription to <strong>${subscription.name}</strong> is due for renewal tomorrow.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${subscription.amount.toFixed(2)}</p>
            <p><strong>Next Billing Date:</strong> ${formattedDate}</p>
            <p><strong>Category:</strong> ${subscription.category}</p>
          </div>
          <p>Please ensure your payment method is up to date to avoid any service interruptions.</p>
          <a href="${Deno.env.get("APP_URL") || "http://localhost:5173"}/subscriptions" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px;">View Subscription</a>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;

      // Send the email
      try {
        const sendResult = await client.send({
          from: FROM_EMAIL,
          to: userEmail,
          subject: `Subscription Renewal: ${subscription.name} Due Tomorrow`,
          html: subscriptionEmailContent,
        });
        
        console.log(`Sent subscription email to ${userEmail} for ${subscription.name}`);
        
        // Log the notification in the database
        await supabaseAdmin.from('email_notifications').insert({
          user_id: subscription.user_id,
          subscription_id: subscription.id,
          notification_type: 'subscription_due_tomorrow',
        });
      } catch (emailError) {
        console.error(`Error sending subscription email to ${userEmail}:`, emailError);
      }
    }

    // Close the connection
    await client.close();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Processed ${upcomingReminders?.length || 0} reminders and ${upcomingSubscriptions?.length || 0} subscriptions`,
        data: {
          reminders: upcomingReminders?.length || 0,
          subscriptions: upcomingSubscriptions?.length || 0,
        }
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in send-upcoming-notifications function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to process upcoming notifications" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
