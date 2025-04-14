'use client';

import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { ReactNode, useState } from 'react';
import { format } from 'date-fns';

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
import { Button } from '@/components/ui/button';
import { deleteEvent as deleteEventAction } from '@/actions/event/delete-event';

type DeleteEventDialogProps = {
  businessId: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  children?: ReactNode;
  onClose?: () => void;
};

const DeleteEventDialog = ({
  businessId,
  eventId,
  eventName,
  eventDate,
  children,
  onClose,
}: DeleteEventDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const { mutate: deleteEvent, isPending } = useServerActionMutation(
    deleteEventAction,
    {
      mutationKey: ['delete-event'],
      onSuccess: () => {
        toast.success('Event deleted successfully');
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
        {children || <Button size='sm'>Open Dialog</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to delete {eventName} event happenning on the{' '}
              {format(eventDate, 'EEEE, MMMM d, yyyy')} at{' '}
              {format(eventDate, 'hh:mm a')}. Employees will be notified.{' '}
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
              onClick={() =>
                deleteEvent({
                  businessId,
                  eventId,
                  name: eventName,
                  date: eventDate,
                })
              }
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

export default DeleteEventDialog;
