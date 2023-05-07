import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  if(isAuthenticated === false) return <Navigate to="/login" />;
  if (user.role === "user"){ 
    return <Navigate to="/login" />
  }
  else{
        return <Outlet/>;
    }
 
};

export default AdminProtectedRoute;
