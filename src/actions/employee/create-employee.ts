'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createEmployeeValidator } from '@/zod-validators/employee';

export const createEmployee = protectedAction
  .createServerAction()
  .input(createEmployeeValidator)
  .handler(
    async ({ input: { businessId, roleId, firstName, lastName, email } }) => {
      try {
        await db.$transaction(async tx => {
          const { id: userId } = await tx.user.create({
            data: {
              fullName: firstName + lastName,
              email,
            },
          });

          // Check if user already exists

          await tx.employee.create({
            data: {
              userId,
              businessId,
              roleId,
            },
          });
        });

        //Send email
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
