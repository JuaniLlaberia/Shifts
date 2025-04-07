'use client';

import { useState } from 'react';
import { AlertCircle, Loader2, MoreHorizontal, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';

import { deleteEmployee as deleteEmployeeAction } from '@/actions/employee/delete-employee';
import { Button } from '@/components/ui/button';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useServerActionMutation } from '@/hooks/use-server-actions';

type EmployeeActionsProps = {
  employeeName: string | null;
  employeeId: string;
};

const EmployeeActions = ({
  employeeName,
  employeeId,
}: EmployeeActionsProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { businessId } = useParams<{ businessId: string }>();

  const { mutate: deleteEmployee, isPending } = useServerActionMutation(
    deleteEmployeeAction,
    {
      mutationKey: ['remove-employee'],
      onSuccess: () => toast.success('Employee removed successfully'),
      onError: () => toast.error('Failed to remove employee'),
      onSettled: () => setIsOpen(false),
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            disabled={isPending}
            size='icon'
            variant='ghost'
            className='rounded-lg border border-transparent hover:bg-background hover:border-border data-[state=open]:bg-background data-[state=open]:border-border transition-transform'
          >
            <MoreHorizontal className='size-4 text-muted-foreground' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' side='bottom'>
          <DialogTrigger asChild>
            <DropdownMenuItem
              disabled={isPending}
              className='hover:text-red-400! hover:[&_svg]:stroke-red-400 hover:cursor-pointer'
            >
              <Trash2 className='size-3.5 mr-1' /> Remove employee
            </DropdownMenuItem>
          </DialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Removal</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to remove {employeeName || 'this employee'} from
              your business. Some data may be lost.{' '}
              <span className='text-red-500 font-medium'>
                Procide with caution.
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
              onClick={() => deleteEmployee({ businessId, employeeId })}
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

export default EmployeeActions;
