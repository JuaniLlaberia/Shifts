'use client';

import { CheckCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useServerActionMutation } from '@/hooks/use-server-actions';
import { deleteNotification as deleteNotificationAction } from '@/actions/notification/delete-notifications';

type ClearNotificationsButtonProps = {
  ids: string[];
  businessId: string;
};

const ClearNotificationsButton = ({
  ids,
  businessId,
}: ClearNotificationsButtonProps) => {
  const { mutate: deleteNotifications, isPending } = useServerActionMutation(
    deleteNotificationAction,
    {
      mutationKey: ['delete-notification'],
      onSuccess: () => toast.success('Notifications cleared'),
      onError: () => toast.error('Failed to delete notificaiton'),
    }
  );

  return (
    <Button
      size='sm'
      variant='outline'
      className='text-muted-foreground text-xs'
      onClick={() => deleteNotifications({ notifications: ids, businessId })}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2 className='size-4 mr-1 animate-spin' />
      ) : (
        <CheckCheck className='size-4 mr-1' />
      )}{' '}
      Clear all
    </Button>
  );
};

export default ClearNotificationsButton;
