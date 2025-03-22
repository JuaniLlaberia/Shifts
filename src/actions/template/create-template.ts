'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createTemplateValidator } from '@/zod-validators/template';
import { revalidatePath } from 'next/cache';

export const createTempalte = protectedAction
  .createServerAction()
  .input(createTemplateValidator)
  .handler(
    async ({ input: { businessId, name, startTime, endTime, note } }) => {
      try {
        await db.template.create({
          data: {
            name,
            startTime,
            endTime,
            note,
            businessId,
          },
        });

        revalidatePath(`/business/${businessId}/templates`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
