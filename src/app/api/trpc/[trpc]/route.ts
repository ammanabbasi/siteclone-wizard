import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { type NextRequest, NextResponse } from 'next/server';
import { appRouter } from '@/server/api/root';
import { createTRPCContext } from '@/server/api/trpc';

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: () => createTRPCContext({ req, res: NextResponse }),
  });

export { handler as GET, handler as POST };