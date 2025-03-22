'use server';

import { db } from '@/db';
import { authenticatedAction } from '@/lib/safe-actions';

export const deleteUser = authenticatedAction
  .createServerAction()
  .handler(async ({ ctx: { userId } }) => {
    try {
      await db.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
