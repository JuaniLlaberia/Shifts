'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateTemplateValidator } from '@/zod-validators/template';

export const updateDepartment = protectedAction
  .createServerAction()
  .input(updateTemplateValidator)
  .handler(
    async ({
      input: { templateId, name, note, startTime, endTime, businessId },
    }) => {
      try {
        await db.template.update({
          where: { id: templateId },
          data: {
            name,
            startTime,
            endTime,
            note,
          },
        });

        revalidatePath(`/business/${businessId}/templates`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
