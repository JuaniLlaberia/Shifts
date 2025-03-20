'use server';

import { db } from '@/db';
import { authenticatedAction } from '@/lib/safe-actions';
import { updateUserValidator } from '@/zod-validators/user';

export const updateUser = authenticatedAction
  .createServerAction()
  .input(updateUserValidator)
  .handler(async ({ input: { fullName, image, locale }, ctx: { userId } }) => {
    try {
      await db.user.update({
        where: { id: userId },
        data: {
          fullName,
          image,
          locale,
        },
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
    }
  });
