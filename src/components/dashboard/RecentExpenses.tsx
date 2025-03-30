
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCardIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ExpenseType } from '@/lib/supabase';

interface RecentExpensesProps {
  expenses: ExpenseType[];
}

export const RecentExpenses: React.FC<RecentExpensesProps> = ({
  expenses
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Recent Expenses</h2>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/expenses')}>
          View all <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <CreditCardIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No recent expenses</p>
            <Button size="sm" variant="outline" onClick={() => navigate('/expenses')}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Expense
            </Button>
          </div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
              <div>
                <p className="font-medium">{expense.title}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
              <span className="font-semibold">${expense.amount.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
