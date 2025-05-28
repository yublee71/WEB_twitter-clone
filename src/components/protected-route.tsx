import type React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = auth.currentUser;
  console.log(user);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}
