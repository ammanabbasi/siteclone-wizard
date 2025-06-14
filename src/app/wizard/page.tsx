'use client';

import { WizardSidebarStepper } from '@/components/wizard/wizard-sidebar-stepper';
import { WizardContent } from '@/components/wizard/wizard-content';
import { WizardNavigation } from '@/components/wizard/wizard-navigation';
import { useWizard } from '@/components/wizard/wizard-context-simple';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Save, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function WizardPage() {
  const { isLoading, form, currentStep } = useWizard();
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSaveEnabled) return;

    const saveToLocalStorage = () => {
      const formData = form.getValues();
      localStorage.setItem('dealerscloud-wizard-data', JSON.stringify(formData));
      localStorage.setItem('dealerscloud-wizard-step', currentStep.toString());
      setLastSaved(new Date());
      console.log('Auto-saved wizard data');
    };

    // Save every 30 seconds
    const interval = setInterval(saveToLocalStorage, 30000);
    
    // Also save when step changes
    saveToLocalStorage();

    return () => {
      clearInterval(interval);
    };
  }, [autoSaveEnabled, currentStep, form]);

  // Load saved data on mount
  useEffect(() => {
    const savedData = localStorage.getItem('dealerscloud-wizard-data');
    const savedStep = localStorage.getItem('dealerscloud-wizard-step');
    
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        Object.entries(parsedData).forEach(([key, value]) => {
          form.setValue(key as any, value);
        });
        
        if (savedStep) {
          // We'll need to add a method to set the current step from saved state
          // For now, users start from step 1 but can navigate to any completed step
        }
        
        toast.success('Previous session restored');
      } catch (error) {
        console.error('Failed to restore saved data:', error);
      }
    }
  }, []);

  const handleManualSave = () => {
    const formData = form.getValues();
    localStorage.setItem('dealerscloud-wizard-data', JSON.stringify(formData));
    localStorage.setItem('dealerscloud-wizard-step', currentStep.toString());
    setLastSaved(new Date());
    toast.success('Progress saved successfully');
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      localStorage.removeItem('dealerscloud-wizard-data');
      localStorage.removeItem('dealerscloud-wizard-step');
      window.location.reload();
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-2 text-sm text-gray-600">Loading wizard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar */}
      <div className="w-80 bg-white shadow-lg flex flex-col">
        {/* Sidebar Header */}
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">
            DealersCloud Site Builder
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Build your dealership website
          </p>
        </div>

        {/* Stepper */}
        <div className="flex-1 overflow-y-auto">
          <WizardSidebarStepper />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t space-y-2">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={autoSaveEnabled}
                onChange={(e) => setAutoSaveEnabled(e.target.checked)}
                className="rounded"
              />
              Auto-save
            </label>
            {lastSaved && (
              <span className="text-xs text-gray-500">
                Saved {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualSave}
              className="flex-1"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex-1"
            >
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full p-8">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-medium text-gray-700">
                Step {currentStep} of 6
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round((currentStep / 6) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              />
            </div>
          </div>

          {/* Main Card */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-8">
              {/* Dynamic Content */}
              <div className="mb-8">
                <WizardContent />
              </div>

              {/* Navigation */}
              <div className="border-t pt-6">
                <WizardNavigation />
              </div>
            </CardContent>
          </Card>

          {/* Status Messages */}
          <div className="max-w-4xl mx-auto mt-4">
            {currentStep === 1 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  <strong>Tip:</strong> Fill in all required fields marked with * to proceed to the next step.
                </p>
              </div>
            )}
            
            {currentStep === 6 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  <strong>Almost done!</strong> Review your settings and click &quot;Complete Setup&quot; to generate your website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}