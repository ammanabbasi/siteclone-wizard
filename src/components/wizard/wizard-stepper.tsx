'use client';

import { useWizard } from './wizard-context-simple';
import { cn } from '../../lib/utils';
import { Check, Building, FileText, Palette, Eye, Rocket, Plug } from 'lucide-react';

const steps = [
  {
    id: 1,
    name: 'Basic Info',
    description: 'Dealer details & tools',
    icon: Building,
  },
  {
    id: 2,
    name: 'Navigation',
    description: 'Define pages & structure',
    icon: FileText,
  },
  {
    id: 3,
    name: 'Design',
    description: 'Theme & customization',
    icon: Palette,
  },
  {
    id: 4,
    name: 'QA & Testing',
    description: 'Preview & quality checks',
    icon: Eye,
  },
  {
    id: 5,
    name: 'Deployment',
    description: 'UAT & production launch',
    icon: Rocket,
  },
  {
    id: 6,
    name: 'Integrations',
    description: 'Marketing & analytics',
    icon: Plug,
  },
];

export function WizardStepper() {
  const { currentStep } = useWizard();

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center justify-center space-x-4 lg:space-x-8">
        {steps.map((step, stepIdx) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <li key={step.id} className="flex items-center">
              {stepIdx !== 0 && (
                <div
                  className={cn(
                    'mx-2 h-0.5 w-8 lg:w-12',
                    isCompleted || (isCurrent && stepIdx < currentStep)
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  )}
                />
              )}
              
              <div className="relative flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors',
                    isCompleted
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : isCurrent
                      ? 'border-blue-600 bg-white text-blue-600'
                      : 'border-gray-300 bg-white text-gray-400'
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <step.icon className="h-6 w-6" />
                  )}
                </div>
                
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent ? 'text-blue-600' : 
                      isCompleted ? 'text-gray-900' : 'text-gray-500'
                    )}
                  >
                    {step.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {step.description}
                  </p>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}