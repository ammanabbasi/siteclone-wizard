import { WizardProvider } from '../../components/wizard/wizard-context-simple';
import { Toaster } from 'sonner';

export default function WizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WizardProvider>
      {children}
      <Toaster position="top-right" richColors />
    </WizardProvider>
  );
}