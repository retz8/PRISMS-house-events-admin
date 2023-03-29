import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { loggedInUserContext } from "../hooks/UserContext";

export default function Protected({ children }) {
  const userContext = useContext(loggedInUserContext);
  if (
    userContext &&
    (userContext.role === "Admin" || userContext.role === "HouseLeader")
  ) {
    return children;
  }
  window.alert("You are NOT Admin or House Leader!");
  return <Navigate to="/" replace />;
}
