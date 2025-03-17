
import { useState } from "react";
import { CreditCardIcon, FilterIcon, MoreVerticalIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import { ExpenseForm } from "@/components/expenses/ExpenseForm";
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

// Mock categories with icons and colors
const categories = [
  { id: "food", name: "Food & Dining", color: "bg-orange-500", percent: 35 },
  { id: "transportation", name: "Transportation", color: "bg-blue-500", percent: 15 },
  { id: "entertainment", name: "Entertainment", color: "bg-purple-500", percent: 20 },
  { id: "utilities", name: "Utilities", color: "bg-yellow-500", percent: 10 },
  { id: "shopping", name: "Shopping", color: "bg-pink-500", percent: 12 },
  { id: "other", name: "Other", color: "bg-gray-500", percent: 8 },
];

// Mock expense data
const expensesMockData = [
  { 
    id: "1",
    title: "Grocery Shopping",
    amount: 78.35,
    date: new Date(2023, 6, 15),
    category: "food",
    paymentMethod: "credit_card",
  },
  { 
    id: "2",
    title: "Movie Tickets",
    amount: 24.99,
    date: new Date(2023, 6, 18),
    category: "entertainment",
    paymentMethod: "debit_card",
  },
  { 
    id: "3",
    title: "Gas",
    amount: 45.50,
    date: new Date(2023, 6, 20),
    category: "transportation",
    paymentMethod: "credit_card",
  },
  { 
    id: "4",
    title: "Electric Bill",
    amount: 110.25,
    date: new Date(2023, 6, 22),
    category: "utilities",
    paymentMethod: "bank_transfer",
  },
  { 
    id: "5",
    title: "New Shoes",
    amount: 89.99,
    date: new Date(2023, 6, 25),
    category: "shopping",
    paymentMethod: "credit_card",
  },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState(expensesMockData);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = searchQuery === "" || 
      expense.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || expense.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const totalSpent = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const handleAddExpense = (values: any) => {
    const newExpense = {
      id: `${expenses.length + 1}`,
      title: values.title,
      amount: values.amount,
      date: values.date,
      category: values.category,
      paymentMethod: values.paymentMethod,
      notes: values.notes,
    };
    
    setExpenses([newExpense, ...expenses]);
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
                  <span className="text-3xl font-semibold">${totalSpent.toFixed(2)}</span>
                </div>
                <div className="h-12 w-px bg-border"></div>
                <div className="flex flex-col">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="text-3xl font-semibold">${totalSpent.toFixed(2)}</span>
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
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {filteredExpenses.length === 0 ? (
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
                              {expense.date.toLocaleDateString()} • {categories.find(c => c.id === expense.category)?.name}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
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
              {filteredExpenses.length === 0 ? (
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
                                {expense.date.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-4">
                              <span className="text-lg font-semibold">${expense.amount.toFixed(2)}</span>
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
