
import { useState } from "react";
import { PlusIcon, ArrowUpDownIcon, FilterIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ReminderCard from "@/components/reminders/ReminderCard";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/common/Card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useReminders } from "@/hooks/use-reminders";
import { ReminderType } from "@/lib/supabase";

export default function Reminders() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState("upcoming");
  
  const { reminders, addReminder, markReminderPaid, snoozeReminder, isLoading } = useReminders();

  // Filter reminders based on search query and status
  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = searchQuery === "" || 
      reminder.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === "upcoming") {
      return matchesSearch && !reminder.paid;
    } else if (filterStatus === "paid") {
      return matchesSearch && reminder.paid;
    }
    
    return matchesSearch;
  });

  const handleAddReminder = (values: any) => {
    const newReminder: ReminderType = {
      title: values.title,
      amount: values.amount,
      dueDate: values.dueDate.toISOString(),
      category: values.category,
      recurring: values.recurring,
      priority: values.priority,
      paid: false,
    };
    
    addReminder(newReminder);
    setShowAddModal(false);
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Payment Reminders</h1>
            <p className="text-muted-foreground">Track your upcoming payments and bills</p>
          </div>
          
          <Button className="space-x-2" onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-4 w-4" />
            <span>Add Reminder</span>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Upcoming Payments</span>
                  <span className="text-3xl font-semibold">{reminders.filter(r => !r.paid).length}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Due Amount</span>
                  <span className="text-3xl font-semibold">
                    ${reminders
                      .filter(r => !r.paid)
                      .reduce((sum, reminder) => sum + reminder.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search reminders..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="space-x-2">
                  <FilterIcon className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="upcoming" className="mb-8" onValueChange={setFilterStatus}>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading reminders...</span>
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <h3 className="text-lg font-medium mb-2">No upcoming reminders</h3>
                <p className="text-muted-foreground mb-6">Add your first reminder to start tracking payments.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredReminders.map((reminder) => (
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
                    onMarkPaid={markReminderPaid}
                    onSnooze={snoozeReminder}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paid" className="mt-6">
            {/* Similar content for paid reminders */}
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading reminders...</span>
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <h3 className="text-lg font-medium mb-2">No paid reminders</h3>
                <p className="text-muted-foreground">Reminders you mark as paid will appear here.</p>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredReminders.map((reminder) => (
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
                    onMarkPaid={markReminderPaid}
                    onSnooze={snoozeReminder}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            {/* Similar content for all reminders */}
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading reminders...</span>
              </div>
            ) : filteredReminders.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <h3 className="text-lg font-medium mb-2">No reminders found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your search or add a new reminder.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {filteredReminders.map((reminder) => (
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
                    onMarkPaid={markReminderPaid}
                    onSnooze={snoozeReminder}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Reminder</DialogTitle>
            </DialogHeader>
            <ReminderForm 
              onSubmit={handleAddReminder}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  );
}
