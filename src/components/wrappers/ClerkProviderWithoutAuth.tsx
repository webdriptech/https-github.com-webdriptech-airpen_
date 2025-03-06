import { ClerkProvider } from "@clerk/clerk-react";
import React from "react";

interface ClerkProviderWithoutAuthProps {
  children: React.ReactNode;
}

export function ClerkProviderWithoutAuth({
  children,
}: ClerkProviderWithoutAuthProps) {
  const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
  }

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      afterSignOutUrl="/"
      jwtTemplate="convex"
    >
      {children}
    </ClerkProvider>
  );
}
