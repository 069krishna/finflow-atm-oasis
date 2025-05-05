
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDown, ArrowUp, ArrowRightLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";

const Transactions = () => {
  const { getUserTransactions } = useAuth();
  const [filter, setFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Get transactions from auth context
  const allTransactions = getUserTransactions();
  
  const filteredTransactions = filter === "all" 
    ? allTransactions 
    : allTransactions.filter(t => t.type === filter);
  
  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(startIndex, startIndex + itemsPerPage);
  
  // Format currency to Indian Rupees
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', { 
      day: '2-digit',
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
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
              : `Showing only ${filter}s`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paginatedTransactions.length > 0 ? (
              paginatedTransactions.map((transaction) => (
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
                      {transaction.recipient && (
                        <p className="text-sm text-muted-foreground">To: {transaction.recipient}</p>
                      )}
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
          
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious onClick={() => setCurrentPage(p => p - 1)} />
                    </PaginationItem>
                  )}
                  
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext onClick={() => setCurrentPage(p => p + 1)} />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
