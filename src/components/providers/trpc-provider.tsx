'use client';

import { ReactNode } from 'react';

// Temporarily disabled TRPC provider due to type issues
// TODO: Fix TRPC v11 configuration

export function TRPCProvider({ children }: { children: ReactNode }) {
  // Return children directly without TRPC wrapper for now
  return <>{children}</>;
} 