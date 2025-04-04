'use server';

import { db } from '@/db';
import { authenticatedAction } from '@/lib/safe-actions';
import { createFeedbackValidator } from '@/zod-validators/feedback';

export const createFeedback = authenticatedAction
  .createServerAction()
  .input(createFeedbackValidator)
  .handler(async ({ input: { feedback }, ctx: { userId } }) => {
    try {
      const feedbackDB = await db.feedback.findFirst({
        where: {
          userId,
        },
        select: { id: true, createdAt: true },
      });

      if (feedbackDB) {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        if (feedbackDB.createdAt > oneWeekAgo)
          throw new Error('You can only submit feedback once per week.');
      }

      await db.feedback.create({
        data: {
          userId,
          feedback,
        },
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
