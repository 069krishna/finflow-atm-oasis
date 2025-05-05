
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "transfer";
  amount: number;
  description: string;
  date: string;
  recipient?: string;
}

interface User {
  id: string;
  username: string;
  balance: number;
  email?: string;
  transactions: Transaction[];
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, password: string, email: string) => Promise<void>;
  updateUserBalance: (newBalance: number) => void;
  recordTransaction: (transaction: Omit<Transaction, "id" | "date">) => void;
  getUserTransactions: () => Transaction[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("atm_user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Load users from local storage or initialize default users
  const loadUsers = () => {
    const storedUsers = localStorage.getItem("atm_users");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      // Default users
      const defaultUsers = [
        { id: "1", username: "user1", password: "password1", balance: 10000, email: "user1@example.com", transactions: [] },
        { id: "2", username: "user2", password: "password2", balance: 10000, email: "user2@example.com", transactions: [] },
        { id: "3", username: "demo", password: "demo", balance: 10000, email: "demo@example.com", transactions: [] }
      ];
      localStorage.setItem("atm_users", JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  };

  // Save users to local storage
  const saveUsers = (users: any[]) => {
    localStorage.setItem("atm_users", JSON.stringify(users));
  };

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = loadUsers();
    const user = users.find((u: any) => u.username === username && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      
      // Initialize transactions array if it doesn't exist
      if (!userWithoutPassword.transactions) {
        userWithoutPassword.transactions = [];
      }
      
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("atm_user", JSON.stringify(userWithoutPassword));
      navigate("/dashboard");
    } else {
      throw new Error("Invalid username or password");
    }
    
    setIsLoading(false);
  };

  const register = async (username: string, password: string, email: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const users = loadUsers();
    
    // Check if username already exists
    if (users.some((u: any) => u.username === username)) {
      setIsLoading(false);
      throw new Error("Username already exists");
    }
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password,
      balance: 10000,
      email,
      transactions: []
    };
    
    // Add to users array
    users.push(newUser);
    saveUsers(users);
    
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("atm_user");
    navigate("/login");
  };
  
  const recordTransaction = (transaction: Omit<Transaction, "id" | "date">) => {
    if (!currentUser) return;
    
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    // Update in currentUser state
    const updatedTransactions = [...(currentUser.transactions || []), newTransaction];
    const updatedUser = {...currentUser, transactions: updatedTransactions};
    setCurrentUser(updatedUser);
    
    // Update in localStorage for current session
    localStorage.setItem("atm_user", JSON.stringify(updatedUser));
    
    // Update in users array in localStorage for persistence
    const users = loadUsers();
    const updatedUsers = users.map((u: any) => 
      u.id === currentUser.id ? {...u, transactions: updatedTransactions} : u
    );
    saveUsers(updatedUsers);
  };
  
  const updateUserBalance = (newBalance: number) => {
    if (currentUser) {
      // Update in currentUser state
      const updatedUser = {...currentUser, balance: newBalance};
      setCurrentUser(updatedUser);
      
      // Update in localStorage for current session
      localStorage.setItem("atm_user", JSON.stringify(updatedUser));
      
      // Update in users array in localStorage for persistence
      const users = loadUsers();
      const updatedUsers = users.map((u: any) => 
        u.id === currentUser.id ? {...u, balance: newBalance} : u
      );
      saveUsers(updatedUsers);
    }
  };
  
  const getUserTransactions = () => {
    return currentUser?.transactions || [];
  };

  return (
    <AuthContext.Provider value={{ 
      currentUser, 
      isLoading, 
      login, 
      logout, 
      register, 
      updateUserBalance, 
      recordTransaction,
      getUserTransactions
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
