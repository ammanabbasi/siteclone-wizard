// Temporarily disabled TRPC configuration due to type issues
// TODO: Fix TRPC v11 configuration

// Placeholder export - TRPC temporarily disabled
export const api = {
  useQuery: () => ({ data: null, isLoading: false, error: null }),
  useMutation: () => ({ mutate: () => {}, isLoading: false }),
} as any;