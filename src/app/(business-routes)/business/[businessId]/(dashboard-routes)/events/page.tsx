import { CalendarDays, Clock, MapPin, Plus } from 'lucide-react';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';

import EventForm from './(components)/event-form';
import EventActions from './(components)/event-actions';
import { getEvents } from '@/access-data/event/get-events';
import { Button } from '@/components/ui/button';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '@/lib/consts';

const EventsPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{ page: number }>;
}) => {
  const { businessId } = await params;
  const { page } = await searchParams;

  const { events, isAdmin } = await getEvents({
    businessId,
    page: page || INITIAL_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  if (!isAdmin) return notFound();

  return (
    <section className='p-8 h-full flex flex-col gap-4'>
      <header className='flex items-center justify-between'>
        <h1 className='text-lg font-medium'>Upcomming Events</h1>
        <div className='space-x-2'>
          <EventForm businessId={businessId}>
            <Button size='sm'>
              <Plus className='size-4 mr-1' />
              Add event
            </Button>
          </EventForm>
        </div>
      </header>
      <div className='flex-1 flex flex-col'>
        {events.length > 0 ? (
          <ul className='flex-1 grid md:grid-cols-2 lg:grid-cols-3 gap-2'>
            {events.map(event => (
              <li
                key={event.id}
                className='relative flex flex-col gap-6 bg-background border border-border rounded-xl p-6'
              >
                <div className='flex items-start justify-between gap-4'>
                  <div>
                    <h2 className='text-lg font-medium'>{event.name}</h2>
                    <p className='text-muted-foreground text-sm'>
                      {event.description}
                    </p>
                  </div>
                  <EventActions eventData={event} />
                </div>
                <ul className='space-y-2'>
                  <li className='flex items-center text-sm'>
                    <MapPin className='mr-2 size-4 text-muted-foreground' />
                    <span>{event.location}</span>
                  </li>
                  <li className='flex items-center text-sm'>
                    <CalendarDays className='mr-2 size-4 text-muted-foreground' />
                    <span>{format(event.date, 'EEEE, MMMM d, yyyy')}</span>
                  </li>
                  <li className='flex items-center text-sm'>
                    <Clock className='mr-2 size-4 text-muted-foreground' />
                    <span>Starts at {format(event.date, 'hh:mm a')}</span>
                  </li>
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <div className='flex flex-col items-center justify-center flex-1'>
            <div className='bg-background border border-border rounded-xl p-3 mb-2 shadow'>
              <CalendarDays
                className='size-6 stroke-amber-400'
                strokeWidth={2}
              />
            </div>
            <h2 className='font-medium text-lg'>No events</h2>
            <p className='text-muted-foreground'>
              Your business has 0 events. You can start by creation one.
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsPage;
