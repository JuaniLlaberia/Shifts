'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReactNode, useState } from 'react';

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
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { deleteLocaiton as deleteLocationAction } from '@/actions/location/delete-location';
import { Button } from '@/components/ui/button';

type DeleteLocationDialogProps = {
  businessId: string;
  locationId: string;
  children?: ReactNode;
  onClose?: () => void;
};

const DeleteLocationDialog = ({
  businessId,
  locationId,
  children,
  onClose,
}: DeleteLocationDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { mutate: deleteLocation, isPending } = useServerActionMutation(
    deleteLocationAction,
    {
      mutationKey: ['delete-location'],
      onSuccess: () => {
        toast.success('Location deleted successfully');
        onClose?.();
        setIsDialogOpen(false);
      },
      onError: error => toast.error(error.message),
    }
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose?.();
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Open Menu</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to delete this location from your business. Shifts
              information may change.{' '}
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
              onClick={() => deleteLocation({ businessId, locationId })}
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

export default DeleteLocationDialog;
