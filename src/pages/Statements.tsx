
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Statements = () => {
  const [month, setMonth] = useState<Date | undefined>(new Date());
  const [statementType, setStatementType] = useState("all");

  // Sample statement data
  const statementTypes = [
    { value: "all", label: "All Transactions" },
    { value: "account", label: "Account Statement" },
    { value: "investment", label: "Investment Statement" },
  ];

  const downloadStatement = () => {
    // In a real app, this would generate and download a PDF statement
    alert(`Downloading ${statementType} statement for ${month ? format(month, 'MMMM yyyy') : 'current month'}`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Monthly Statements</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Generate Statement</CardTitle>
          <CardDescription>Download your account and transaction statements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Statement Type</label>
                <Select value={statementType} onValueChange={setStatementType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select statement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {statementTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Month & Year</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !month && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {month ? format(month, "MMMM yyyy") : "Select month"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={month}
                      onSelect={setMonth}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <Button onClick={downloadStatement} className="w-full sm:w-auto">
              <FileDown className="mr-2 h-4 w-4" />
              Generate & Download Statement
            </Button>
          </div>
          
          <div className="mt-8 p-4 border rounded-md bg-blue-50 text-blue-700">
            <h3 className="font-medium mb-2">About Monthly Statements</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Statements are generated in PDF format</li>
              <li>All transaction details are included with opening and closing balance</li>
              <li>Statements for the last 12 months are available</li>
              <li>You can use these statements for tax and record-keeping purposes</li>
            </ul>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Previous Statements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (i + 1));
              
              return (
                <div key={i} className="flex justify-between items-center p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{format(date, "MMMM yyyy")} Statement</p>
                    <p className="text-sm text-muted-foreground">All Transactions</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <FileDown className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Statements;
