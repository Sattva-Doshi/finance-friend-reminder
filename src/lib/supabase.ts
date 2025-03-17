
import { supabase } from '@/integrations/supabase/client';

export type ReminderType = {
  id?: string;
  title: string;
  amount: number;
  dueDate: Date | string;
  category: string;
  recurring: boolean;
  priority: string;
  paid?: boolean;
  userId?: string;
  createdAt?: Date | string;
};

export type ExpenseType = {
  id?: string;
  title: string;
  amount: number;
  date: Date | string;
  category: string;
  paymentMethod: string;
  notes?: string;
  userId?: string;
  createdAt?: Date | string;
};

export type SubscriptionType = {
  id?: string;
  name: string;
  amount: number;
  billingCycle: string;
  category: string;
  startDate: Date | string;
  nextBillingDate: Date | string;
  website?: string;
  active?: boolean;
  userId?: string;
  createdAt?: Date | string;
};

export { supabase };
