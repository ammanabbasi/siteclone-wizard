'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '../../lib/trpc';
import { logger } from '../../lib/logger';
import type { UseFormReturn } from 'react-hook-form';

// Form schema for all wizard steps
const wizardFormSchema = z.object({
  // Step 1: Dealer Info
  dealerName: z.string().min(1, 'Dealer name is required'),
  dealerSlug: z.string().min(1, 'Dealer slug is required'),
  email: z.string().email('Valid email is required').optional().or(z.literal('')),
  phone: z.string().optional(),
  website: z.string().url('Valid URL is required').optional().or(z.literal('')),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  businessType: z.enum(['new', 'used', 'both']).optional(),
  brands: z.array(z.string()).default([]),
  hasFinancing: z.boolean().default(false),
  financingPartner: z.string().optional(),
  thirdPartyTools: z.array(z.string()).default([]),

  // Step 2: Design & Theme
  figmaFrameId: z.string().optional(),
  colorPalette: z.record(z.string()).default({}),
  typography: z.record(z.string()).default({}),

  // Step 3: Pages & Modules (from simplified workflow)
  enabledPages: z.array(z.string()).default([
    'home',
    'inventory',
    'financing',
    'services',
    'about-us',
    'contact-us',
    'testimonials',
    'sell-your-car',
    'blogs',
    'jobs',
    'shipping',
  ]),
  customPages: z.array(z.record(z.string())).default([]),
  navOrder: z.array(z.string()).default([
    'home',
    'inventory',
    'financing',
    'services',
    'about-us',
    'contact-us',
    'testimonials',
    'sell-your-car',
    'blogs',
    'jobs',
    'shipping',
  ]),

  // Step 4: Integrations
  integrations: z.record(z.any()).default({}),
});

export type WizardFormData = z.infer<typeof wizardFormSchema>;

interface WizardContextType {
  form: UseFormReturn<WizardFormData>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  sessionId: string | null;
  isLoading: boolean;
  nextStep: () => void;
  prevStep: () => void;
  saveProgress: () => void;
  totalSteps: number;
}

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function useWizard() {
  const context = useContext(WizardContext);
  if (!context) {
    throw new Error('useWizard must be used within a WizardProvider');
  }
  return context;
}

interface WizardProviderProps {
  children: React.ReactNode;
  initialStep?: number;
}

export function WizardProvider({ children, initialStep = 1 }: WizardProviderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<WizardFormData>({
    resolver: zodResolver(wizardFormSchema),
    defaultValues: {
      dealerName: '',
      dealerSlug: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      businessType: undefined,
      brands: [],
      hasFinancing: false,
      financingPartner: '',
      thirdPartyTools: [],
      figmaFrameId: '',
      colorPalette: {},
      typography: {},
      enabledPages: [
        'home',
        'inventory',
        'about',
        'contact',
        'financing',
        'service',
      ],
      customPages: [],
      navOrder: [
        'home',
        'inventory',
        'about',
        'service',
        'financing',
        'contact',
      ],
      integrations: {},
    },
  });

  // tRPC mutations
  const createSession = api.wizard.createSession.useMutation();
  const updateSession = api.wizard.updateSession.useMutation();
  const getSession = api.wizard.getSession.useQuery(
    { id: sessionId! },
    { enabled: !!sessionId }
  );

  // Initialize or load session
  useEffect(() => {
    const initializeSession = async () => {
      setIsLoading(true);
      try {
        // Check if we have a session ID in localStorage
        const existingSessionId = localStorage.getItem('wizardSessionId');
        
        if (existingSessionId) {
          setSessionId(existingSessionId);
        } else {
          // Create new session
          const session = await createSession.mutateAsync();
          setSessionId(session.id);
          localStorage.setItem('wizardSessionId', session.id);
        }
      } catch (error) {
        logger.error('Failed to initialize wizard session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Load session data when session is available
  useEffect(() => {
    if (getSession.data) {
      const { formData, currentStep: savedStep } = getSession.data;
      if (formData && Object.keys(formData).length > 0) {
        form.reset(formData);
      }
      if (savedStep) {
        setCurrentStep(savedStep);
      }
    }
  }, [getSession.data, form]);

  const saveProgress = async () => {
    if (!sessionId) return;

    try {
      const formData = form.getValues();
      await updateSession.mutateAsync({
        id: sessionId,
        currentStep,
        formData,
      });
    } catch (error) {
      logger.error('Failed to save wizard progress:', error);
    }
  };

  // Auto-save on form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (sessionId) {
        saveProgress();
      }
    });
    
    return () => subscription.unsubscribe();
  }, [sessionId, currentStep]);

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
      saveProgress();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <WizardContext.Provider
      value={{
        form,
        currentStep,
        setCurrentStep,
        sessionId,
        isLoading,
        nextStep,
        prevStep,
        saveProgress,
        totalSteps: 6,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}