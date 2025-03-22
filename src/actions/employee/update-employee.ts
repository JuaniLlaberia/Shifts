'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateEmployeeValidator } from '@/zod-validators/employee';

export const updateEmployee = protectedAction
  .createServerAction()
  .input(updateEmployeeValidator)
  .handler(async ({ input: { employeeId, businessId, roleId } }) => {
    try {
      await db.employee.update({
        where: { id: employeeId },
        data: {
          roleId,
        },
      });

      revalidatePath(`/business/${businessId}/employees`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
