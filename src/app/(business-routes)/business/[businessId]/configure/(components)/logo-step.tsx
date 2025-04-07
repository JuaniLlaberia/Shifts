'use client';

import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

import ImageUploader from '@/components/special/image-uploader';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type LogoStepProps = {
  children: ReactNode;
  handleChangeStep?: (step: number, skip?: boolean) => void;
  businessId: string;
};

const LogoStep = ({
  businessId,
  children,
  handleChangeStep,
}: LogoStepProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload your Logo</AlertDialogTitle>
          <AlertDialogDescription>
            This logo will only be visible for your employees.{' '}
            <span className='font-medium'>It is optional to have one.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ImageUploader
          businessId={businessId}
          isOnboarding={true}
          onSucess={() => {
            handleChangeStep?.(2);
            setIsOpen(false);
            toast.success('New logo uploaded successfully');
          }}
        />

        <AlertDialogFooter>
          <Button
            variant='ghost'
            size='sm'
            onClick={() => {
              handleChangeStep?.(2, true);
              setIsOpen(false);
            }}
          >
            Skip
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LogoStep;
