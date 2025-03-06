import React from "react";

interface MockConvexProviderProps {
  children: React.ReactNode;
}

// Create mock versions of Convex hooks
export const useQuery = () => null;
export const useMutation = () => () => Promise.resolve();
export const useAction = () => () => Promise.resolve();

// Mock authentication components
export const Authenticated = ({ children }: { children: React.ReactNode }) => (
  <>{children}</>
);
export const Unauthenticated = ({
  children,
}: {
  children: React.ReactNode;
}) => <>{children}</>;

// Mock the ConvexProvider
export function MockConvexProvider({ children }: MockConvexProviderProps) {
  return <>{children}</>;
}
