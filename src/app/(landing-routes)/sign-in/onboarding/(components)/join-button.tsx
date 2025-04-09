'use client';

import { Info, Loader2, MoveRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

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
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { joinBusiness as joinBusinessAction } from '@/actions/business/join-business';

type JoinButtonProps = {
  businessName: string;
  businessId: string;
};

const JoinButton = ({ businessId, businessName }: JoinButtonProps) => {
  const router = useRouter();
  const { mutate: joinBusiness, isPending } = useServerActionMutation(
    joinBusinessAction,
    {
      mutationKey: ['join-business'],
      onSuccess: () => {
        router.replace(`/business/${businessId}/overview`);
        toast.success('Business joinned successfully', {
          description: 'Wait while being redirected to dashboard.',
        });
      },
      onError: error => toast.error(error.message),
    }
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size='sm' className='group'>
          Join now
          <MoveRight className='size-4 ml-1 group-hover:translate-x-1 transition-transform' />
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md space-y-6 p-4'>
        <DialogHeader className='flex flex-col items-center gap-2'>
          <Info className='text-orange-400 size-7' />
          <div className='text-center space-y-2'>
            <DialogTitle className='text-base'>Confirm Join</DialogTitle>
            <DialogDescription className='text-center max-w-sm'>
              You are about to join{' '}
              <span className='font-medium'>{businessName}</span> business. You
              can only be part of one business at a time, but you’re free to
              leave and join another whenever you like.
            </DialogDescription>
          </div>
        </DialogHeader>

        <DialogFooter>
          <div className='w-full flex flex-col items-center gap-2'>
            <Button
              disabled={isPending}
              size='sm'
              onClick={() => joinBusiness({ businessId })}
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

export default JoinButton;
