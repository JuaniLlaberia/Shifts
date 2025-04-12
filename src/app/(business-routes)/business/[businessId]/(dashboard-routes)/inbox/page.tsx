import { Inbox } from 'lucide-react';
import { notFound } from 'next/navigation';
import { NotificationStatus, NotificationType } from '@prisma/client';

import FiltersForm from '@/components/special/filter-form';
import NotificationCard from './(components)/notification-card';
import ClearNotificationsButton from './(components)/clear-notifications-button';
import { getNotifications } from '@/access-data/notification/get-notifications';
import { DEFAULT_PAGE_SIZE, INITIAL_PAGE } from '@/lib/consts';
import {
  NOTIFICATIONS_STATUS_LABELS,
  NOTIFICATIONS_TYPE_LABELS,
} from '@/lib/dictionaries';

const INBOX_FILTERS = [
  {
    label: 'Type',
    field: 'type',
    options: Object.entries(NOTIFICATIONS_TYPE_LABELS).map(([key, value]) => ({
      label: value,
      value: key,
    })),
  },
  {
    label: 'Status',
    field: 'status',
    options: Object.entries(NOTIFICATIONS_STATUS_LABELS).map(
      ([key, value]) => ({
        label: value,
        value: key,
      })
    ),
  },
];

const InboxPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ businessId: string }>;
  searchParams: Promise<{
    type: NotificationType;
    status: NotificationStatus;
    page: number;
  }>;
}) => {
  const { businessId } = await params;
  const { type, status, page } = await searchParams;

  const { notifications, isAdmin } = await getNotifications({
    businessId,
    type,
    status,
    pageSize: DEFAULT_PAGE_SIZE,
    page: page || INITIAL_PAGE,
  });
  if (!isAdmin) return notFound();

  return (
    <section className='h-full p-8 flex flex-col'>
      <header className='flex items-center justify-between mb-4'>
        <h1 className='text-lg font-medium'>Your notifications</h1>
        <div className='space-x-2'>
          <FiltersForm filters={INBOX_FILTERS} />
          <ClearNotificationsButton
            ids={notifications.map(notification => notification.id)}
            businessId={businessId}
          />
        </div>
      </header>
      <div className='flex-1 flex flex-col'>
        {notifications.length > 0 ? (
          <ul className='flex-1 space-y-2'>
            {notifications.map(notification => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                businessId={businessId}
              />
            ))}
          </ul>
        ) : (
          <div className='flex flex-col items-center justify-center flex-1'>
            <div className='bg-background border border-border rounded-xl p-3 mb-2 shadow'>
              <Inbox className='size-6 stroke-amber-400' strokeWidth={2} />
            </div>
            <h2 className='font-medium text-lg'>Inbox empty</h2>
            <p className='text-muted-foreground'>
              You have 0 notifications. There is nothing new 🎉
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default InboxPage;
