
import { createClient } from '@supabase/supabase-js';

// Supabase public anon key - safe to use in browser
const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
