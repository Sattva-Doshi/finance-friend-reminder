
import { useState } from "react";
import { CalendarIcon, CreditCardIcon, FilterIcon, LineChartIcon, PlusIcon, SearchIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import PageTransition from "@/components/layout/PageTransition";
import ExpenseChart from "@/components/dashboard/ExpenseChart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/common/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// Mock data for demo
const expenseChartData = [
  { name: "Jan", amount: 2500 },
  { name: "Feb", amount: 3200 },
  { name: "Mar", amount: 2800 },
  { name: "Apr", amount: 3100 },
  { name: "May", amount: 2900 },
  { name: "Jun", amount: 3500 },
];

const expensesMockData = [
  {
    id: "1",
    description: "Grocery Shopping",
    amount: 125.75,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: "Food",
  },
  {
    id: "2",
    description: "Netflix Subscription",
    amount: 15.99,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: "Entertainment",
  },
  {
    id: "3",
    description: "Gas Station",
    amount: 45.50,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "Transportation",
  },
  {
    id: "4",
    description: "Lunch with colleagues",
    amount: 32.40,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    category: "Food",
  },
  {
    id: "5",
    description: "Electric Bill",
    amount: 95.20,
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    category: "Utilities",
  },
  {
    id: "6",
    description: "Shopping Mall",
    amount: 210.15,
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    category: "Shopping",
  },
  {
    id: "7",
    description: "Dinner with friends",
    amount: 78.90,
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    category: "Food",
  },
];

const categoryColors: Record<string, string> = {
  Food: "bg-blue-500",
  Entertainment: "bg-purple-500",
  Transportation: "bg-orange-500",
  Utilities: "bg-green-500",
  Shopping: "bg-red-500",
  Other: "bg-gray-500",
};

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredExpenses = expensesMockData.filter(expense => 
    searchQuery === "" || 
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <PageTransition>
      <Navbar />
      <main className="page-container animate-fadeIn">
        <div className="page-header flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="page-title">Expense Tracker</h1>
            <p className="text-muted-foreground">Track and analyze your spending patterns</p>
          </div>
          
          <Button className="space-x-2">
            <PlusIcon className="h-4 w-4" />
            <span>Add Expense</span>
          </Button>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search expenses..." 
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
                    <DropdownMenuItem>All Categories</DropdownMenuItem>
                    <DropdownMenuItem>Food</DropdownMenuItem>
                    <DropdownMenuItem>Entertainment</DropdownMenuItem>
                    <DropdownMenuItem>Transportation</DropdownMenuItem>
                    <DropdownMenuItem>Utilities</DropdownMenuItem>
                    <DropdownMenuItem>Shopping</DropdownMenuItem>
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
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <ExpenseChart data={expenseChartData} />
          </div>
          
          <Card>
            <CardHeader>
              <h3 className="text-lg font-medium">Expense Categories</h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-blue-500 mr-2`}></div>
                    <span>Food</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">$237.05</span>
                    <span className="text-muted-foreground ml-2 text-sm">(35%)</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-purple-500 mr-2`}></div>
                    <span>Entertainment</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">$15.99</span>
                    <span className="text-muted-foreground ml-2 text-sm">(2%)</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-orange-500 mr-2`}></div>
                    <span>Transportation</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">$45.50</span>
                    <span className="text-muted-foreground ml-2 text-sm">(7%)</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-green-500 mr-2`}></div>
                    <span>Utilities</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">$95.20</span>
                    <span className="text-muted-foreground ml-2 text-sm">(14%)</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full bg-red-500 mr-2`}></div>
                    <span>Shopping</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">$210.15</span>
                    <span className="text-muted-foreground ml-2 text-sm">(32%)</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Tabs defaultValue="recent" className="mb-8">
          <TabsList>
            <TabsTrigger value="recent">Recent Expenses</TabsTrigger>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 font-medium">Description</th>
                        <th className="text-left py-4 px-6 font-medium">Category</th>
                        <th className="text-left py-4 px-6 font-medium">Date</th>
                        <th className="text-right py-4 px-6 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6">{expense.description}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${categoryColors[expense.category] || "bg-gray-500"} mr-2`}></div>
                              {expense.category}
                            </div>
                          </td>
                          <td className="py-4 px-6">{expense.date.toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-right font-medium">${expense.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="month" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium">June 2023</h3>
                  <div className="flex items-center">
                    <LineChartIcon className="h-5 w-5 text-muted-foreground mr-2" />
                    <span className="text-lg font-semibold">Total: $603.89</span>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Last Week</h4>
                    <div className="space-y-3">
                      {filteredExpenses.slice(0, 3).map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${categoryColors[expense.category] || "bg-gray-500"} flex items-center justify-center text-white mr-3`}>
                              {expense.category.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-muted-foreground">{expense.date.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-3">Previous Week</h4>
                    <div className="space-y-3">
                      {filteredExpenses.slice(3, 7).map((expense) => (
                        <div key={expense.id} className="flex items-center justify-between py-2 border-b">
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full ${categoryColors[expense.category] || "bg-gray-500"} flex items-center justify-center text-white mr-3`}>
                              {expense.category.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium">{expense.description}</p>
                              <p className="text-sm text-muted-foreground">{expense.date.toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="font-semibold">${expense.amount.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="all" className="mt-6">
            <Card>
              <CardContent className="p-0">
                <div className="overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-4 px-6 font-medium">Description</th>
                        <th className="text-left py-4 px-6 font-medium">Category</th>
                        <th className="text-left py-4 px-6 font-medium">Date</th>
                        <th className="text-right py-4 px-6 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredExpenses.map((expense) => (
                        <tr key={expense.id} className="border-b hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-6">{expense.description}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full ${categoryColors[expense.category] || "bg-gray-500"} mr-2`}></div>
                              {expense.category}
                            </div>
                          </td>
                          <td className="py-4 px-6">{expense.date.toLocaleDateString()}</td>
                          <td className="py-4 px-6 text-right font-medium">${expense.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </PageTransition>
  );
}
