
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, SubscriptionType } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useSubscriptions() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all subscriptions
  const { data: subscriptions = [] } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .order('nextBillingDate', { ascending: true });
      
      if (error) {
        console.error('Error fetching subscriptions:', error);
        toast({
          title: 'Error fetching subscriptions',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data.map(subscription => ({
        ...subscription,
        startDate: new Date(subscription.startDate),
        nextBillingDate: new Date(subscription.nextBillingDate),
      }));
    },
  });

  // Add new subscription
  const addSubscriptionMutation = useMutation({
    mutationFn: async (newSubscription: SubscriptionType) => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([{
          ...newSubscription,
          active: true,
          createdAt: new Date().toISOString(),
        }])
        .select();
      
      if (error) {
        console.error('Error adding subscription:', error);
        throw error;
      }
      
      setIsLoading(false);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast({
        title: 'Success',
        description: 'Subscription added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add subscription',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  // Cancel subscription
  const cancelSubscriptionMutation = useMutation({
    mutationFn: async (subscriptionId: string) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({ active: false })
        .eq('id', subscriptionId)
        .select();
      
      if (error) {
        console.error('Error canceling subscription:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to cancel subscription',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Get total monthly subscription cost
  const getTotalMonthlyCost = () => {
    return subscriptions
      .filter(sub => sub.active)
      .reduce((total, sub) => {
        // Normalize all subscriptions to monthly cost
        let monthlyCost = sub.amount;
        
        switch (sub.billingCycle) {
          case 'weekly': 
            monthlyCost = sub.amount * 4.33; // Average weeks in a month
            break;
          case 'yearly':
            monthlyCost = sub.amount / 12;
            break;
          case 'quarterly':
            monthlyCost = sub.amount / 3;
            break;
          case 'biannually':
            monthlyCost = sub.amount / 6;
            break;
        }
        
        return total + monthlyCost;
      }, 0);
  };

  return {
    subscriptions,
    isLoading,
    addSubscription: addSubscriptionMutation.mutate,
    cancelSubscription: cancelSubscriptionMutation.mutate,
    getTotalMonthlyCost,
  };
}
