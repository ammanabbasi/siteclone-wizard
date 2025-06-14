'use client';

import React, { createContext, useContext, useState } from 'react';

// Form data type for all wizard steps
export interface WizardFormData {
  // Step 1: Dealer Info
  dealerName: string;
  dealerSlug: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  businessType?: 'new' | 'used' | 'both';
  dealerSize?: 'small' | 'large';
  numberOfLocations?: number;
  brands: string[];
  hasFinancing: boolean;
  financingPartner?: string;
  thirdPartyTools: string[];

  // Step 2: Design & Theme
  figmaFrameId?: string;
  colorPalette: Record<string, string>;
  typography: Record<string, string>;

  // Step 3: Pages & Modules
  enabledPages: string[];
  customPages: Array<Record<string, string>>;
  navOrder: string[];

  // Step 4: Integrations
  integrations: Record<string, any>;
}

interface WizardContextType {
  formData: WizardFormData;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  sessionId: string | null;
  isLoading: boolean;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<WizardFormData>) => void;
  totalSteps: number;
  
  // Form object for compatibility with existing components
  form: {
    watch: (key: string) => any;
    setValue: (key: string, value: any) => void;
    getValues: (key?: string) => any;
    register: (key: string) => { name: string; onChange: (e: any) => void };
    trigger: () => boolean;
    formState: { errors: Record<string, any> };
  };
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
  const [sessionId] = useState('demo-session-' + Date.now());
  const [isLoading] = useState(false);
  
  const [formData, setFormData] = useState<WizardFormData>({
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
    dealerSize: undefined,
    numberOfLocations: 1,
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
      'financing',
      'services',
      'about-us',
      'contact-us',
      'testimonials',
      'sell-your-car',
      'blogs',
      'jobs',
      'shipping',
    ],
    customPages: [],
    navOrder: [
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
    ],
    integrations: {},
  });

  const nextStep = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (newData: Partial<WizardFormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  // Mock form methods for compatibility with existing components
  const watch = (key: string) => {
    const keys = key.split('.');
    let value: any = formData;
    for (const k of keys) {
      value = value?.[k];
    }
    return value;
  };

  const setValue = (key: string, value: any) => {
    const keys = key.split('.');
    if (keys.length === 1) {
      updateFormData({ [key]: value } as Partial<WizardFormData>);
    } else {
      // Handle nested keys if needed
      const currentValue = formData[keys[0] as keyof WizardFormData];
      const newValue = typeof currentValue === 'object' && currentValue !== null 
        ? { ...currentValue, [keys[1]]: value }
        : { [keys[1]]: value };
      updateFormData({ [keys[0]]: newValue } as Partial<WizardFormData>);
    }
  };

  const getValues = (key?: string) => {
    if (!key) return formData;
    return watch(key);
  };

  const register = (key: string) => ({
    name: key,
    onChange: (e: any) => {
      const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValue(key, value);
    },
  });

  const trigger = () => true; // Always return true for now

  return (
    <WizardContext.Provider
      value={{
        formData,
        currentStep,
        setCurrentStep,
        sessionId,
        isLoading,
        nextStep,
        prevStep,
        updateFormData,
        totalSteps: 6,
        form: {
          watch,
          setValue,
          getValues,
          register,
          trigger,
          formState: { errors: {} },
        },
      }}
    >
      {children}
    </WizardContext.Provider>
  );
} 