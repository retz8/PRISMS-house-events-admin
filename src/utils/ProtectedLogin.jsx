import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { loggedInUserContext } from "../hooks/UserContext";

export default function ProtectedLogin({ children }) {
  const userContext = useContext(loggedInUserContext);
  if (!userContext) {
    return children;
  }
  return <Navigate to="/" replace />;
}
