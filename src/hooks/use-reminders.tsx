
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, ReminderType } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useReminders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all reminders
  const { data: reminders = [] } = useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reminders')
        .select('*')
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching reminders:', error);
        toast({
          title: 'Error fetching reminders',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data.map(reminder => ({
        ...reminder,
        id: reminder.id,
        title: reminder.title,
        amount: reminder.amount,
        dueDate: new Date(reminder.due_date),
        category: reminder.category,
        recurring: reminder.recurring,
        priority: reminder.priority,
        paid: reminder.paid,
        userId: reminder.user_id,
        createdAt: reminder.created_at,
      }));
    },
  });

  // Add new reminder
  const addReminderMutation = useMutation({
    mutationFn: async (newReminder: ReminderType) => {
      setIsLoading(true);
      
      try {
        // First, get the current user ID
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) {
          throw new Error('User not authenticated');
        }
        
        console.log('Submitting reminder:', {
          ...newReminder,
          dueDate: newReminder.dueDate instanceof Date ? newReminder.dueDate.toISOString() : newReminder.dueDate
        });
        
        const { data, error } = await supabase
          .from('reminders')
          .insert({
            title: newReminder.title,
            amount: newReminder.amount,
            due_date: newReminder.dueDate instanceof Date ? newReminder.dueDate.toISOString() : newReminder.dueDate,
            category: newReminder.category,
            recurring: newReminder.recurring,
            priority: newReminder.priority,
            paid: false,
            user_id: userData.user.id,
            created_at: new Date().toISOString(),
          })
          .select();
        
        if (error) {
          console.error('Error adding reminder:', error);
          throw error;
        }
        
        setIsLoading(false);
        return data[0];
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast({
        title: 'Success',
        description: 'Reminder added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add reminder',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  // Mark reminder as paid
  const markReminderPaidMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const { data, error } = await supabase
        .from('reminders')
        .update({ paid: true })
        .eq('id', reminderId)
        .select();
      
      if (error) {
        console.error('Error marking reminder as paid:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update reminder',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Snooze reminder (update dueDate to +1 day)
  const snoozeReminderMutation = useMutation({
    mutationFn: async (reminderId: string) => {
      const reminder = reminders.find(r => r.id === reminderId);
      if (!reminder) throw new Error('Reminder not found');
      
      const newDueDate = new Date(reminder.dueDate);
      newDueDate.setDate(newDueDate.getDate() + 1);
      
      const { data, error } = await supabase
        .from('reminders')
        .update({ due_date: newDueDate.toISOString() })
        .eq('id', reminderId)
        .select();
      
      if (error) {
        console.error('Error snoozing reminder:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to snooze reminder',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  return {
    reminders,
    isLoading,
    addReminder: addReminderMutation.mutate,
    markReminderPaid: markReminderPaidMutation.mutate,
    snoozeReminder: snoozeReminderMutation.mutate,
  };
}
