
import { useState } from "react";
import { CalendarIcon, CreditCardIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
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
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { SubscriptionType } from "@/lib/supabase";

// Mock subscription categories with colors
const categories = [
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500" },
  { id: "productivity", name: "Productivity", color: "bg-blue-500" },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500" },
  { id: "food", name: "Food & Dining", color: "bg-orange-500" },
  { id: "health", name: "Health & Fitness", color: "bg-green-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
];

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const { subscriptions, addSubscription, cancelSubscription, getTotalMonthlyCost, isLoading } = useSubscriptions();

  const filteredSubscriptions = subscriptions.filter(subscription => {
    const matchesSearch = searchQuery === "" || 
      subscription.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || subscription.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const activeSubscriptions = filteredSubscriptions.filter(sub => sub.active);
  const inactiveSubscriptions = filteredSubscriptions.filter(sub => !sub.active);

  const handleAddSubscription = (values: any) => {
    // Calculate next billing date based on start date and billing cycle
    const startDate = new Date(values.startDate);
    let nextBillingDate = new Date(startDate);
    
    switch (values.billingCycle) {
      case "weekly":
        nextBillingDate.setDate(startDate.getDate() + 7);
        break;
      case "monthly":
        nextBillingDate.setMonth(startDate.getMonth() + 1);
        break;
      case "quarterly":
        nextBillingDate.setMonth(startDate.getMonth() + 3);
        break;
      case "biannually":
        nextBillingDate.setMonth(startDate.getMonth() + 6);
        break;
      case "yearly":
        nextBillingDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    const newSubscription: SubscriptionType = {
      name: values.name,
      amount: values.amount,
      billingCycle: values.billingCycle,
      category: values.category,
      startDate: values.startDate.toISOString(),
      nextBillingDate: nextBillingDate.toISOString(),
      website: values.website || "",
      active: true,
    };
    
    addSubscription(newSubscription);
    setShowAddModal(false);
  };

  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Subscription Management</h1>
            <p className="text-muted-foreground">Track and manage your recurring subscriptions</p>
          </div>
          
          <Button className="space-x-2" onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-4 w-4" />
            <span>Add Subscription</span>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Active Subscriptions</span>
                  <span className="text-3xl font-semibold">{subscriptions.filter(s => s.active).length}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Monthly Cost</span>
                  <span className="text-3xl font-semibold">${getTotalMonthlyCost().toFixed(2)}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Next Payment</span>
                  <span className="text-3xl font-semibold">
                    {subscriptions.length > 0 
                      ? new Date(
                          Math.min(
                            ...subscriptions
                              .filter(s => s.active)
                              .map(s => new Date(s.nextBillingDate).getTime())
                          )
                        ).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : 'N/A'
                    }
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search subscriptions..." 
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
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading subscriptions...</span>
              </div>
            ) : activeSubscriptions.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active subscriptions</h3>
                <p className="text-muted-foreground mb-6">Add your first subscription to start tracking recurring payments.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            ) : (
              <div className="grid-cards">
                {activeSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    id={subscription.id || ""}
                    name={subscription.name}
                    amount={subscription.amount}
                    billingCycle={subscription.billingCycle}
                    category={subscription.category}
                    nextBillingDate={new Date(subscription.nextBillingDate)}
                    website={subscription.website}
                    onCancel={cancelSubscription}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <span>Loading subscriptions...</span>
                </div>
              ) : activeSubscriptions.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                  <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {category.name} subscriptions</h3>
                  <p className="text-muted-foreground mb-6">Add your first {category.name.toLowerCase()} subscription.</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Subscription
                  </Button>
                </div>
              ) : (
                <div className="grid-cards">
                  {activeSubscriptions.map((subscription) => (
                    <SubscriptionCard
                      key={subscription.id}
                      id={subscription.id || ""}
                      name={subscription.name}
                      amount={subscription.amount}
                      billingCycle={subscription.billingCycle}
                      category={subscription.category}
                      nextBillingDate={new Date(subscription.nextBillingDate)}
                      website={subscription.website}
                      onCancel={cancelSubscription}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
          
          <TabsContent value="inactive" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading subscriptions...</span>
              </div>
            ) : inactiveSubscriptions.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <h3 className="text-lg font-medium mb-2">No inactive subscriptions</h3>
                <p className="text-muted-foreground">Canceled subscriptions will appear here.</p>
              </div>
            ) : (
              <div className="grid-cards">
                {inactiveSubscriptions.map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    id={subscription.id || ""}
                    name={subscription.name}
                    amount={subscription.amount}
                    billingCycle={subscription.billingCycle}
                    category={subscription.category}
                    nextBillingDate={new Date(subscription.nextBillingDate)}
                    website={subscription.website}
                    inactive={true}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <SubscriptionForm 
              onSubmit={handleAddSubscription}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  );
}
