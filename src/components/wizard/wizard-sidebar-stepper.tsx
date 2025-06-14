'use client';

import { useWizard } from './wizard-context-simple';
import { cn } from '@/lib/utils';
import { Check, Building, FileText, Palette, Eye, Rocket, Plug, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const steps = [
  {
    id: 1,
    name: 'Dealer Info',
    description: 'Basic details & tools',
    icon: Building,
    status: 'current', // current, completed, upcoming
  },
  {
    id: 2,
    name: 'Pages & Navigation',
    description: 'Define site structure',
    icon: FileText,
    status: 'upcoming',
  },
  {
    id: 3,
    name: 'Design & Theme',
    description: 'Colors & branding',
    icon: Palette,
    status: 'upcoming',
  },
  {
    id: 4,
    name: 'QA & Testing',
    description: 'Preview & validate',
    icon: Eye,
    status: 'upcoming',
  },
  {
    id: 5,
    name: 'Deployment',
    description: 'Launch your site',
    icon: Rocket,
    status: 'upcoming',
  },
  {
    id: 6,
    name: 'Integrations',
    description: 'Analytics & marketing',
    icon: Plug,
    status: 'upcoming',
  },
];

export function WizardSidebarStepper() {
  const { currentStep, setCurrentStep, form } = useWizard();
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [stepValidation, setStepValidation] = useState<Record<number, boolean>>({});

  // Validate current step data
  useEffect(() => {
    const validateStep = (step: number) => {
      switch (step) {
        case 1:
          const dealerName = form.watch('dealerName');
          const dealerSlug = form.watch('dealerSlug');
          const dealerSize = form.watch('dealerSize');
          return !!dealerName && !!dealerSlug && !!dealerSize;
        case 2:
          const enabledPages = form.watch('enabledPages');
          return enabledPages?.length > 0;
        case 3:
          const colorPalette = form.watch('colorPalette');
          return Object.keys(colorPalette || {}).length > 0;
        default:
          return true;
      }
    };

    const newValidation = { ...stepValidation };
    for (let i = 1; i <= currentStep; i++) {
      newValidation[i] = validateStep(i);
    }
    setStepValidation(newValidation);
  }, [currentStep, form]);

  const handleStepClick = (stepId: number) => {
    // Allow navigation to any step that's been visited or is the next step
    if (stepId <= Math.max(...completedSteps, currentStep) + 1) {
      setCurrentStep(stepId);
    }
  };

  // Mark steps as completed when moving forward
  useEffect(() => {
    if (currentStep > 1 && !completedSteps.includes(currentStep - 1)) {
      setCompletedSteps([...completedSteps, currentStep - 1]);
    }
  }, [currentStep]);

  return (
    <nav className="flex-1 space-y-1 px-2 py-4">
      {steps.map((step) => {
        const isCompleted = completedSteps.includes(step.id);
        const isCurrent = currentStep === step.id;
        const isValid = stepValidation[step.id];
        const canNavigate = step.id <= Math.max(...completedSteps, currentStep) + 1;

        return (
          <button
            key={step.id}
            onClick={() => handleStepClick(step.id)}
            disabled={!canNavigate}
            className={cn(
              'group flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left transition-all',
              isCurrent
                ? 'bg-blue-50 shadow-sm'
                : canNavigate
                ? 'hover:bg-gray-50'
                : 'cursor-not-allowed opacity-50',
              isCompleted && isValid && 'hover:bg-green-50'
            )}
          >
            {/* Step Number/Icon */}
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                isCompleted && isValid
                  ? 'border-green-600 bg-green-600 text-white'
                  : isCurrent
                  ? 'border-blue-600 bg-white text-blue-600'
                  : 'border-gray-300 bg-white text-gray-400'
              )}
            >
              {isCompleted && isValid ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>

            {/* Step Info */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-blue-900' : 
                  isCompleted && isValid ? 'text-green-900' :
                  isCompleted && !isValid ? 'text-amber-700' :
                  'text-gray-600'
                )}
              >
                {step.name}
                {isCompleted && !isValid && (
                  <span className="ml-2 text-xs text-amber-600">• Incomplete</span>
                )}
              </p>
              <p
                className={cn(
                  'text-xs',
                  isCurrent ? 'text-blue-600' : 'text-gray-500'
                )}
              >
                {step.description}
              </p>
            </div>

            {/* Arrow for current step */}
            {isCurrent && (
              <ChevronRight className="h-5 w-5 text-blue-600 opacity-50" />
            )}
          </button>
        );
      })}

      {/* Progress Summary */}
      <div className="mt-6 border-t pt-4 px-4">
        <div className="text-xs text-gray-600">
          <p className="font-medium">Progress</p>
          <div className="mt-2 h-2 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
              style={{ width: `${(completedSteps.length / 6) * 100}%` }}
            />
          </div>
          <p className="mt-1">{completedSteps.length} of 6 steps completed</p>
        </div>
      </div>
    </nav>
  );
}