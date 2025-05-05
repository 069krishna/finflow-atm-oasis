
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { ArrowDown, ArrowUp, ArrowRightLeft } from "lucide-react";

const Transfer = () => {
  const { currentUser, updateUserBalance, recordTransaction } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deposit");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  const handleTransaction = () => {
    setIsProcessing(true);
    
    // Input validation
    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
      });
      setIsProcessing(false);
      return;
    }
    
    // Additional validation for withdrawal
    if (activeTab === "withdraw" && numAmount > (currentUser?.balance || 0)) {
      toast({
        variant: "destructive",
        title: "Insufficient balance",
        description: "You don't have enough balance for this withdrawal",
      });
      setIsProcessing(false);
      return;
    }
    
    // Additional validation for transfer
    if (activeTab === "transfer") {
      if (!recipient) {
        toast({
          variant: "destructive",
          title: "Missing recipient",
          description: "Please enter a recipient account number",
        });
        setIsProcessing(false);
        return;
      }
      
      if (numAmount > (currentUser?.balance || 0)) {
        toast({
          variant: "destructive",
          title: "Insufficient balance",
          description: "You don't have enough balance for this transfer",
        });
        setIsProcessing(false);
        return;
      }
    }
    
    // Simulate processing delay
    setTimeout(() => {
      let newBalance = currentUser?.balance || 0;
      let action = "";
      let transactionType: "deposit" | "withdrawal" | "transfer";
      let transactionDescription = "";
      
      switch (activeTab) {
        case "deposit":
          newBalance += numAmount;
          action = "deposited";
          transactionType = "deposit";
          transactionDescription = "Cash Deposit";
          break;
        case "withdraw":
          newBalance -= numAmount;
          action = "withdrawn";
          transactionType = "withdrawal";
          transactionDescription = "Cash Withdrawal";
          break;
        case "transfer":
          newBalance -= numAmount;
          action = "transferred";
          transactionType = "transfer";
          transactionDescription = "Money Transfer";
          break;
      }
      
      // Update user balance first
      updateUserBalance(newBalance);
      
      // Record the transaction
      recordTransaction({
        type: transactionType,
        amount: numAmount,
        description: transactionDescription,
        recipient: activeTab === "transfer" ? recipient : undefined
      });
      
      toast({
        title: "Transaction successful",
        description: `You have ${action} ${formatCurrency(numAmount)}${activeTab === "transfer" ? ` to ${recipient}` : ""}.`,
      });
      
      // Reset form
      setAmount("");
      setRecipient("");
      setIsProcessing(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Deposit & Withdraw</h1>
      
      <Card className="max-w-2xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="deposit" className="flex items-center">
              <ArrowDown className="h-4 w-4 mr-2" /> Deposit
            </TabsTrigger>
            <TabsTrigger value="withdraw" className="flex items-center">
              <ArrowUp className="h-4 w-4 mr-2" /> Withdraw
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center">
              <ArrowRightLeft className="h-4 w-4 mr-2" /> Transfer
            </TabsTrigger>
          </TabsList>
          
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="balance">Current Balance</Label>
                  <p className="font-bold">{formatCurrency(currentUser?.balance || 0)}</p>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5">₹</span>
                    <Input 
                      id="amount" 
                      type="number" 
                      min="1" 
                      placeholder="Enter amount" 
                      className="pl-8"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </div>
                </div>
                
                {activeTab === "transfer" && (
                  <div>
                    <Label htmlFor="recipient">Recipient Account Number</Label>
                    <Input 
                      id="recipient" 
                      placeholder="Enter recipient account number" 
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end border-t pt-4">
            <Button onClick={handleTransaction} disabled={isProcessing}>
              {isProcessing ? "Processing..." : `Proceed with ${activeTab}`}
            </Button>
          </CardFooter>
        </Tabs>
      </Card>
    </div>
  );
};

export default Transfer;
