import { z } from 'zod';

export const deleteNotificationValidator = z.object({
  notificationId: z.string().cuid({ message: 'Invalid notification Id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const markNotificationsAsReadValidator = z.object({
  notificaitons: z.array(
    z.string().cuid({ message: 'Invalid notification id' })
  ),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
