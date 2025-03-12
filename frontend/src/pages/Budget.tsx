
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BudgetTracker from '../components/BudgetTracker';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, DollarSign, RefreshCw, Download, Filter } from 'lucide-react';
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Expense {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

const Budget = () => {
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      date: '2023-12-01',
      category: 'Accommodation',
      description: 'Le Grand Paris Hotel',
      amount: 200,
    },
    {
      id: '2',
      date: '2023-12-01',
      category: 'Activities',
      description: 'Eiffel Tower Entry',
      amount: 25,
    },
    {
      id: '3',
      date: '2023-12-01',
      category: 'Food & Drinks',
      description: 'Lunch at Le Jules Verne',
      amount: 120,
    },
    {
      id: '4',
      date: '2023-12-02',
      category: 'Transportation',
      description: 'Metro Pass',
      amount: 15,
    },
    {
      id: '5',
      date: '2023-12-02',
      category: 'Activities',
      description: 'Seine River Cruise',
      amount: 35,
    },
  ]);
  
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  const categoryColors = {
    'Accommodation': 'bg-indigo-100 text-indigo-700',
    'Transportation': 'bg-green-100 text-green-700',
    'Food & Drinks': 'bg-amber-100 text-amber-700',
    'Activities': 'bg-pink-100 text-pink-700',
    'Shopping': 'bg-purple-100 text-purple-700',
    'Other': 'bg-gray-100 text-gray-700',
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const filteredExpenses = expenses.filter((expense) => {
    if (filter === 'all') return true;
    return expense.category === filter;
  });
  
  const sortedExpenses = [...filteredExpenses].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'amount') {
      return b.amount - a.amount;
    }
    return 0;
  });
  
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const handleAddExpense = () => {
    toast.success("Expense added successfully!");
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-8">
        {/* Budget Header */}
        <section className="bg-secondary/50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  Budget Management
                </span>
                <h1 className="text-3xl font-bold mt-2">Trip Budget</h1>
                <p className="text-muted-foreground">Track and manage your trip expenses</p>
              </div>
              
              <div className="flex gap-3 mt-4 md:mt-0">
                <Button variant="outline" size="sm" className="flex items-center">
                  <Download className="mr-2 h-4 w-4" /> Export
                </Button>
                <Button size="sm" className="flex items-center" onClick={handleAddExpense}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Add Expense
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Budget Content */}
        <section className="py-8 container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Budget Overview */}
            <div className="lg:col-span-1">
              <BudgetTracker />
            </div>
            
            {/* Expenses List */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Expenses</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filter and Sort */}
                  <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      <Button 
                        variant={filter === 'all' ? 'default' : 'outline'} 
                        size="sm"
                        onClick={() => setFilter('all')}
                      >
                        All Categories
                      </Button>
                      {Object.keys(categoryColors).map((category) => (
                        <Button 
                          key={category}
                          variant={filter === category ? 'default' : 'outline'} 
                          size="sm"
                          onClick={() => setFilter(category)}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Sort by:</span>
                      <select 
                        className="bg-background border border-input rounded-md p-1.5 text-sm"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Expenses Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b">
                          <th className="pb-3 font-medium text-muted-foreground text-sm">Date</th>
                          <th className="pb-3 font-medium text-muted-foreground text-sm">Category</th>
                          <th className="pb-3 font-medium text-muted-foreground text-sm">Description</th>
                          <th className="pb-3 font-medium text-muted-foreground text-sm text-right">Amount</th>
                          <th className="pb-3 font-medium text-muted-foreground text-sm text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedExpenses.map((expense) => (
                          <tr key={expense.id} className="border-b">
                            <td className="py-3 text-sm">{formatDate(expense.date)}</td>
                            <td className="py-3">
                              <span 
                                className={`px-2 py-1 text-xs rounded-full ${
                                  categoryColors[expense.category as keyof typeof categoryColors]
                                }`}
                              >
                                {expense.category}
                              </span>
                            </td>
                            <td className="py-3 text-sm">{expense.description}</td>
                            <td className="py-3 text-sm font-medium text-right">
                              {formatCurrency(expense.amount)}
                            </td>
                            <td className="py-3 flex justify-center">
                              <Button variant="ghost" size="icon">
                                <MinusCircle className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="border-t">
                          <td colSpan={3} className="py-3 text-sm font-medium">Total</td>
                          <td className="py-3 text-right font-bold">{formatCurrency(totalExpenses)}</td>
                          <td></td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                  
                  {sortedExpenses.length === 0 && (
                    <div className="text-center py-10">
                      <DollarSign className="mx-auto text-muted-foreground mb-2 h-10 w-10" />
                      <p className="text-muted-foreground">
                        No expenses found for the selected filter.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Budget;
