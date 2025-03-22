'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteRoleValidator } from '@/zod-validators/role';

export const deleteRole = protectedAction
  .createServerAction()
  .input(deleteRoleValidator)
  .handler(async ({ input: { roleId, businessId } }) => {
    try {
      await db.role.delete({ where: { id: roleId } });

      revalidatePath(`/business/${businessId}/roles`);
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
      throw new Error('Unknown error occurred');
    }
  });
