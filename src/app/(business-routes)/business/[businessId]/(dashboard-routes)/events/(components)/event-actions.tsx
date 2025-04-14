'use client';

import { useState } from 'react';
import { Edit3, MoreHorizontal, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Event } from '@prisma/client';

import EventForm from './event-form';
import DeleteEventDialog from './delete-event-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type LocationActionsProps = {
  eventData: Event;
};

const EventActions = ({ eventData }: LocationActionsProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { businessId } = useParams<{ businessId: string }>();

  return (
    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' className={cn('rounded-lg')}>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal
            className='size-4 text-muted-foreground'
            strokeWidth={1.5}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align='end'
        side='bottom'
        className='z-[500]'
        avoidCollisions={true}
      >
        <EventForm
          businessId={businessId}
          eventData={eventData}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem onSelect={e => e.preventDefault()}>
            <Edit3 className='size-3.5 mr-1' />
            Edit Event
          </DropdownMenuItem>
        </EventForm>

        <DropdownMenuSeparator />

        <DeleteEventDialog
          businessId={businessId}
          eventId={eventData.id}
          eventName={eventData.name}
          eventDate={eventData.date}
          onClose={() => setIsMenuOpen(false)}
        >
          <DropdownMenuItem
            className='hover:text-red-400! hover:[&_svg]:stroke-red-400 hover:cursor-pointer'
            onSelect={e => e.preventDefault()}
          >
            <Trash2 className='size-3.5 mr-1' />
            Delete Event
          </DropdownMenuItem>
        </DeleteEventDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EventActions;
