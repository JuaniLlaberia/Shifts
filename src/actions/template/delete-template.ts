'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteTemplateValidator } from '@/zod-validators/template';

export const deleteTemplate = protectedAction
  .createServerAction()
  .input(deleteTemplateValidator)
  .handler(async ({ input: { templateId, businessId } }) => {
    try {
      await db.template.delete({ where: { id: templateId } });

      revalidatePath(`/business/${businessId}/templates`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
    }
  });
