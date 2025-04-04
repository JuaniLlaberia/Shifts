'use client';

import { Loader2, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import InputWrapper from '../ui/input-wrapper';
import { createFeedbackValidator } from '@/zod-validators/feedback';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { createFeedback as createFeedbackAction } from '@/actions/feedback/create-feedback';

const FeedbackDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createFeedbackValidator),
    defaultValues: {
      feedback: '',
    },
  });

  const { mutate: createFeedback, isPending } = useServerActionMutation(
    createFeedbackAction,
    {
      onSuccess: () => {
        toast.success('Feedback submitted successfully');
        setIsOpen(false);
        reset();
      },
      onError: error => toast.error(error.message),
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm'>
          Feedback
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-md! space-y-4 p-4'>
        <DialogHeader>
          <DialogTitle>Give us your feedback</DialogTitle>
          <DialogDescription>
            We&apos;d love to hear your thoughts! Share your feedback to help us
            improve and create a better experience for you.
          </DialogDescription>
        </DialogHeader>
        <form
          className='space-y-4'
          onSubmit={handleSubmit(data => {
            createFeedback({ ...data });
          })}
        >
          <InputWrapper inputId='feedback' error={errors.feedback?.message}>
            <Textarea
              id='feedback'
              placeholder='Write your feedback...'
              rows={5}
              className='resize-none max-h-48'
              {...register('feedback')}
            />
          </InputWrapper>
          <DialogFooter>
            <div className='flex flex-col gap-2 w-full'>
              <Button size='sm' disabled={isPending}>
                Submit
                {isPending ? (
                  <Loader2 className='size-4 ml-1 animate-spin' />
                ) : (
                  <Send className='size-4 ml-1' />
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  disabled={isPending}
                  size='sm'
                  variant='ghost'
                  onClick={() => reset()}
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
