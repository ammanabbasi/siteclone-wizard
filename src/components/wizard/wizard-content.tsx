'use client';

import { useWizard } from './wizard-context-simple';
import { DealerInfoStep } from './steps/dealer-info-step-simple';
import { PagesModulesStep } from './steps/pages-modules-step';
import { DesignThemeStep } from './steps/design-theme-step';
import { PreviewQAStep } from './steps/preview-qa-step';
import { DeployStep } from './steps/deploy-step';
import { IntegrationsStep } from './steps/integrations-step';

export function WizardContent() {
  const { currentStep } = useWizard();

  switch (currentStep) {
    case 1:
      return <DealerInfoStep />;
    case 2:
      return <PagesModulesStep />;
    case 3:
      return <DesignThemeStep />;
    case 4:
      return <PreviewQAStep />;
    case 5:
      return <DeployStep />;
    case 6:
      return <IntegrationsStep />;
    default:
      return <DealerInfoStep />;
  }
}