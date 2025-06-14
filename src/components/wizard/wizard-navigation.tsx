'use client';

import { useWizard } from './wizard-context-simple';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export function WizardNavigation() {
  const { currentStep, totalSteps, nextStep, prevStep, form } = useWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  const handleNext = () => {
    // Validate current step before proceeding
    let isValid = true;
    let errorMessage = '';

    switch (currentStep) {
      case 1:
        const dealerName = form.watch('dealerName');
        const dealerSlug = form.watch('dealerSlug');
        const dealerSize = form.watch('dealerSize');
        
        if (!dealerName || !dealerSlug || !dealerSize) {
          isValid = false;
          errorMessage = 'Please fill in all required fields (Dealer Name, URL Slug, and Dealer Size)';
        }
        break;
        
      case 2:
        const enabledPages = form.watch('enabledPages');
        if (!enabledPages || enabledPages.length === 0) {
          isValid = false;
          errorMessage = 'Please select at least one page for your website';
        }
        break;
        
      case 3:
        const colorPalette = form.watch('colorPalette');
        if (!colorPalette || Object.keys(colorPalette).length === 0) {
          isValid = false;
          errorMessage = 'Please select a color theme for your website';
        }
        break;
    }

    if (isValid) {
      nextStep();
    } else {
      toast.error(errorMessage || 'Please complete all required fields before proceeding');
    }
  };

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <div className="flex items-center">
        {!isFirstStep && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </span>
        
        {!isLastStep && (
          <Button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
        
        {isLastStep && (
          <Button
            type="button"
            onClick={() => {
              // Handle final submission
              const formData = form.getValues();
              logger.info('Final submission:', formData);
              
              // Save to localStorage as completed
              localStorage.setItem('dealerscloud-wizard-completed', 'true');
              localStorage.setItem('dealerscloud-wizard-data', JSON.stringify(formData));
              
              toast.success('Website configuration complete! 🎉', {
                description: 'Your dealership website is ready to be generated.',
                duration: 5000,
              });
              
              // In a real implementation, this would trigger the site generation process
              // For now, we'll just show a success message
              setTimeout(() => {
                toast.info('Site generation would start here...', {
                  description: 'This would trigger the AI-powered site builder.',
                });
              }, 2000);
            }}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          >
            Complete Setup
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}