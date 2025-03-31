'use client';

import { Loader2, MoveRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Industry } from '@prisma/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import InputWrapper from '@/components/ui/input-wrapper';
import { createBusinessValidator } from '@/zod-validators/business';
import { INDUSTRY_LABELS } from '@/lib/dictionaries';
import { createBusiness as createBusinessAction } from '@/actions/business/create-business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useMultiStepForm } from '@/hooks/use-multi-step-form';
import { useServerActionMutation } from '@/hooks/use-server-actions';

const NewBusinessForm = () => {
  const router = useRouter();

  const { mutate: createBusiness, isPending } = useServerActionMutation(
    createBusinessAction,
    {
      mutationKey: ['create-business'],
      onSuccess: businessId => {
        router.replace(`/business/${businessId}/configure`);
        toast.success('Business created successfully');
      },
      onError: err =>
        toast.error('Failed to create business', { description: err.message }),
    }
  );
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm({ resolver: zodResolver(createBusinessValidator) });

  const steps: ('name' | 'industry')[] = ['name', 'industry'];
  const stepsCompoents = [
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-50%', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      key='step-1'
      className='space-y-8'
    >
      <header className='text-2xl md:text-3xl font-semibold leading-tight'>
        <h1 className='text-landing-main-text-primary'>
          Create{' '}
          <span className='relative z-30'>
            your Business.
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
          </span>
        </h1>
        <h2 className='text-landing-main-text-secondary/75'>
          What will be the name?
        </h2>
      </header>
      <InputWrapper inputId='name' error={errors.name?.message}>
        <Input
          id='name'
          className='h-11 bg-landing-main-card'
          placeholder='Your business name (e.g: Star Coffe)'
          {...register('name')}
        />
      </InputWrapper>
    </motion.div>,
    <motion.div
      initial={{ x: '50%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: '-50%', opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      key='step-2'
      className='space-y-8'
    >
      <header className='text-2xl md:text-3xl font-semibold leading-tight'>
        <h1 className='text-landing-main-text-primary'>
          Create{' '}
          <span className='relative z-30'>
            your Business.
            <span className='absolute bg-amber-300/75 h-3 w-full left-0 bottom-0 -z-10' />
          </span>
        </h1>
        <h2 className='text-landing-main-text-secondary/75'>
          Select your industry.
        </h2>
      </header>
      <InputWrapper inputId='name' error={errors.name?.message}>
        <ul className='flex flex-wrap gap-4 justify-center w-full'>
          {Object.entries(Industry).map(([key, value]) => (
            <li key={key}>
              <Input
                id={key}
                type='radio'
                value={value}
                className='hidden peer'
                {...register('industry')}
              />
              <label
                htmlFor={key}
                className='flex py-2 px-6 rounded-lg border-2 border-landing-main-border/25 bg-landing-main-card/50 hover:bg-landing-main-card hover:border-landing-main-border/50 text-landing-main-text-secondary peer-checked:border-landing-main-border peer-checked:text-landing-main-text-primary peer-checked:bg-landing-main-card transition-all duration-200 ease-in-out shadow-sm hover:shadow cursor-pointer'
              >
                <h3 className='capitalize'>{INDUSTRY_LABELS[key]}</h3>
              </label>
            </li>
          ))}
        </ul>
      </InputWrapper>
    </motion.div>,
  ];

  const {
    currentStep,
    currentIndex,
    nextStep,
    prevStep,
    isFirstStep,
    isLastStep,
  } = useMultiStepForm(stepsCompoents);

  return (
    <form
      onSubmit={
        isLastStep
          ? handleSubmit(data => {
              createBusiness({ ...data });
            })
          : async e => {
              e.preventDefault();

              const fields = steps[currentIndex];
              const isValid = await trigger(fields);

              if (!isValid) return;

              nextStep();
            }
      }
      className='py-8 space-y-8 md:px-0'
    >
      {currentStep}
      <div className='space-y-2'>
        <Button
          type='submit'
          className='w-full group'
          size='lg'
          disabled={isPending}
        >
          {isLastStep ? 'Get started' : 'Next'}
          {isLastStep && !isPending ? (
            <MoveRight className='size-5 ml-2 group-hover:translate-x-1 transition-transform' />
          ) : isPending ? (
            <Loader2 className='size-5 ml-2 animate-spin' />
          ) : null}
        </Button>
        {!isFirstStep && (
          <Button
            onClick={prevStep}
            className='w-full text-landing-main-text-secondary hover:text-landing-main-text-primary hover:bg-black/2.5'
            size='lg'
            variant='ghost'
          >
            Go back
          </Button>
        )}
      </div>
    </form>
  );
};

export default NewBusinessForm;
