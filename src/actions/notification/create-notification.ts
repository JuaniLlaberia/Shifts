'use server';

import { MessageKey, NotificationType } from '@prisma/client';

import { notificationDataRequirements } from './notification-requirements';
import { db } from '@/db';

type CreateNotificationType = {
  type: NotificationType;
  messageKey: MessageKey;
  recipientId: string;
  messageData: any;
};

export const createNotification = async ({
  type,
  messageKey,
  recipientId,
  messageData,
}: CreateNotificationType) => {
  // Validate data
  const requiredFields = notificationDataRequirements[messageKey] || [];
  const missingFields = requiredFields.filter(
    field => messageData[field] === undefined
  );

  if (missingFields.length > 0)
    throw new Error(
      `Missing required data for ${messageKey}: ${missingFields.join(', ')}`
    );

  // Create notification
  await db.notification.create({
    data: {
      type,
      messageKey,
      messageData,
      recipientId,
    },
  });
};
