
import { useState } from 'react';
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface BudgetCategory {
  name: string;
  value: number;
  color: string;
}

const BudgetTracker = () => {
  const [totalBudget, setTotalBudget] = useState(2500);
  const [spentAmount, setSpentAmount] = useState(1860);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const budgetData: BudgetCategory[] = [
    { name: 'Accommodation', value: 800, color: '#4F46E5' },
    { name: 'Transportation', value: 350, color: '#10B981' },
    { name: 'Food & Drinks', value: 450, color: '#F59E0B' },
    { name: 'Activities', value: 200, color: '#EC4899' },
    { name: 'Shopping', value: 60, color: '#8B5CF6' },
  ];
  
  const remainingAmount = totalBudget - spentAmount;
  const percentSpent = Math.round((spentAmount / totalBudget) * 100);
  
  const savingSuggestions = [
    {
      id: 1,
      suggestion: 'Use public transportation instead of taxis',
      savings: 35,
      category: 'Transportation',
    },
    {
      id: 2,
      suggestion: 'Book accommodation with kitchen facilities',
      savings: 120,
      category: 'Food & Drinks',
    },
    {
      id: 3,
      suggestion: 'Visit free museums on discount days',
      savings: 45,
      category: 'Activities',
    },
  ];
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(value);
  };
  
  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };
  
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-xl font-semibold">Budget Tracker</h2>
        <button className="btn-outline text-sm py-2">Update Budget</button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overview */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-secondary rounded-xl">
            <div>
              <p className="text-muted-foreground text-sm">Total Budget</p>
              <p className="text-2xl font-display font-semibold">{formatCurrency(totalBudget)}</p>
            </div>
            <div className="p-3 bg-white rounded-full shadow-sm">
              <DollarSign size={24} className="text-primary" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-green-700 text-sm">Remaining</p>
                  <p className="text-xl font-display font-semibold text-green-700">
                    {formatCurrency(remainingAmount)}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingDown size={18} className="text-green-700" />
                </div>
              </div>
              <p className="text-xs text-green-600 mt-2">
                {(100 - percentSpent)}% of budget left
              </p>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-xl">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-orange-700 text-sm">Spent</p>
                  <p className="text-xl font-display font-semibold text-orange-700">
                    {formatCurrency(spentAmount)}
                  </p>
                </div>
                <div className="p-2 bg-orange-100 rounded-full">
                  <TrendingUp size={18} className="text-orange-700" />
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2">
                {percentSpent}% of budget used
              </p>
            </div>
          </div>
          
          {/* Savings Suggestions */}
          <div className="p-4 border border-border rounded-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium flex items-center">
                <AlertCircle size={16} className="mr-2 text-primary" />
                Savings Suggestions
              </h3>
              <button 
                onClick={toggleSuggestions}
                className="text-xs text-primary hover:text-primary/80"
              >
                {showSuggestions ? 'Hide' : 'Show'}
              </button>
            </div>
            
            {showSuggestions && (
              <div className="space-y-3 mt-3">
                {savingSuggestions.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <div>
                      <p className="text-sm">{item.suggestion}</p>
                      <p className="text-xs text-muted-foreground mt-1">Category: {item.category}</p>
                    </div>
                    <span className="text-green-600 font-medium text-sm">
                      Save {formatCurrency(item.savings)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Chart & Breakdown */}
        <div>
          <div className="h-64 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {budgetData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-2">
            {budgetData.map((category) => (
              <div key={category.name} className="flex items-center justify-between p-2">
                <div className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <span className="text-sm">{category.name}</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm font-medium">{formatCurrency(category.value)}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({Math.round((category.value / spentAmount) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BudgetTracker;
