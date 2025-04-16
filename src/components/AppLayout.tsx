
import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  Home, 
  ArrowRightLeft, 
  PiggyBank, 
  TrendingUp, 
  FileText, 
  Settings, 
  Menu,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const { logout } = useAuth();
  
  const sidebarItems = [
    { name: "Dashboard", path: "/dashboard", icon: <Home className="w-5 h-5" /> },
    { name: "Transactions", path: "/transactions", icon: <ArrowRightLeft className="w-5 h-5" /> },
    { name: "Deposit/Withdraw", path: "/transfer", icon: <PiggyBank className="w-5 h-5" /> },
    { name: "Investments", path: "/investments", icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Statements", path: "/statements", icon: <FileText className="w-5 h-5" /> },
    { name: "Settings", path: "/settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div 
        className={cn(
          "bg-sidebar fixed inset-y-0 left-0 z-50 flex flex-col border-r bg-background transition-all duration-300 ease-in-out",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="flex items-center justify-between px-4 py-6">
          {isSidebarOpen && (
            <Link to="/dashboard" className="font-bold text-xl text-primary">
              FinFlow ATM
            </Link>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="rounded-full"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
        
        <nav className="flex-1 space-y-1 px-2 py-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md transition-colors",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted",
                !isSidebarOpen && "justify-center"
              )}
            >
              {item.icon}
              {isSidebarOpen && <span className="ml-3">{item.name}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <Button 
            variant="ghost" 
            className={cn(
              "flex items-center w-full",
              !isSidebarOpen && "justify-center"
            )}
            onClick={logout}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className={cn("flex-1 p-8", isSidebarOpen ? "ml-64" : "ml-16")}>
        <Outlet />
      </div>
    </div>
  );
};

export default AppLayout;
