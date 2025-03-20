'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateDepartmentValidator } from '@/zod-validators/department';

export const updateDepartment = protectedAction
  .createServerAction()
  .input(updateDepartmentValidator)
  .handler(
    async ({ input: { departmentId, name, description, businessId } }) => {
      try {
        await db.department.update({
          where: { id: departmentId },
          data: {
            name,
            description,
          },
        });

        revalidatePath(`/business/${businessId}/departments`);
      } catch (error) {
        if (error instanceof Error) {
          throw error.message;
        }
      }
    }
  );
