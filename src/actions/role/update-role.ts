'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateRoleValidator } from '@/zod-validators/role';

export const updateRole = protectedAction
  .createServerAction()
  .input(updateRoleValidator)
  .handler(
    async ({
      input: { roleId, name, color, permissions, departmentId, businessId },
    }) => {
      try {
        await db.role.update({
          where: { id: roleId },
          data: {
            name,
            color,
            permissions,
            departmentId,
          },
        });

        revalidatePath(`/business/${businessId}/roles`);
      } catch (error) {
        if (error instanceof Error) {
          throw error.message;
        }
      }
    }
  );
