'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteDepartmentValidator } from '@/zod-validators/department';

export const deleteDepartment = protectedAction
  .createServerAction()
  .input(deleteDepartmentValidator)
  .handler(async ({ input: { departmentId, businessId } }) => {
    try {
      await db.department.delete({ where: { id: departmentId } });

      revalidatePath(`/business/${businessId}/templates`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Foreign key constraint failed')) {
          throw new Error(
            'Cannot delete department because it still has roles assigned.'
          );
        } else {
          throw error.message;
        }
      }
    }
  });
