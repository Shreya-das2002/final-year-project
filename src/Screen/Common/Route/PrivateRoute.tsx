import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../../store/store";

interface Props {
  children: React.ReactNode;
}

const PrivateRoute = ({ children }: Props) => {
  const isAuth = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  return isAuth ? <>{children}</> : <Navigate to="/registrationlogin/login" replace />;
};

export default PrivateRoute;
