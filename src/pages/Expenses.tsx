
import { useState } from "react";
import { CreditCardIcon, FilterIcon, MoreVerticalIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useExpenses } from "@/hooks/use-expenses";
import { ExpenseType } from "@/lib/supabase";
import { useIsMobile } from "@/hooks/use-mobile";

// Mock categories with icons and colors
const categories = [
  { id: "food", name: "Food & Dining", color: "bg-orange-500", percent: 35 },
  { id: "transportation", name: "Transportation", color: "bg-blue-500", percent: 15 },
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500", percent: 20 },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500", percent: 10 },
  { id: "shopping", name: "Shopping", color: "bg-pink-500", percent: 12 },
  { id: "other", name: "Other", color: "bg-gray-500", percent: 8 },
];

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const isMobile = useIsMobile();
  
  const { expenses, addExpense, isLoading } = useExpenses();

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery === "" || 
      expense.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || expense.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (values: any) => {
    const newExpense: ExpenseType = {
      title: values.title,
      amount: values.amount,
      date: values.date.toISOString(),
      category: values.category,
      paymentMethod: values.paymentMethod,
      notes: values.notes || "",
    };
    
    addExpense(newExpense);
    setShowAddModal(false);
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || "bg-gray-500";
  };
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Expense Tracker</h1>
            <p className="text-muted-foreground">Track your spending habits and manage your budget</p>
          </div>
          
          <Button className="space-x-2" onClick={() => setShowAddModal(true)}>
            <PlusIcon className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">Total Expenses</span>
                  <span className="text-3xl font-semibold">₹{totalSpent.toFixed(2)}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-3xl font-semibold">
                    ₹{expenses
                      .filter(e => {
                        const now = new Date();
                        const expenseDate = new Date(e.date);
                        return expenseDate.getMonth() === now.getMonth() && 
                               expenseDate.getFullYear() === now.getFullYear();
                      })
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search expenses..." 
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
                    <DropdownMenuItem>All Time</DropdownMenuItem>
                    <DropdownMenuItem>This Month</DropdownMenuItem>
                    <DropdownMenuItem>Last Month</DropdownMenuItem>
                    <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                    <DropdownMenuItem>Custom Range</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="all" className="mb-8" onValueChange={setActiveCategory}>
          <div className="w-full overflow-hidden">
            <ScrollArea className="w-full pb-4" orientation="horizontal">
              <TabsList className="mb-4 inline-flex w-max">
                <TabsTrigger value="all">All</TabsTrigger>
                {categories.map((category) => (
                  <TabsTrigger key={category.id} value={category.id}>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>
          
          <TabsContent value="all" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center p-12">
                <span>Loading expenses...</span>
              </div>
            ) : filteredExpenses.length === 0 ? (
              <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No expenses found</h3>
                <p className="text-muted-foreground mb-6">Add your first expense to start tracking your spending.</p>
                <Button onClick={() => setShowAddModal(true)}>
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Expense
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExpenses.map((expense) => (
                  <Card key={expense.id} className="overflow-hidden">
                    <div className="flex items-center p-4">
                      <div className={`w-2 self-stretch ${getCategoryColor(expense.category)}`}></div>
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{expense.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(expense.date).toLocaleDateString()} • {categories.find(c => c.id === expense.category)?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold">₹{expense.amount.toFixed(2)}</span>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVerticalIcon className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuItem>Delete</DropdownMenuItem>
                                <DropdownMenuItem>Duplicate</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          {categories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              {isLoading ? (
                <div className="flex justify-center p-12">
                  <span>Loading expenses...</span>
                </div>
              ) : filteredExpenses.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                  <CreditCardIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No {category.name} expenses</h3>
                  <p className="text-muted-foreground mb-6">Add your first {category.name.toLowerCase()} expense.</p>
                  <Button onClick={() => setShowAddModal(true)}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Expense
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExpenses.map((expense) => (
                    <Card key={expense.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className={`w-2 self-stretch ${getCategoryColor(expense.category)}`}></div>
                        <div className="flex-1 ml-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{expense.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(expense.date).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-semibold">₹{expense.amount.toFixed(2)}</span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVerticalIcon className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>Edit</DropdownMenuItem>
                                  <DropdownMenuItem>Delete</DropdownMenuItem>
                                  <DropdownMenuItem>Duplicate</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>

        <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <ExpenseForm 
              onSubmit={handleAddExpense}
              onCancel={() => setShowAddModal(false)}
            />
          </DialogContent>
        </Dialog>
      </main>
    </PageTransition>
  );
}
