'use client';

import { Role } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import InputWrapper from '@/components/ui/input-wrapper';
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
import {
  useServerActionMutation,
  useServerActionQuery,
} from '@/hooks/use-server-actions';
import {
  createRoleValidator,
  updateRoleValidator,
} from '@/zod-validators/role';
import { DEFAULT_ROLE_COLOR } from '@/lib/consts';
import { createRole as createRoleAction } from '@/actions/role/create-role';
import { updateRole as updateRoleAction } from '@/actions/role/update-role';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getDepartmentsClient } from '@/access-data/department/get-departments-client';
import { Skeleton } from '@/components/ui/skeleton';

type RoleFormProps = {
  businessId: string;
  roleData?: Role;
  children?: ReactNode;
  onSuccess?: () => void;
  onClose?: () => void;
};

type FormSchema = typeof createRoleValidator | typeof updateRoleValidator;
type FormValues = z.infer<FormSchema>;

const RoleForm = ({
  businessId,
  roleData,
  children,
  onClose,
  onSuccess,
}: RoleFormProps) => {
  const isUpdatingMode = Boolean(roleData?.id);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { isLoading: isFetching, data: departments } = useServerActionQuery(
    getDepartmentsClient,
    {
      input: {
        businessId,
      },
      queryKey: ['get-departments'],
    }
  );

  const defaultValues: FormValues = {
    name: roleData?.name || '',
    color: roleData?.color || DEFAULT_ROLE_COLOR,
    permissions: roleData?.permissions || 'MEMBER',
    departmentId: roleData?.departmentId || '',
    businessId,
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

  const { mutate: createRole, isPending: isCreating } = useServerActionMutation(
    createRoleAction,
    {
      mutationKey: ['create-role'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Role created successfully');
      },
      onError: error => toast.error(error.message),
    }
  );

  const { mutate: updateRole, isPending: isUpdating } = useServerActionMutation(
    updateRoleAction,
    {
      mutationKey: ['update-role'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Role updated successfully');
      },
      onError: error => toast.error(error.message),
    }
  );

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
      color: data.color || DEFAULT_ROLE_COLOR,
      permissions: data.permissions || 'MEMBER',
      departmentId: data.departmentId,
      businessId,
    };

    if (isUpdatingMode) {
      updateRole({
        ...payload,
        roleId: roleData?.id as string,
      });
    } else {
      createRole({
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
            {isUpdatingMode ? 'Edit' : 'Create new'} Role
          </DialogTitle>
          <DialogDescription>
            {isUpdatingMode
              ? 'Make changes to an existing business role.'
              : 'Add a new role to your business.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className='space-y-4'>
          <InputWrapper
            inputId='name'
            label='Role name'
            error={errors.name?.message}
          >
            <Input
              id='name'
              {...register('name')}
              placeholder='e.g. Chef, Bartender, Manager'
              type='text'
            />
          </InputWrapper>

          <InputWrapper
            inputId='department'
            label='Department'
            error={errors.departmentId?.message}
          >
            {isFetching ? (
              <Skeleton className='w-full h-10' />
            ) : (
              <Controller
                control={control}
                name='departmentId'
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <SelectTrigger id='department' className='w-full'>
                      <SelectValue placeholder='Select role department' />
                    </SelectTrigger>
                    <SelectContent className='z-[10000]'>
                      {departments?.map(({ id, name }) => (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            )}
          </InputWrapper>

          <InputWrapper
            inputId='permissions'
            label='Permissions'
            error={errors.permissions?.message}
          >
            <Controller
              control={control}
              name='permissions'
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger id='department' className='w-full'>
                    <SelectValue placeholder='Select role permissions' />
                  </SelectTrigger>
                  <SelectContent className='z-[10000]'>
                    <SelectItem value='ADMIN'>Administrator</SelectItem>
                    <SelectItem value='MEMBER'>Employee</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </InputWrapper>

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

export default RoleForm;
