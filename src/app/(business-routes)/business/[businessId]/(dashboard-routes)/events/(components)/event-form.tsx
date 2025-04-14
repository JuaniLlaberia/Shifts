'use client';

import { Event } from '@prisma/client';
import { Loader2 } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import InputWrapper from '@/components/ui/input-wrapper';
import { createEvent as createEventAction } from '@/actions/event/create-envent';
import { updateEvent as updateEventAction } from '@/actions/event/update-event';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import {
  createEventValidator,
  updateEventValidator,
} from '@/zod-validators/event';

type EventFormProps = {
  businessId: string;
  eventData?: Event;
  children?: ReactNode;
  onSuccess?: () => void;
  onClose?: () => void;
};

type FormSchema = typeof createEventValidator | typeof updateEventValidator;
type FormValues = z.infer<FormSchema>;

const EventForm = ({
  businessId,
  eventData,
  children,
  onSuccess,
  onClose,
}: EventFormProps) => {
  const isUpdatingMode = Boolean(eventData?.id);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: eventData?.name || '',
      description: eventData?.description || '',
      date: eventData?.date,
      location: eventData?.location || '',
      businessId,
    },
  });

  const { mutate: createEvent, isPending: isCreating } =
    useServerActionMutation(createEventAction, {
      mutationKey: ['create-event'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        reset();
        toast.success('Event created successfully');
      },
      onError: error => toast.error(error.message),
    });

  const { mutate: updateEvent, isPending: isUpdating } =
    useServerActionMutation(updateEventAction, {
      mutationKey: ['update-event'],
      onSuccess: () => {
        onSuccess?.();
        setIsOpen(false);
        toast.success('Event updated successfully');
      },
      onError: error => toast.error(error.message),
    });

  const isLoading = isCreating || isUpdating;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      reset();
      onClose?.();
    }
    setIsOpen(open);
  };

  const onSubmit = handleSubmit(data => {
    const payload = {
      name: data.name || '',
      description: data.description || '',
      location: data.location || '',
      date: data.date || new Date(),
      businessId,
    };

    if (isUpdatingMode) {
      updateEvent({
        ...payload,
        eventId: eventData?.id as string,
      });
    } else {
      createEvent({
        ...payload,
      });
    }
  });

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || <Button size='sm'>Open Dialog</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isUpdatingMode ? 'Edit' : 'Create new'} Event
          </DialogTitle>
          <DialogDescription>
            {isUpdatingMode
              ? 'Make changes to an existing business event. All employees will be notified.'
              : 'Publish a new business event. All employees will be notified.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className='space-y-4'>
          <InputWrapper
            inputId='name'
            label='Event name'
            error={errors.name?.message}
          >
            <Input
              id='name'
              type='text'
              placeholder='You event name (e.g. New years party)'
              {...register('name')}
            />
          </InputWrapper>
          <InputWrapper
            inputId='description'
            label='Description'
            error={errors.description?.message}
          >
            <Textarea
              id='description'
              placeholder='Tell your employees what is the event about'
              {...register('description')}
              className='resize-none max-h-24'
              rows={5}
            />
          </InputWrapper>
          <InputWrapper
            inputId='location'
            label='Location'
            error={errors.location?.message}
          >
            <Input
              id='location'
              type='text'
              placeholder='Where is the event taking place?'
              {...register('location')}
            />
          </InputWrapper>
          <InputWrapper
            inputId='name'
            label='Event name'
            error={errors.name?.message}
          >
            <DateTimePicker
              defaultDate={eventData?.date}
              onLocationChange={(newDate: Date) => setValue('date', newDate)}
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

export default EventForm;
