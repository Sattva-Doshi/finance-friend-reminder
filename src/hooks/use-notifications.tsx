
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useNotifications() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // Track email notification in the database
  const trackNotification = async (
    type: 'reminder' | 'subscription', 
    id: string,
    status: string = 'sent'
  ) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('email_notifications')
        .insert({
          user_id: user.id,
          reminder_id: type === 'reminder' ? id : null,
          subscription_id: type === 'subscription' ? id : null,
          notification_type: type,
          status: status,
        })
        .select()
        .single();

      if (error) {
        console.error('Error tracking notification:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to track notification:', error);
      return null;
    }
  };

  // Send email notification for reminder
  const sendReminderEmailMutation = useMutation({
    mutationFn: async ({ 
      id, 
      title, 
      amount, 
      dueDate 
    }: { 
      id: string, 
      title: string, 
      amount: number, 
      dueDate: Date | string 
    }) => {
      setIsLoading(true);
      
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email;
        
        if (!userEmail) {
          throw new Error('User email not found');
        }

        // Get user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('email_notifications')
          .eq('id', user.id)
          .single();

        // Check if user has enabled email notifications
        if (preferences && preferences.email_notifications === false) {
          console.log('User has disabled email notifications');
          return { skipped: true };
        }

        // Send email notification using edge function
        const { data, error } = await supabase.functions.invoke('send-payment-reminder', {
          body: {
            userEmail,
            userName: user.email?.split('@')[0],
            type: 'reminder',
            title,
            amount,
            dueDate: new Date(dueDate).toISOString(),
            id,
          },
        });

        if (error) {
          throw error;
        }

        // Track the notification in the database
        await trackNotification('reminder', id);
        
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      if (data && !data.skipped) {
        toast({
          title: 'Reminder Email Sent',
          description: 'The reminder notification was sent successfully.',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Send Reminder',
        description: error.message || 'An error occurred while sending the reminder.',
        variant: 'destructive',
      });
    },
  });

  // Send email notification for subscription
  const sendSubscriptionEmailMutation = useMutation({
    mutationFn: async ({ 
      id, 
      name, 
      amount, 
      nextBillingDate 
    }: { 
      id: string, 
      name: string, 
      amount: number, 
      nextBillingDate: Date | string 
    }) => {
      setIsLoading(true);
      
      try {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // Get user email from auth
        const { data: userData } = await supabase.auth.getUser();
        const userEmail = userData.user?.email;
        
        if (!userEmail) {
          throw new Error('User email not found');
        }

        // Get user preferences
        const { data: preferences } = await supabase
          .from('user_preferences')
          .select('email_notifications')
          .eq('id', user.id)
          .single();

        // Check if user has enabled email notifications
        if (preferences && preferences.email_notifications === false) {
          console.log('User has disabled email notifications');
          return { skipped: true };
        }

        // Send email notification using edge function
        const { data, error } = await supabase.functions.invoke('send-payment-reminder', {
          body: {
            userEmail,
            userName: user.email?.split('@')[0],
            type: 'subscription',
            title: name,
            amount,
            dueDate: new Date(nextBillingDate).toISOString(),
            id,
          },
        });

        if (error) {
          throw error;
        }

        // Track the notification in the database
        await trackNotification('subscription', id);
        
        return data;
      } finally {
        setIsLoading(false);
      }
    },
    onSuccess: (data) => {
      if (data && !data.skipped) {
        toast({
          title: 'Subscription Email Sent',
          description: 'The subscription renewal notification was sent successfully.',
        });
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to Send Notification',
        description: error.message || 'An error occurred while sending the notification.',
        variant: 'destructive',
      });
    },
  });

  // Get notification history for the current user
  const getNotificationHistory = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('email_notifications')
        .select(`
          id,
          notification_type,
          sent_at,
          status,
          reminders(title, amount, due_date),
          subscriptions(name, amount, next_billing_date)
        `)
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false });

      if (error) {
        console.error('Error fetching notification history:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  };

  return {
    isLoading,
    sendReminderEmail: sendReminderEmailMutation.mutate,
    sendSubscriptionEmail: sendSubscriptionEmailMutation.mutate,
    getNotificationHistory,
  };
}
