'use server';

import { db } from '@/db';
import { DEFAULT_ROLE_COLOR } from '@/lib/consts';
import { protectedAction } from '@/lib/protected-actions';
import { createDepartmentWithRoleValidator } from '@/zod-validators/department';

export const createDepartmentWithRole = protectedAction
  .createServerAction()
  .input(createDepartmentWithRoleValidator)
  .handler(async ({ input: { businessId, departmentName, roleName } }) => {
    try {
      await db.$transaction(async tx => {
        const { id: departmentId } = await tx.department.create({
          data: {
            name: departmentName,
            description: 'This is your first department.',
            businessId,
          },
        });

        await Promise.all([
          tx.role.create({
            data: {
              name: roleName,
              color: DEFAULT_ROLE_COLOR,
              permissions: 'MEMBER',
              businessId,
              departmentId,
            },
          }),
          tx.business.update({
            where: { id: businessId },
            data: {
              completedOnboardingSteps: { increment: 1 },
            },
          }),
        ]);
      });
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
