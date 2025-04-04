
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequestBody {
  userEmail: string;
  userName?: string;
  type: "reminder" | "subscription";
  title: string;
  amount: number;
  dueDate: string;
  id: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resend = new Resend(RESEND_API_KEY);
    
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const body: EmailRequestBody = await req.json();
    const { userEmail, userName, type, title, amount, dueDate, id } = body;

    if (!userEmail || !type || !title || !amount || !dueDate || !id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Format the due date
    const formattedDate = new Date(dueDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Generate email content based on type
    let subject, emailContent;
    
    if (type === "reminder") {
      subject = `Payment Reminder: ${title} Due Soon`;
      emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #333; margin-bottom: 20px;">Payment Reminder</h1>
          <p>Hello ${userName || "there"},</p>
          <p>This is a friendly reminder that your payment for <strong>${title}</strong> is due soon.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${amount.toFixed(2)}</p>
            <p><strong>Due Date:</strong> ${formattedDate}</p>
          </div>
          <p>Please ensure your payment is made on time to avoid any late fees or service interruptions.</p>
          <a href="${Deno.env.get("APP_URL") || "http://localhost:5173"}/reminders" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px;">View Reminder</a>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;
    } else {
      subject = `Subscription Renewal: ${title} Coming Up`;
      emailContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #333; margin-bottom: 20px;">Subscription Renewal</h1>
          <p>Hello ${userName || "there"},</p>
          <p>Your subscription to <strong>${title}</strong> is due for renewal soon.</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
            <p><strong>Amount:</strong> ₹${amount.toFixed(2)}</p>
            <p><strong>Next Billing Date:</strong> ${formattedDate}</p>
          </div>
          <p>Please ensure your payment method is up to date to avoid any service interruptions.</p>
          <a href="${Deno.env.get("APP_URL") || "http://localhost:5173"}/subscriptions" style="display: inline-block; background-color: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin-top: 15px;">View Subscription</a>
          <p style="margin-top: 30px; font-size: 14px; color: #666;">This is an automated message. Please do not reply to this email.</p>
        </div>
      `;
    }

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "FinTrack <notifications@fintrack.app>",
      to: [userEmail],
      subject: subject,
      html: emailContent,
    });

    if (error) {
      console.error("Email sending error:", error);
      throw error;
    }

    console.log("Email sent successfully:", data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email notification sent to ${userEmail}`,
        data 
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in send-payment-reminder function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "Failed to send email notification" 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
