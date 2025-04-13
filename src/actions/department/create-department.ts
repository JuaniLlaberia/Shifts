'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createDepartmentValidator } from '@/zod-validators/department';
import { revalidatePath } from 'next/cache';

export const createDepartment = protectedAction
  .createServerAction()
  .input(createDepartmentValidator)
  .handler(async ({ input: { businessId, name, description } }) => {
    try {
      await db.department.create({
        data: {
          name,
          description,
          businessId,
        },
      });

      revalidatePath(`/business/${businessId}/departments`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
