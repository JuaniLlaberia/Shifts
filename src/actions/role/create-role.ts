'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createRoleValidator } from '@/zod-validators/role';
import { revalidatePath } from 'next/cache';

export const createRole = protectedAction
  .createServerAction()
  .input(createRoleValidator)
  .handler(
    async ({
      input: { businessId, name, color, permissions, departmentId },
    }) => {
      try {
        await db.role.create({
          data: {
            name,
            color,
            permissions,
            businessId,
            departmentId,
          },
        });

        revalidatePath(`/business/${businessId}/roles`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
