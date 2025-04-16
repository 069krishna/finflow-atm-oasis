
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, ArrowRightLeft } from "lucide-react";

const Transactions = () => {
  const [filter, setFilter] = useState<string>("all");
  
  // Sample transactions - in a real app, these would come from a database
  const allTransactions = [
    { id: 1, type: "deposit", description: "Salary Deposit", amount: 25000, date: "2025-04-15" },
    { id: 2, type: "withdrawal", description: "ATM Withdrawal", amount: -5000, date: "2025-04-14" },
    { id: 3, type: "transfer", description: "Transfer to Rahul", amount: -3000, date: "2025-04-13" },
    { id: 4, type: "deposit", description: "Refund", amount: 1200, date: "2025-04-12" },
    { id: 5, type: "withdrawal", description: "Cash Withdrawal", amount: -2000, date: "2025-04-10" },
    { id: 6, type: "transfer", description: "Utility Bill Payment", amount: -1500, date: "2025-04-08" },
    { id: 7, type: "deposit", description: "Interest Credit", amount: 800, date: "2025-04-05" },
  ];
  
  const filteredTransactions = filter === "all" 
    ? allTransactions 
    : allTransactions.filter(t => t.type === filter);
  
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDown className="h-5 w-5 text-green-500" />;
      case "withdrawal":
        return <ArrowUp className="h-5 w-5 text-red-500" />;
      case "transfer":
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };
  
  const getTransactionClass = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-50 border-green-100";
      case "withdrawal":
        return "bg-red-50 border-red-100";
      case "transfer":
        return "bg-blue-50 border-blue-100";
      default:
        return "bg-gray-50";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Transactions</h1>
        
        <div className="flex items-center space-x-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="deposit">Deposits</SelectItem>
              <SelectItem value="withdrawal">Withdrawals</SelectItem>
              <SelectItem value="transfer">Transfers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filter === "all" 
              ? "All transactions" 
              : `Showing only ${filter}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`flex justify-between items-center p-4 border rounded-lg ${getTransactionClass(transaction.type)}`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="bg-white p-2 rounded-full border">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
