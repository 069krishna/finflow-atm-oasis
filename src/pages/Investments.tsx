
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { TrendingUp, AlertCircle, ChevronRight } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Sample mutual funds data
const mutualFunds = [
  {
    id: 1,
    name: "FinFlow Equity Fund",
    category: "Equity - Large Cap",
    returns: "14.5%",
    risk: "Moderate",
    minInvestment: 1000,
    description: "A diversified large-cap equity fund aiming for long-term capital appreciation through investments in blue-chip companies."
  },
  {
    id: 2,
    name: "FinFlow Tax Saver",
    category: "ELSS",
    returns: "12.8%",
    risk: "Moderate-High",
    minInvestment: 500,
    description: "An Equity Linked Savings Scheme (ELSS) offering tax benefits under Section 80C with a 3-year lock-in period."
  },
  {
    id: 3,
    name: "FinFlow Balanced Advantage",
    category: "Hybrid",
    returns: "10.2%",
    risk: "Moderate",
    minInvestment: 1000,
    description: "A balanced fund that dynamically manages equity and debt allocation based on market conditions."
  },
  {
    id: 4,
    name: "FinFlow Liquid Fund",
    category: "Liquid",
    returns: "5.5%",
    risk: "Low",
    minInvestment: 5000,
    description: "A liquid fund investing in short-term money market instruments with high liquidity and low risk."
  },
  {
    id: 5,
    name: "FinFlow Mid-Cap Opportunities",
    category: "Equity - Mid Cap",
    returns: "16.7%",
    risk: "High",
    minInvestment: 1000,
    description: "A fund focusing on mid-sized companies with high growth potential."
  }
];

const Investments = () => {
  const { currentUser, updateUserBalance } = useAuth();
  const { toast } = useToast();
  const [selectedFund, setSelectedFund] = useState<typeof mutualFunds[0] | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [isInvesting, setIsInvesting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  // Risk color mapping
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600 bg-green-50";
      case "Moderate":
        return "text-amber-600 bg-amber-50";
      case "Moderate-High":
        return "text-orange-600 bg-orange-50";
      case "High":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };
  
  const handleInvest = () => {
    setIsInvesting(true);
    
    // Input validation
    const amount = Number(investmentAmount);
    
    if (!amount || amount <= 0 || !selectedFund) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid investment amount",
      });
      setIsInvesting(false);
      return;
    }
    
    if (amount < selectedFund.minInvestment) {
      toast({
        variant: "destructive",
        title: "Below minimum investment",
        description: `Minimum investment for this fund is ${formatCurrency(selectedFund.minInvestment)}`,
      });
      setIsInvesting(false);
      return;
    }
    
    if (amount > (currentUser?.balance || 0)) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "You don't have enough balance for this investment",
      });
      setIsInvesting(false);
      return;
    }
    
    // Simulate processing delay
    setTimeout(() => {
      // Update user balance
      updateUserBalance((currentUser?.balance || 0) - amount);
      
      toast({
        title: "Investment successful",
        description: `You have invested ${formatCurrency(amount)} in ${selectedFund.name}`,
      });
      
      // Reset form and close dialog
      setInvestmentAmount("");
      setDialogOpen(false);
      setIsInvesting(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Investments</h1>
      
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Investment Disclaimer</AlertTitle>
        <AlertDescription>
          Mutual fund investments are subject to market risks. Past performance is not indicative of future returns.
        </AlertDescription>
      </Alert>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
              Available for Investment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(currentUser?.balance || 0)}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Recommended Mutual Funds</CardTitle>
          <CardDescription>Select a fund to invest in</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mutualFunds.map((fund) => (
              <Dialog open={dialogOpen && selectedFund?.id === fund.id} onOpenChange={(open) => {
                setDialogOpen(open);
                if (!open) setSelectedFund(null);
              }}>
                <DialogTrigger asChild key={fund.id}>
                  <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedFund(fund)}>
                    <div>
                      <h3 className="font-medium">{fund.name}</h3>
                      <p className="text-sm text-muted-foreground">{fund.category}</p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-green-600">{fund.returns} <span className="text-xs">Returns (p.a.)</span></p>
                        <p className={`text-xs px-2 py-1 rounded-full inline-block ${getRiskColor(fund.risk)}`}>{fund.risk} Risk</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </DialogTrigger>
                
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{fund.name}</DialogTitle>
                    <DialogDescription className="pt-2">
                      <span className="font-medium">{fund.category} | {fund.returns} Returns | {fund.risk} Risk</span>
                      <p className="mt-2">{fund.description}</p>
                      <div className="mt-4 p-3 bg-gray-50 rounded-md">
                        <p className="text-sm font-medium">Minimum Investment: {formatCurrency(fund.minInvestment)}</p>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-3 py-4">
                    <div>
                      <p className="text-sm font-medium mb-1">Investment Amount</p>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">₹</span>
                        <Input 
                          type="number" 
                          placeholder="Enter amount" 
                          className="pl-8"
                          value={investmentAmount}
                          onChange={(e) => setInvestmentAmount(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleInvest} disabled={isInvesting}>
                      {isInvesting ? "Processing..." : "Invest Now"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Investments;
