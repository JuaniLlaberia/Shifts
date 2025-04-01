'use client';

import { ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';

import InputWrapper from '@/components/ui/input-wrapper';
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
import { Input } from '@/components/ui/input';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { createDepartmentWithRole as createDepartmentWithRoleAction } from '@/actions/department/create-department-with-role';
import { createDepartmentWithRoleValidator } from '@/zod-validators/department';

type DepartmentStepProps = {
  businessId: string;
  children: ReactNode;
  handleChangeStep?: (step: number, skip?: boolean) => void;
};

const DepartmentStep = ({
  businessId,
  children,
  handleChangeStep,
}: DepartmentStepProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: createDepartmentWithRole, isPending } =
    useServerActionMutation(createDepartmentWithRoleAction, {
      onSuccess: () => {
        handleChangeStep?.(3);
        setIsOpen(false);
        toast.success('Department and role created successfully', {
          description: 'You can edit and create more in your business page.',
        });
      },
    });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { businessId },
    resolver: zodResolver(createDepartmentWithRoleValidator),
  });

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create your first Department</AlertDialogTitle>
          <AlertDialogDescription>
            Departments and Roles help you organize your employees in teams and
            groups.{' '}
            <span className='font-medium'>They are fully customizable.</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <form
          onSubmit={handleSubmit(data => {
            createDepartmentWithRole({ ...data, businessId });
          })}
        >
          <div className='py-4 pb-8 space-y-4'>
            <InputWrapper
              inputId='departmentName'
              label='Department name'
              error={errors.departmentName?.message}
            >
              <Input
                id='departmentName'
                {...register('departmentName')}
                type='text'
                placeholder='e.g. Kitchen, Security, Bar'
                disabled={isPending}
              />
            </InputWrapper>
            <InputWrapper
              inputId='roleName'
              label='Role name'
              error={errors.roleName?.message}
            >
              <Input
                id='roleName'
                {...register('roleName')}
                type='text'
                placeholder='e.g. Chef, Bartender, Manager'
                disabled={isPending}
              />
            </InputWrapper>
          </div>

          <AlertDialogFooter>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                handleChangeStep?.(3, true);
                setIsOpen(false);
              }}
              disabled={isPending}
            >
              Skip
            </Button>
            <Button size='sm' disabled={isPending}>
              Complete
              {isPending && <Loader2 className='size-4 ml-2 animate-spin' />}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DepartmentStep;
