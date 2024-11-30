import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";
import CustomCursor from "./CustomCursor";

interface ProtectedRouteProps {
  children?: ReactNode;

}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isInitialized } = useAuth();

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  // if (!user) {
  //   return <Navigate to="/login" replace />;
  // }

  return  children ? <><CustomCursor/>
  {children}</> : <Outlet />;
};

export default ProtectedRoute;
