import { FormEvent, ReactNode, useState } from 'react';

export const useMultiStepForm = (steps: ReactNode[]) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextStep = () => {
    setCurrentIndex(i => {
      if (i >= steps.length - 1) return i;
      return i + 1;
    });
  };

  const prevStep = (e: FormEvent) => {
    e.preventDefault();
    setCurrentIndex(i => {
      if (i === 0) return i;
      return i - 1;
    });
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentIndex(index);
    }
  };

  return {
    currentIndex,
    currentStep: steps[currentIndex],
    nextStep,
    prevStep,
    goToStep,
    isFirstStep: currentIndex === 0,
    isLastStep: currentIndex === steps.length - 1,
  };
};
