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
import { deleteRole as deleteRoleAction } from '@/actions/role/delete-role';

type DeleteRoleDialogProps = {
  businessId: string;
  roleId: string;
  roleName: string;
  children?: ReactElement;
  onSuccess?: () => void;
};

const DeleteRoleDialog = ({
  businessId,
  roleId,
  roleName,
  children,
  onSuccess,
}: DeleteRoleDialogProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: deleteRole, isPending } = useServerActionMutation(
    deleteRoleAction,
    {
      mutationKey: ['delete-role'],
      onSuccess: () => {
        onSuccess?.();
        toast.success('Role deleted successfully');
        setIsOpen(false);
      },
      onError: () => toast.error('Failed to delete role'),
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Delete Role</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to delete {roleName} role from your business.{' '}
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
              onClick={() => deleteRole({ roleId, businessId })}
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

export default DeleteRoleDialog;
