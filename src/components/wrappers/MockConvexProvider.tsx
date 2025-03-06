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

// Mock the ConvexReactClient
class MockConvexReactClient {
  constructor() {}
}

// Mock the ConvexProvider
export function MockConvexProvider({ children }: MockConvexProviderProps) {
  // Create a context that mimics the ConvexReactContext
  const mockContext = {
    client: new MockConvexReactClient(),
    useQuery,
    useMutation,
    useAction,
    Authenticated,
    Unauthenticated,
  };

  return <div data-convex-provider>{children}</div>;
}
