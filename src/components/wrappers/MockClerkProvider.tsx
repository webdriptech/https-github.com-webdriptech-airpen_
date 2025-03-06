import React from "react";

interface MockClerkProviderProps {
  children: React.ReactNode;
}

export const useUser = () => ({
  user: {
    id: "test-user-id",
    fullName: "Test User",
    firstName: "Test",
    primaryEmailAddress: {
      emailAddress: "test@example.com",
      verification: { status: "verified", strategy: "test" },
    },
    createdAt: new Date().toISOString(),
    lastSignInAt: new Date().toISOString(),
    imageUrl: "",
  },
  isLoaded: true,
});

export const SignInButton = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const UserButton = () => null;

export function MockClerkProvider({ children }: MockClerkProviderProps) {
  return <>{children}</>;
}
