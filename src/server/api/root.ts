import { createTRPCRouter } from '@/server/api/trpc';
import { dealerRouter } from './routers/dealer';
import { siteRouter } from './routers/site';
import { wizardRouter } from './routers/wizard';

export const appRouter = createTRPCRouter({
  dealer: dealerRouter,
  site: siteRouter,
  wizard: wizardRouter,
});

export type AppRouter = typeof appRouter;