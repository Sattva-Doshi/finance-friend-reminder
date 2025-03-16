
import { useState } from "react";
import { BellIcon, CalendarIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ReminderCard from "@/components/reminders/ReminderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for demo
const remindersMockData = [
  {
    id: "1",
    title: "Credit Card Bill",
    amount: 1250.00,
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    category: "credit-card" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "2",
    title: "Netflix Subscription",
    amount: 15.99,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    category: "subscription" as const,
    paid: false,
    recurring: true,
    priority: "medium" as const,
  },
  {
    id: "3",
    title: "Home Loan EMI",
    amount: 1875.50,
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    category: "emi" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "4",
    title: "Utility Bill",
    amount: 85.75,
    dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    category: "utility" as const,
    paid: false,
    recurring: true,
    priority: "medium" as const,
  },
  {
    id: "5",
    title: "Apartment Rent",
    amount: 2100.00,
    dueDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days from now
    category: "rent" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "6",
    title: "Car Insurance",
    amount: 105.50,
    dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (overdue)
    category: "other" as const,
    paid: false,
    recurring: true,
    priority: "high" as const,
  },
  {
    id: "7",
    title: "Spotify Premium",
    amount: 9.99,
    dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago (paid)
    category: "subscription" as const,
    paid: true,
    recurring: true,
    priority: "low" as const,
  },
];

export default function Reminders() {
  const [reminders, setReminders] = useState(remindersMockData);
  const [searchQuery, setSearchQuery] = useState("");
  
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
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Payment Reminders</h1>
            <p className="text-muted-foreground">Manage all your recurring payments and due dates</p>
          </div>
          
          <Button className="space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add Reminder</span>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search reminders..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex gap-4">
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
                    <DropdownMenuItem>Upcoming Due</DropdownMenuItem>
                    <DropdownMenuItem>Overdue</DropdownMenuItem>
                    <DropdownMenuItem>Credit Cards</DropdownMenuItem>
                    <DropdownMenuItem>Subscriptions</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button variant="outline" className="space-x-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>By Date</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {filteredReminders(false).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {filteredReminders(false).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="all">All Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="upcoming" className="mt-6">
            {filteredReminders(false).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <BellIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No upcoming reminders</h3>
                <p className="text-muted-foreground mb-6">You're all caught up! Add a new reminder to stay on track.</p>
                <Button>
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
                <BellIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No paid reminders</h3>
                <p className="text-muted-foreground">Paid reminders will appear here once you mark them as paid.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReminders(true).map((reminder) => (
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
                    onMarkPaid={handleMarkPaid}
                    onSnooze={handleSnooze}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </PageTransition>
  );
}
