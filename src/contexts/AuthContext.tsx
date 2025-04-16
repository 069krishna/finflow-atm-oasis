
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  username: string;
  balance: number;
}

interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserBalance: (newBalance: number) => void;
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

  // Sample users database - in a real app, this would be handled by a backend
  const users = [
    { id: "1", username: "user1", password: "password1", balance: 10000 },
    { id: "2", username: "user2", password: "password2", balance: 10000 },
    { id: "3", username: "demo", password: "demo", balance: 10000 }
  ];

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      setCurrentUser(userWithoutPassword);
      localStorage.setItem("atm_user", JSON.stringify(userWithoutPassword));
      navigate("/dashboard");
    } else {
      throw new Error("Invalid username or password");
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("atm_user");
    navigate("/login");
  };
  
  const updateUserBalance = (newBalance: number) => {
    if (currentUser) {
      const updatedUser = {...currentUser, balance: newBalance};
      setCurrentUser(updatedUser);
      localStorage.setItem("atm_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, isLoading, login, logout, updateUserBalance }}>
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
