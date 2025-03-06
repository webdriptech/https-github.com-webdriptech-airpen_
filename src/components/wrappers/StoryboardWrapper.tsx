import React from "react";
import { MockConvexProvider } from "./MockConvexProvider";
import { MockClerkProvider } from "./MockClerkProvider";

interface StoryboardWrapperProps {
  children: React.ReactNode;
}

export function StoryboardWrapper({ children }: StoryboardWrapperProps) {
  return (
    <MockClerkProvider>
      <MockConvexProvider>{children}</MockConvexProvider>
    </MockClerkProvider>
  );
}
