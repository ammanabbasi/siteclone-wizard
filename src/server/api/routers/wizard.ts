import { z } from 'zod';
import { createTRPCRouter, publicProcedure } from '@/server/api/trpc';

const wizardFormSchema = z.object({
  // Step 1: Dealer Info
  dealerName: z.string().optional(),
  dealerSlug: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  website: z.string().url().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  businessType: z.enum(['new', 'used', 'both']).optional(),
  brands: z.array(z.string()).optional(),
  hasFinancing: z.boolean().optional(),
  financingPartner: z.string().optional(),
  thirdPartyTools: z.array(z.string()).optional(),

  // Step 2: Design & Theme
  figmaFrameId: z.string().optional(),
  colorPalette: z.record(z.string()).optional(),
  typography: z.record(z.string()).optional(),

  // Step 3: Pages & Modules
  enabledPages: z.array(z.string()).optional(),
  customPages: z.array(z.record(z.string())).optional(),
  navOrder: z.array(z.string()).optional(),

  // Step 4: Integrations
  integrations: z.record(z.any()).optional(),

  // Step 5: Preview & QA (results stored separately)
  // Step 6: Deploy (deployment info stored separately)
});

export const wizardRouter = createTRPCRouter({
  createSession: publicProcedure
    .mutation(async ({ ctx }) => {
      return ctx.db.wizardSession.create({
        data: {
          currentStep: 1,
        },
      });
    }),

  getSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const session = await ctx.db.wizardSession.findUnique({
        where: { id: input.id },
      });

      if (!session) {
        throw new Error('Wizard session not found');
      }

      return {
        ...session,
        formData: session.formData ? JSON.parse(session.formData) : {},
      };
    }),

  updateSession: publicProcedure
    .input(z.object({
      id: z.string(),
      currentStep: z.number().optional(),
      formData: wizardFormSchema.optional(),
      dealerId: z.string().optional(),
      siteId: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { formData, ...sessionData } = input;
      
      return ctx.db.wizardSession.update({
        where: { id: input.id },
        data: {
          ...sessionData,
          formData: formData ? JSON.stringify(formData) : undefined,
        },
      });
    }),

  deleteSession: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.wizardSession.delete({
        where: { id: input.id },
      });
    }),

  // Complete wizard and create dealer + site
  completeWizard: publicProcedure
    .input(z.object({
      sessionId: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const session = await ctx.db.wizardSession.findUnique({
        where: { id: input.sessionId },
      });

      if (!session || !session.formData) {
        throw new Error('Invalid wizard session');
      }

      const formData = JSON.parse(session.formData);
      
      // Create dealer
      const dealer = await ctx.db.dealer.create({
        data: {
          name: formData.dealerName || 'Unnamed Dealer',
          slug: formData.dealerSlug || `dealer-${Date.now()}`,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          businessType: formData.businessType,
          brands: formData.brands ? JSON.stringify(formData.brands) : null,
          hasFinancing: formData.hasFinancing || false,
          financingPartner: formData.financingPartner,
          thirdPartyTools: formData.thirdPartyTools ? JSON.stringify(formData.thirdPartyTools) : null,
        },
      });

      // Create site
      const site = await ctx.db.site.create({
        data: {
          dealerId: dealer.id,
          figmaFrameId: formData.figmaFrameId,
          colorPalette: formData.colorPalette ? JSON.stringify(formData.colorPalette) : null,
          typography: formData.typography ? JSON.stringify(formData.typography) : null,
          enabledPages: formData.enabledPages ? JSON.stringify(formData.enabledPages) : null,
          customPages: formData.customPages ? JSON.stringify(formData.customPages) : null,
          navOrder: formData.navOrder ? JSON.stringify(formData.navOrder) : null,
          integrations: formData.integrations ? JSON.stringify(formData.integrations) : null,
        },
        include: {
          dealer: true,
        },
      });

      // Update session with created entities
      await ctx.db.wizardSession.update({
        where: { id: input.sessionId },
        data: {
          dealerId: dealer.id,
          siteId: site.id,
        },
      });

      return { dealer, site };
    }),
});