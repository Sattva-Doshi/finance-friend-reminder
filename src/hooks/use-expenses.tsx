
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, ExpenseType } from '@/lib/supabase';
import { useToast } from './use-toast';

export function useExpenses() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all expenses
  const { data: expenses = [] } = useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });
      
      if (error) {
        console.error('Error fetching expenses:', error);
        toast({
          title: 'Error fetching expenses',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      return data.map(expense => ({
        ...expense,
        date: new Date(expense.date),
        id: expense.id,
        title: expense.title,
        amount: expense.amount,
        category: expense.category,
        paymentMethod: expense.payment_method,
        notes: expense.notes,
        userId: expense.user_id,
        createdAt: expense.created_at,
      }));
    },
  });

  // Add new expense
  const addExpenseMutation = useMutation({
    mutationFn: async (newExpense: ExpenseType) => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('expenses')
        .insert([{
          title: newExpense.title,
          amount: newExpense.amount,
          date: newExpense.date,
          category: newExpense.category,
          payment_method: newExpense.paymentMethod,
          notes: newExpense.notes,
          user_id: supabase.auth.getUser().then(({ data }) => data.user?.id),
          created_at: new Date().toISOString(),
        }])
        .select();
      
      if (error) {
        console.error('Error adding expense:', error);
        throw error;
      }
      
      setIsLoading(false);
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast({
        title: 'Success',
        description: 'Expense added successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to add expense',
        description: error.message,
        variant: 'destructive',
      });
      setIsLoading(false);
    },
  });

  // Get monthly expense data for chart
  const getMonthlyExpenseData = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentYear = new Date().getFullYear();
    const monthlyData = Array(12).fill(0);
    
    if (expenses.length === 0) return [];
    
    expenses.forEach(expense => {
      const expenseDate = new Date(expense.date);
      if (expenseDate.getFullYear() === currentYear) {
        const month = expenseDate.getMonth();
        monthlyData[month] += Number(expense.amount);
      }
    });
    
    return monthlyData.map((amount, index) => ({
      name: monthNames[index],
      amount: parseFloat(amount.toFixed(2)),
    }));
  };

  return {
    expenses,
    isLoading,
    addExpense: addExpenseMutation.mutate,
    getMonthlyExpenseData,
  };
}
