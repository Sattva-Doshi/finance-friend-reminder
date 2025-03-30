
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, ArrowRightIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReminderCard from "@/components/reminders/ReminderCard";
import { ReminderType } from '@/lib/supabase';

interface UpcomingRemindersProps {
  reminders: ReminderType[];
  onMarkPaid: (id: string) => void;
  onSnooze: (id: string) => void;
}

export const UpcomingReminders: React.FC<UpcomingRemindersProps> = ({
  reminders,
  onMarkPaid,
  onSnooze
}) => {
  const navigate = useNavigate();
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Upcoming Payments</h2>
        <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/reminders')}>
          View all <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {reminders.length === 0 ? (
          <div className="text-center py-8 bg-muted/30 rounded-lg border border-dashed">
            <BellIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-4">No upcoming payments</p>
            <Button size="sm" variant="outline" onClick={() => navigate('/reminders')}>
              <PlusIcon className="h-4 w-4 mr-1" />
              Add Reminder
            </Button>
          </div>
        ) : (
          reminders.map((reminder) => (
            <ReminderCard
              key={reminder.id}
              id={reminder.id || ""}
              title={reminder.title}
              amount={reminder.amount}
              dueDate={new Date(reminder.dueDate)}
              category={reminder.category as any}
              paid={reminder.paid || false}
              recurring={reminder.recurring}
              priority={reminder.priority as any}
              onMarkPaid={onMarkPaid}
              onSnooze={onSnooze}
            />
          ))
        )}
      </div>
    </div>
  );
};
