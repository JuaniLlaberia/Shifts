'use client';

import { Department } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import InputWrapper from '@/components/ui/input-wrapper';
import { createDepartment as createDepartmentAction } from '@/actions/department/create-department';
import { updateDepartment as updateDepartmentAction } from '@/actions/department/update-department';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import {
  createDepartmentValidator,
  updateDepartmentValidator,
} from '@/zod-validators/department';
import { Label } from '@/components/ui/label';

type DepartmentFormProps = {
  businessId: string;
  departmentData?: Department;
  children?: ReactNode;
  onSuccess?: () => void;
  onClose?: () => void;
};

type FormSchema =
  | typeof createDepartmentValidator
  | typeof updateDepartmentValidator;
type FormValues = z.infer<FormSchema>;

const DepartmentForm = ({
  businessId,
  departmentData,
  children,
  onClose,
  onSuccess,
}: DepartmentFormProps) => {
  const isUpdatingMode = Boolean(departmentData?.id);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const defaultValues: FormValues = {
    name: departmentData?.name || '',
    description: departmentData?.description || '',
    businessId,
    active: departmentData?.active || true,
  };

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues,
  });

  const { mutate: createDepartment, isPending: isCreating } =
    useServerActionMutation(createDepartmentAction, {
      mutationKey: ['create-department'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Department created successfully');
      },
      onError: error => toast.error(error.message),
    });

  const { mutate: updateDepartment, isPending: isUpdating } =
    useServerActionMutation(updateDepartmentAction, {
      mutationKey: ['update-department'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Department updated successfully');
      },
      onError: error => toast.error(error.message),
    });

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose?.();
      reset();
    }
    setIsOpen(open);
  };

  const onSubmit = handleSubmit(data => {
    const payload = {
      name: data.name || '',
      description: data.description,
      active: data.active,
      businessId,
    };

    if (isUpdatingMode) {
      updateDepartment({
        ...payload,
        departmentId: departmentData?.id as string,
      });
    } else {
      createDepartment({
        ...payload,
      });
    }
  });

  const isLoading = isCreating || isUpdating;

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Open dialog</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdatingMode ? 'Edit' : 'Create new'} Department
          </DialogTitle>
          <DialogDescription>
            {isUpdatingMode
              ? 'Make changes to an existing business department.'
              : 'Add a new department to your business. Then you can add roles to it.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <InputWrapper
            inputId='name'
            label='Department name'
            error={errors.name?.message}
          >
            <Input
              id='name'
              {...register('name')}
              placeholder='e.g. Kitchen, Security, Bar'
              type='text'
            />
          </InputWrapper>

          <InputWrapper
            inputId='description'
            label='Description'
            error={errors.description?.message}
          >
            <Textarea
              id='description'
              {...register('description')}
              placeholder='Brief description about this department'
              rows={5}
              className='resize-none max-h-48'
            />
          </InputWrapper>

          {isUpdatingMode && (
            <div className='flex items-center justify-between gap-2'>
              <div className='space-y-1'>
                <Label>Department visibility</Label>
                <p className='text-sm text-muted-foreground max-w-xs'>
                  Toggle if you want the department to be active or inactive
                </p>
              </div>
              <Controller
                control={control}
                name='active'
                render={({ field }) => (
                  <Switch
                    onCheckedChange={field.onChange}
                    checked={field.value}
                    defaultChecked={field.value}
                  />
                )}
              />
            </div>
          )}

          <DialogFooter>
            <Button
              type='button'
              onClick={() => {
                setIsOpen(false);
                reset();
              }}
              disabled={isLoading}
              size='sm'
              variant='outline'
            >
              Cancel
            </Button>
            <Button type='submit' disabled={isLoading} size='sm'>
              {isUpdatingMode ? 'Update' : 'Create'}{' '}
              {isLoading && <Loader2 className='size-4 ml-1 animate-spin' />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentForm;
