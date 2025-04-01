'use client';

import { Check } from 'lucide-react';
import { type ComponentType, type ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import LocatitonStep from './location-step';
import LogoStep from './logo-step';
import DepartmentStep from './department-step';
import InviteEmployeeStep from './invite-employee-step';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { updateOnboardingStep as updateOnboardingStepAction } from '@/actions/business/update-onboarding-step';

type DialogProps = {
  children: ReactNode;
  handleChangeStep?: (step: number, skip?: boolean) => void;
  businessId: string;
};

type Step = {
  title: string;
  description: string;
  step: number;
  dialog: ComponentType<DialogProps>;
};

const STEPS: Step[] = [
  {
    title: 'Configure store location',
    description: 'This will allow employees clock in/out with geolocation.',
    step: 1,
    dialog: LocatitonStep,
  },
  {
    title: 'Upload your logo',
    description: 'This will be only visible for employees.',
    step: 2,
    dialog: LogoStep,
  },
  {
    title: 'Create your first department',
    description: 'Department and roles help you divide your workforce.',
    step: 3,
    dialog: DepartmentStep,
  },
  {
    title: 'Invite employees',
    description: 'Start inviting your employees to your business.',
    step: 4,
    dialog: InviteEmployeeStep,
  },
];

type ConfigureFormProps = {
  businessData: {
    id: string;
    name: string;
    configured: boolean;
    completedOnboardingSteps: number;
  };
};

const ConfigureForm = ({ businessData }: ConfigureFormProps) => {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(
    businessData.completedOnboardingSteps + 1
  );

  const { mutate: updateOnboardingStep } = useServerActionMutation(
    updateOnboardingStepAction,
    {
      mutationKey: ['update-onboarding-step'],
      onSuccess: () => toast.success('Step was skipped successfully'),
      onError: error => toast.error(error.message),
    }
  );

  const handleChangeStep = (step: number, skip?: boolean) => {
    setCurrentStep(step + 1);

    if (skip) updateOnboardingStep({ businessId: businessData.id });

    // Redirect in case is last step
    if (step === 4) {
      router.replace(`/business/${businessData.id}/overview`);
    }
  };

  return (
    <ul className='relative'>
      {STEPS.map(({ title, description, step, dialog: Dialog }, i) => (
        <li key={i} className='flex items-start gap-5'>
          <div className='flex flex-col items-center'>
            {step < currentStep ? (
              <div className='flex items-center justify-center size-14 rounded-full bg-amber-300 dark:bg-amber-400 text-white'>
                <Check className='size-6' />
              </div>
            ) : (
              <div
                className={cn(
                  'flex items-center justify-center size-14 bg-background border-2 rounded-full',
                  currentStep === step
                    ? 'text-primary'
                    : ' text-muted-foreground'
                )}
              >
                {i + 1}
              </div>
            )}
            {step !== 4 && (
              <div
                className={cn(
                  'h-8 w-[2px]',
                  step < currentStep
                    ? 'bg-amber-300 dark:bg-amber-400'
                    : 'bg-border'
                )}
              />
            )}
          </div>
          <div className='flex-1'>
            <div className='flex items-start justify-between'>
              <div>
                <h3 className='font-medium'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{description}</p>
              </div>
              <Dialog
                businessId={businessData.id}
                handleChangeStep={handleChangeStep}
              >
                {step < currentStep ? (
                  <Button disabled variant='ghost' className='text-amber-400'>
                    Done!
                  </Button>
                ) : currentStep === step ? (
                  <Button
                    size='sm'
                    className='bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300 cursor-pointer'
                  >
                    Jump on it
                  </Button>
                ) : (
                  <Button
                    size='sm'
                    disabled
                    className='bg-amber-300 dark:bg-amber-400 hover:bg-amber-400 dark:hover:bg-amber-300'
                  >
                    Pending
                  </Button>
                )}
              </Dialog>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ConfigureForm;
