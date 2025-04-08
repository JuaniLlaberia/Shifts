'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createEmployeesValidator } from '@/zod-validators/employee';

export const createEmployees = protectedAction
  .createServerAction()
  .input(createEmployeesValidator)
  .handler(async ({ input: { businessId, employees } }) => {
    try {
      await db.$transaction(async tx => {
        const existingUsers = await tx.user.findMany({
          where: {
            email: {
              in: employees.map(e => e.email),
            },
          },
          select: {
            id: true,
            email: true,
          },
        });

        const userEmailToId: Record<string, string> = {};
        for (const user of existingUsers) {
          userEmailToId[user.email] = user.id;
        }

        for (const employee of employees) {
          const { email, fullName, roleId } = employee;

          let userId = userEmailToId[email];

          if (!userId) {
            const user = await tx.user.create({
              data: {
                fullName,
                email,
              },
              select: { id: true },
            });
            userId = user.id;
            userEmailToId[email] = userId;
          }

          await tx.employee.create({
            data: {
              userId,
              businessId,
              roleId,
              status: 'PENDING',
            },
          });
        }
      });

      //Send email
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
