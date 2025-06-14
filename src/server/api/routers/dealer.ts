import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const createDealerSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  country: z.string().default('US'),
  businessType: z.enum(['new', 'used', 'both']).optional(),
  brands: z.array(z.string()).optional(),
  hasFinancing: z.boolean().default(false),
  financingPartner: z.string().optional(),
  thirdPartyTools: z.array(z.string()).optional(),
});

export const dealerRouter = createTRPCRouter({
  create: publicProcedure
    .input(createDealerSchema)
    .mutation(async ({ ctx, input }) => {
      const { brands, thirdPartyTools, ...dealerData } = input;
      
      return ctx.db.dealer.create({
        data: {
          ...dealerData,
          brands: brands ? JSON.stringify(brands) : null,
          thirdPartyTools: thirdPartyTools ? JSON.stringify(thirdPartyTools) : null,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.dealer.findMany({
      include: {
        sites: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const dealer = await ctx.db.dealer.findUnique({
        where: { slug: input.slug },
        include: {
          sites: true,
        },
      });

      if (!dealer) {
        throw new Error('Dealer not found');
      }

      return {
        ...dealer,
        brands: dealer.brands ? JSON.parse(dealer.brands) : [],
        thirdPartyTools: dealer.thirdPartyTools ? JSON.parse(dealer.thirdPartyTools) : [],
      };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: createDealerSchema.partial(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { brands, thirdPartyTools, ...dealerData } = input.data;
      
      return ctx.db.dealer.update({
        where: { id: input.id },
        data: {
          ...dealerData,
          brands: brands ? JSON.stringify(brands) : undefined,
          thirdPartyTools: thirdPartyTools ? JSON.stringify(thirdPartyTools) : undefined,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.dealer.delete({
        where: { id: input.id },
      });
    }),
});