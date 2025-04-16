
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRightLeft, CreditCard, PiggyBank, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
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
  
  // Sample recent transactions - in a real app, these would come from a database
  const recentTransactions = [
    { id: 1, type: "Deposit", amount: 5000, date: "2025-04-15" },
    { id: 2, type: "Withdrawal", amount: -2000, date: "2025-04-14" },
    { id: 3, type: "Transfer", amount: -1500, date: "2025-04-13" }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome, {currentUser?.username}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardDescription>Available Balance</CardDescription>
            <CardTitle className="text-3xl font-bold">
              {formatCurrency(currentUser?.balance || 0)}
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
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">{transaction.type}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <p className={`font-semibold ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
