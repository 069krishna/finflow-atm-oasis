import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightLeft, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const { currentUser, getUserTransactions } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  
  // Update balance whenever currentUser changes
  useEffect(() => {
    if (currentUser) {
      setBalance(currentUser.balance);
    }
  }, [currentUser]);
  
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const quickActions = [
    {
      name: "Deposit",
      icon: <PiggyBank className="h-6 w-6" />,
      color: "text-green-500",
      bg: "bg-green-100",
      action: () => navigate("/transfer")
    },
    {
      name: "Withdraw",
      icon: <CreditCard className="h-6 w-6" />,
      color: "text-red-500",
      bg: "bg-red-100",
      action: () => navigate("/transfer")
    },
    {
      name: "Transfer",
      icon: <ArrowRightLeft className="h-6 w-6" />,
      color: "text-blue-500",
      bg: "bg-blue-100",
      action: () => navigate("/transfer")
    },
    {
      name: "Invest",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "text-purple-500",
      bg: "bg-purple-100",
      action: () => navigate("/investments")
    }
  ];
  
  // Get recent transactions (last 5)
  const recentTransactions = getUserTransactions()
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Get transaction icon based on type
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <PiggyBank className="h-5 w-5 text-green-500" />;
      case "withdrawal":
        return <CreditCard className="h-5 w-5 text-red-500" />;
      case "transfer":
        return <ArrowRightLeft className="h-5 w-5 text-blue-500" />;
      default:
        return <ArrowRightLeft className="h-5 w-5" />;
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
      <h1 className="text-3xl font-bold">Welcome, {currentUser?.username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(balance)}
            </CardTitle>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="flex flex-col items-center p-4 h-auto"
                  onClick={action.action}
                >
                  <div className={`${action.bg} rounded-full p-2 mb-2`}>
                    <div className={action.color}>{action.icon}</div>
                  </div>
                  <span className="text-xs">{action.name}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm"
            onClick={() => navigate("/transactions")}
          >
            View All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <div 
                  key={transaction.id} 
                  className={`flex justify-between items-center p-3 border rounded-md ${getTransactionClass(transaction.type)}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="bg-white p-2 rounded-full border">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === "deposit" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.type === "deposit" ? "+" : "-"}{formatCurrency(Math.abs(transaction.amount))}
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

export default Dashboard;
