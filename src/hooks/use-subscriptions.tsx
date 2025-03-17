
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
        .order('next_billing_date', { ascending: true });
      
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
        id: subscription.id,
        name: subscription.name,
        amount: subscription.amount,
        billingCycle: subscription.billing_cycle,
        category: subscription.category,
        startDate: new Date(subscription.start_date),
        nextBillingDate: new Date(subscription.next_billing_date),
        website: subscription.website,
        active: subscription.active,
        userId: subscription.user_id,
        createdAt: subscription.created_at,
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
          name: newSubscription.name,
          amount: newSubscription.amount,
          billing_cycle: newSubscription.billingCycle,
          category: newSubscription.category,
          start_date: new Date().toISOString(),
          next_billing_date: newSubscription.nextBillingDate,
          website: newSubscription.website,
          active: true,
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          created_at: new Date().toISOString(),
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
        let monthlyCost = Number(sub.amount);
        
        switch (sub.billingCycle) {
          case 'weekly': 
            monthlyCost = Number(sub.amount) * 4.33; // Average weeks in a month
            break;
          case 'yearly':
            monthlyCost = Number(sub.amount) / 12;
            break;
          case 'quarterly':
            monthlyCost = Number(sub.amount) / 3;
            break;
          case 'biannually':
            monthlyCost = Number(sub.amount) / 6;
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
