
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { SubscriptionForm } from "@/components/subscriptions/SubscriptionForm";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubscriptions } from "@/hooks/use-subscriptions";
import { SubscriptionType } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";
import { SubscriptionHeader } from "@/components/subscriptions/SubscriptionHeader";
import { SubscriptionStatsCard } from "@/components/subscriptions/SubscriptionStatsCard";
import { SubscriptionCategoryTabs, categories } from "@/components/subscriptions/SubscriptionCategoryTabs";
import { SubscriptionTabContent } from "@/components/subscriptions/SubscriptionTabContent";

export default function Subscriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const isMobile = useIsMobile();
  
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
    const newSubscription: SubscriptionType = {
      name: values.name,
      amount: values.amount,
      billingCycle: values.billingCycle,
      category: values.category || "other",
      startDate: new Date().toISOString(),
      nextBillingDate: values.nextBillingDate.toISOString(),
      website: values.website || "",
      active: true,
    };
    
    addSubscription(newSubscription);
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => setShowAddModal(true);

  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <SubscriptionHeader onAddClick={handleOpenAddModal} />
        
        <SubscriptionStatsCard 
          subscriptions={subscriptions} 
          totalMonthlyCost={getTotalMonthlyCost()}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        
        <div className="w-full">
          <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
            <SubscriptionCategoryTabs 
              activeCategory={activeCategory} 
              onChange={setActiveCategory} 
            />
            
            <SubscriptionTabContent 
              value="all"
              subscriptions={activeSubscriptions}
              isLoading={isLoading}
              onCancelSubscription={cancelSubscription}
              onAddClick={handleOpenAddModal}
            />
            
            {categories.map((category) => (
              <SubscriptionTabContent 
                key={category.id}
                value={category.id}
                subscriptions={activeSubscriptions.filter(sub => sub.category === category.id)}
                isLoading={isLoading}
                onCancelSubscription={cancelSubscription}
                onAddClick={handleOpenAddModal}
              />
            ))}
            
            <SubscriptionTabContent 
              value="inactive"
              subscriptions={inactiveSubscriptions}
              isLoading={isLoading}
              onAddClick={handleOpenAddModal}
              isInactiveTab={true}
            />
          </Tabs>
        </div>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader>
              <DialogTitle>Add New Subscription</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-auto pr-4">
              <div className="pb-2">
                <SubscriptionForm 
                  onSubmit={handleAddSubscription}
                  onCancel={() => setShowAddModal(false)}
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  );
}
