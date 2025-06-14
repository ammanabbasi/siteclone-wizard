import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const createSiteSchema = z.object({
  dealerId: z.string(),
  domain: z.string().optional(),
  figmaFrameId: z.string().optional(),
  colorPalette: z.record(z.string()).optional(),
  typography: z.record(z.string()).optional(),
  enabledPages: z.array(z.string()).optional(),
  customPages: z.array(z.record(z.string())).optional(),
  navOrder: z.array(z.string()).optional(),
  integrations: z.record(z.any()).optional(),
});

export const siteRouter = createTRPCRouter({
  create: publicProcedure
    .input(createSiteSchema)
    .mutation(async ({ ctx, input }) => {
      const { 
        colorPalette, 
        typography, 
        enabledPages, 
        customPages, 
        navOrder, 
        integrations,
        ...siteData 
      } = input;
      
      return ctx.db.site.create({
        data: {
          ...siteData,
          colorPalette: colorPalette ? JSON.stringify(colorPalette) : null,
          typography: typography ? JSON.stringify(typography) : null,
          enabledPages: enabledPages ? JSON.stringify(enabledPages) : null,
          customPages: customPages ? JSON.stringify(customPages) : null,
          navOrder: navOrder ? JSON.stringify(navOrder) : null,
          integrations: integrations ? JSON.stringify(integrations) : null,
        },
        include: {
          dealer: true,
        },
      });
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.site.findMany({
      include: {
        dealer: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const site = await ctx.db.site.findUnique({
        where: { id: input.id },
        include: {
          dealer: true,
        },
      });

      if (!site) {
        throw new Error('Site not found');
      }

      return {
        ...site,
        colorPalette: site.colorPalette ? JSON.parse(site.colorPalette) : null,
        typography: site.typography ? JSON.parse(site.typography) : null,
        enabledPages: site.enabledPages ? JSON.parse(site.enabledPages) : [],
        customPages: site.customPages ? JSON.parse(site.customPages) : [],
        navOrder: site.navOrder ? JSON.parse(site.navOrder) : [],
        integrations: site.integrations ? JSON.parse(site.integrations) : {},
        playwrightResults: site.playwrightResults ? JSON.parse(site.playwrightResults) : null,
      };
    }),

  update: publicProcedure
    .input(z.object({
      id: z.string(),
      data: createSiteSchema.partial().extend({
        status: z.enum([
          'DRAFT',
          'BUILDING',
          'QA_PENDING',
          'QA_FAILED',
          'READY_TO_DEPLOY',
          'DEPLOYING',
          'DEPLOYED',
          'DEPLOYMENT_FAILED'
        ]).optional(),
        lighthouseScore: z.number().optional(),
        playwrightResults: z.record(z.any()).optional(),
        deploymentUrl: z.string().optional(),
      }),
    }))
    .mutation(async ({ ctx, input }) => {
      const { 
        colorPalette, 
        typography, 
        enabledPages, 
        customPages, 
        navOrder, 
        integrations,
        playwrightResults,
        ...siteData 
      } = input.data;
      
      return ctx.db.site.update({
        where: { id: input.id },
        data: {
          ...siteData,
          colorPalette: colorPalette ? JSON.stringify(colorPalette) : undefined,
          typography: typography ? JSON.stringify(typography) : undefined,
          enabledPages: enabledPages ? JSON.stringify(enabledPages) : undefined,
          customPages: customPages ? JSON.stringify(customPages) : undefined,
          navOrder: navOrder ? JSON.stringify(navOrder) : undefined,
          integrations: integrations ? JSON.stringify(integrations) : undefined,
          playwrightResults: playwrightResults ? JSON.stringify(playwrightResults) : undefined,
          lastDeployedAt: siteData.deploymentUrl ? new Date() : undefined,
        },
        include: {
          dealer: true,
        },
      });
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.site.delete({
        where: { id: input.id },
      });
    }),

  getByDealerId: publicProcedure
    .input(z.object({ dealerId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.site.findMany({
        where: { dealerId: input.dealerId },
        include: {
          dealer: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    }),
});