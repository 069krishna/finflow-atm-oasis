
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AuthLayout = () => {
  const { currentUser, isLoading } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !currentUser) {
      navigate("/login");
    }
  }, [currentUser, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  return currentUser ? <Outlet /> : null;
};

export default AuthLayout;
