import { createTRPCNext } from '@trpc/next';
import { httpBatchLink } from '@trpc/client';
import { type AppRouter } from '@/server/api/root';
import { getBaseUrl } from './utils';
import superjson from 'superjson';

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
    };
  },
  ssr: false,
});