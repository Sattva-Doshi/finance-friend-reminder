
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export function useNotifications() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

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

  return {
    isLoading,
    sendReminderEmail: sendReminderEmailMutation.mutate,
    sendSubscriptionEmail: sendSubscriptionEmailMutation.mutate,
  };
}
