'use client';

import { useState, type ReactElement } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { deleteDepartment as deleteDepartmentAction } from '@/actions/department/delete-department';

type DeleteDepartmentDialogProps = {
  businessId: string;
  departmentId: string;
  departmentName: string;
  children?: ReactElement;
  onSuccess?: () => void;
};

const DeleteDepartmentDialog = ({
  businessId,
  departmentId,
  departmentName,
  children,
  onSuccess,
}: DeleteDepartmentDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: deleteDepartment, isPending } = useServerActionMutation(
    deleteDepartmentAction,
    {
      mutationKey: ['delete-department'],
      onSuccess: () => {
        onSuccess?.();
        toast.success('Department deleted successfully', {
          description: 'Roles have also been deleted.',
        });
        setIsOpen(false);
      },
      onError: () => toast.error('Failed to delete department'),
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Delete Department</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to delete {departmentName} department from your
              business. All information and roles related to this department
              will be also deleted.{' '}
              <span className='text-red-500 font-medium'>
                This action is irreversible.
              </span>
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className='w-full flex flex-col items-center gap-2'>
            <Button
              disabled={isPending}
              size='sm'
              variant='destructive'
              onClick={() => deleteDepartment({ departmentId, businessId })}
              className='w-full'
            >
              {isPending && <Loader2 className='size-4 animate-spin' />}
              Confirm
            </Button>
            <DialogClose asChild>
              <Button
                size='sm'
                variant='ghost'
                disabled={isPending}
                className='w-full'
              >
                Cancel
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDepartmentDialog;
