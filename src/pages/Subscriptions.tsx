import { useState } from "react";
import { CreditCardIcon, FilterIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import SubscriptionCard from "@/components/subscriptions/SubscriptionCard";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

// Mock data for demo
const subscriptionsMockData = [
  {
    id: "1",
    name: "Netflix",
    amount: 15.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Netflix_2015_logo.svg/1920px-Netflix_2015_logo.svg.png",
    active: true,
    url: "https://netflix.com",
  },
  {
    id: "2",
    name: "Spotify",
    amount: 9.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/26/Spotify_logo_with_text.svg/1920px-Spotify_logo_with_text.svg.png",
    active: true,
    url: "https://spotify.com",
  },
  {
    id: "3",
    name: "Amazon Prime",
    amount: 14.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1920px-Amazon_logo.svg.png",
    active: true,
    url: "https://amazon.com",
  },
  {
    id: "4",
    name: "Disney+",
    amount: 7.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Disney%2B_logo.svg/1920px-Disney%2B_logo.svg.png",
    active: true,
    url: "https://disneyplus.com",
  },
  {
    id: "5",
    name: "YouTube Premium",
    amount: 11.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/1920px-YouTube_full-color_icon_%282017%29.svg.png",
    active: false,
    url: "https://youtube.com",
  },
  {
    id: "6",
    name: "Apple Music",
    amount: 9.99,
    billingCycle: "monthly" as const,
    nextBillingDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/1920px-Apple_Music_logo.svg.png",
    active: false,
    url: "https://music.apple.com",
  },
];

export default function Subscriptions() {
  const [subscriptions, setSubscriptions] = useState(subscriptionsMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  
  const handleToggleActive = (id: string) => {
    setSubscriptions(subscriptions.map(subscription => 
      subscription.id === id ? { ...subscription, active: !subscription.active } : subscription
    ));
  };
  
  const filteredSubscriptions = (filterActive: boolean) => {
    return subscriptions
      .filter(subscription => subscription.active === filterActive)
      .filter(subscription => 
        searchQuery === "" || 
        subscription.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
  };
  
  const calculateTotalMonthlyCost = (subs: typeof subscriptions) => {
    return subs
      .filter(sub => sub.active)
      .reduce((total, sub) => {
        if (sub.billingCycle === "monthly") {
          return total + sub.amount;
        } else if (sub.billingCycle === "yearly") {
          return total + (sub.amount / 12);
        } else {
          return total + (sub.amount * 4); // weekly -> monthly
        }
      }, 0);
  };

  const handleAddSubscription = (values: any) => {
    const newSubscription = {
      id: `${subscriptions.length + 1}`,
      name: values.name,
      amount: values.amount,
      billingCycle: values.billingCycle,
      nextBillingDate: values.nextBillingDate,
      logo: values.logo || "",
      active: true,
      url: values.url || undefined,
    };
    
    setSubscriptions([newSubscription, ...subscriptions]);
    setShowAddModal(false);
  };
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Subscription Manager</h1>
            <p className="text-muted-foreground">Track and manage all your recurring subscriptions</p>
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
                  <span className="text-sm text-muted-foreground">Monthly Cost</span>
                  <span className="text-3xl font-semibold">${calculateTotalMonthlyCost(subscriptions).toFixed(2)}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Active Subscriptions</span>
                  <span className="text-3xl font-semibold">{filteredSubscriptions(true).length}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Yearly Cost</span>
                  <span className="text-3xl font-semibold">${(calculateTotalMonthlyCost(subscriptions) * 12).toFixed(2)}</span>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="space-x-2">
                      <FilterIcon className="h-4 w-4" />
                      <span>Filter</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>All Subscriptions</DropdownMenuItem>
                    <DropdownMenuItem>Monthly</DropdownMenuItem>
                    <DropdownMenuItem>Yearly</DropdownMenuItem>
                    <DropdownMenuItem>Due Soon</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="active" className="mb-8">
          <TabsList>
            <TabsTrigger value="active" className="relative">
              Active
              {filteredSubscriptions(true).length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {filteredSubscriptions(true).length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="paused">Paused</TabsTrigger>
            <TabsTrigger value="all">All Subscriptions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="mt-6">
            {filteredSubscriptions(true).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No active subscriptions</h3>
                <p className="text-muted-foreground mb-6">You don't have any active subscriptions. Add one to start tracking.</p>
                <Button>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Subscription
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscriptions(true).map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    {...subscription}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="paused" className="mt-6">
            {filteredSubscriptions(false).length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No paused subscriptions</h3>
                <p className="text-muted-foreground">Paused subscriptions will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubscriptions(false).map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    {...subscription}
                    onToggleActive={handleToggleActive}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subscriptions
                .filter(subscription => 
                  searchQuery === "" || 
                  subscription.name.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((subscription) => (
                  <SubscriptionCard
                    key={subscription.id}
                    {...subscription}
                    onToggleActive={handleToggleActive}
                  />
                ))}
            </div>
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
