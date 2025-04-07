'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteEmployeeValidator } from '@/zod-validators/employee';

export const deleteEmployee = protectedAction
  .createServerAction()
  .input(deleteEmployeeValidator)
  .handler(async ({ input: { employeeId, businessId } }) => {
    try {
      await db.employee.delete({ where: { id: employeeId } });

      revalidatePath(`/business/${businessId}/settings/employees`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
