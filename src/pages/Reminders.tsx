
import { useState } from "react";
import { CreditCardIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ReminderCard from "@/components/reminders/ReminderCard";
import { ReminderForm } from "@/components/reminders/ReminderForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for demo
const remindersMockData = [
  {
    id: "1",
    title: "Credit Card Bill",
    amount: 350.50,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    category: "credit-card" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Rent Payment",
    amount: 1200.00,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    category: "rent" as const,
    paid: false,
    recurring: true,
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Car EMI",
    amount: 450.75,
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    category: "emi" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "4",
    title: "Internet Bill",
    amount: 59.99,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    category: "utility" as const,
    paid: false,
    recurring: true,
    priority: "low" as const,
  },
  {
    id: "5",
    title: "Electricity Bill",
    amount: 85.50,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    category: "utility" as const,
    paid: true,
    recurring: true,
    priority: "medium" as const,
  },
];

export default function Reminders() {
  const [reminders, setReminders] = useState(remindersMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleMarkPaid = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, paid: true } : reminder
    ));
  };
  
  const handleSnooze = (id: string) => {
    setReminders(reminders.map(reminder => {
      if (reminder.id === id) {
        const newDueDate = new Date(reminder.dueDate);
        newDueDate.setDate(newDueDate.getDate() + 1);
        return { ...reminder, dueDate: newDueDate };
      }
      return reminder;
    }));
  };
  
  const filteredReminders = (filterPaid: boolean) => {
    return reminders
      .filter(reminder => reminder.paid === filterPaid)
      .filter(reminder => 
        searchQuery === "" || 
        reminder.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };

  const handleAddReminder = (values: any) => {
    const newReminder = {
      id: `${reminders.length + 1}`,
      title: values.title,
      amount: values.amount,
      dueDate: values.dueDate,
      category: values.category,
      paid: false,
      recurring: values.recurring,
      priority: values.priority,
    };
    
    setReminders([newReminder, ...reminders]);
    setShowAddModal(false);
  };
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Bill & Payment Reminders</h1>
            <p className="text-muted-foreground">Never miss a payment again with smart reminders</p>
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
                  <span className="text-sm text-muted-foreground">Pending Reminders</span>
                  <span className="text-3xl font-semibold">{filteredReminders(false).length}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Due Amount</span>
                  <span className="text-3xl font-semibold">${filteredReminders(false).reduce((sum, reminder) => sum + reminder.amount, 0).toFixed(2)}</span>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="space-x-2">
                      <FilterIcon className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Reminders</DropdownMenuItem>
                    <DropdownMenuItem>High Priority</DropdownMenuItem>
                    <DropdownMenuItem>Medium Priority</DropdownMenuItem>
                    <DropdownMenuItem>Low Priority</DropdownMenuItem>
                    <DropdownMenuItem>Due Soon</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="pending" className="mb-8">
          <TabsList>
            <TabsTrigger value="pending" className="relative">
              Pending
              {filteredReminders(false).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {filteredReminders(false).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="all">All Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="mt-6">
            {filteredReminders(false).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No pending reminders</h3>
                <p className="text-muted-foreground mb-6">You're all caught up! Add a new reminder to stay on top of upcoming bills.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Reminder
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReminders(false).map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    {...reminder}
                    onMarkPaid={handleMarkPaid}
                    onSnooze={handleSnooze}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paid" className="mt-6">
            {filteredReminders(true).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No paid reminders</h3>
                <p className="text-muted-foreground">Paid reminders will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReminders(true).map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    {...reminder}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reminders
                .filter(reminder => 
                  searchQuery === "" || 
                  reminder.title.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((reminder) => (
                  <ReminderCard
                    key={reminder.id}
                    {...reminder}
                    onMarkPaid={!reminder.paid ? handleMarkPaid : undefined}
                    onSnooze={!reminder.paid ? handleSnooze : undefined}
                  />
                ))}
            </div>
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
