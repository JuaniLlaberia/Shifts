'use server';

import { db } from '@/db';
import { authenticatedAction } from '@/lib/safe-actions';
import { z } from 'zod';

export const deleteUser = authenticatedAction
  .createServerAction()
  .input(z.object({}))
  .handler(async ({ ctx: { userId } }) => {
    try {
      await db.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
