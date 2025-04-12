'use client';

import {
  Bell,
  CalendarDays,
  Clock,
  Loader2,
  MailOpen,
  Trash2,
} from 'lucide-react';
import { Notification } from '@prisma/client';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { format, formatDistance } from 'date-fns';

import Badge from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { deleteNotification as deleteNotificationAction } from '@/actions/notification/delete-notifications';
import { markNotificationsAsRead as markNotificationsAsReadAction } from '@/actions/notification/mark-notifications-as-read';
import { messageKeyToI18nKey } from '@/lib/message-key-to-i18n';
import { NOTIFICATIONS_TYPE_LABELS } from '@/lib/dictionaries';

type NotificationCardProps = {
  notification: Notification;
  businessId: string;
};

const NotificationCard = ({
  notification,
  businessId,
}: NotificationCardProps) => {
  const { id, createdAt, type, status, messageKey, messageData } = notification;
  const t = useTranslations();

  const { mutate: deleteNotification, isPending: isDeleting } =
    useServerActionMutation(deleteNotificationAction, {
      mutationKey: ['delete-notification'],
      onError: () => toast.error('Failed to delete notificaiton'),
    });

  const { mutate: markNotificationsAsRead, isPending: isMarking } =
    useServerActionMutation(markNotificationsAsReadAction, {
      mutationKey: ['mark-notification-as-read'],
      onError: err => {
        console.log(err);
        toast.error('Failed to mark notification as read');
      },
    });

  const isLoading = isDeleting || isMarking;

  return (
    <li className='flex flex-col gap-6 bg-background border border-border rounded-xl p-4 hover:bg-gray-50'>
      <div className='flex items-center justify-between gap-4'>
        <div className='space-y-2'>
          {status === 'UNREAD' && (
            <Badge color='orange' decorated>
              Unread
            </Badge>
          )}
          <h3 className='text-sm font-medium'>
            {t(messageKeyToI18nKey[messageKey], messageData)}
          </h3>
        </div>
        <div className='flex items-center gap-1 [&_p]:text-xs [&_p]:border [&_p]:border-border [&_p]:p-1 [&_p]:px-1.5 [&_p]:rounded-md'>
          <p className='flex items-center gap-1.5'>
            <Bell className='size-3 text-muted-foreground' strokeWidth={2.5} />{' '}
            {NOTIFICATIONS_TYPE_LABELS[type]}
          </p>
          <p className='flex items-center gap-1.5'>
            <Clock className='size-3 text-muted-foreground' strokeWidth={2.5} />{' '}
            {formatDistance(createdAt, new Date(), {
              addSuffix: true,
            })}
          </p>
          <p className='flex items-center gap-1.5'>
            <CalendarDays
              className='size-3 text-muted-foreground'
              strokeWidth={2.5}
            />{' '}
            {format(createdAt, 'MM/dd/yyyy')}
          </p>
        </div>
      </div>
      <div className='flex items-center justify-end gap-2'>
        {status === 'UNREAD' && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size='icon'
                variant='outline'
                className='text-muted-foreground rounded-lg'
                onClick={() =>
                  markNotificationsAsRead({
                    notificaitons: [id],
                    businessId,
                  })
                }
                disabled={isLoading}
              >
                {isMarking ? (
                  <Loader2 className='size-3.5 animate-spin' />
                ) : (
                  <MailOpen className='size-3.5' />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark as read</TooltipContent>
          </Tooltip>
        )}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='sm'
              variant='outline'
              className='text-muted-foreground rounded-lg hover:text-red-400 text-xs'
              onClick={() =>
                deleteNotification({ notifications: [id], businessId })
              }
              disabled={isLoading}
            >
              {isDeleting ? (
                <Loader2 className='size-3.5 mr-1 animate-spin' />
              ) : (
                <Trash2 className='size-3.5 mr-1' />
              )}
              Delete
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete notification</TooltipContent>
        </Tooltip>
      </div>
    </li>
  );
};

export default NotificationCard;
