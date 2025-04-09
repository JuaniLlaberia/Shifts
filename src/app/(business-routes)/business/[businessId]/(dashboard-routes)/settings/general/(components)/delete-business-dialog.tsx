'use client';

import { useState, type ReactElement } from 'react';
import { toast } from 'sonner';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
import { deleteBusiness as deleteBusinessAction } from '@/actions/business/delete-business';

type DeleteBusinessDialogProps = {
  businessId: string;
  children?: ReactElement;
  onSuccess?: () => void;
};

const DeleteBusinessDialog = ({
  businessId,
  children,
  onSuccess,
}: DeleteBusinessDialogProps) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { mutate: deleteBusiness, isPending } = useServerActionMutation(
    deleteBusinessAction,
    {
      mutationKey: ['delete-business'],
      onSuccess: () => {
        onSuccess?.();
        router.push('/');
        toast.success('Business deleted successfully');
        setIsOpen(false);
      },
      onError: () => toast.error('Failed to delete business'),
    }
  );

  const handleDeleteBusiness = async () => {
    deleteBusiness({ businessId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Delete Business</Button>}
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <AlertCircle className='text-red-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Deletion</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to delete your business and all of it&apos;s data.{' '}
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
              onClick={handleDeleteBusiness}
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

export default DeleteBusinessDialog;
