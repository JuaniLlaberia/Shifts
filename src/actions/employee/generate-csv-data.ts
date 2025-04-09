'use server';

import { z } from 'zod';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';

export const generateEmployeesCsvData = protectedAction
  .createServerAction()
  .input(
    z.object({
      businessId: z.string().cuid({ message: 'Invalid business Id' }),
    })
  )
  .handler(async ({ input: { businessId } }) => {
    try {
      const employees = await db.employee.findMany({
        where: { businessId, status: 'JOINED' },
        select: {
          createdAt: true,
          user: { select: { fullName: true, email: true } },
          role: { select: { name: true } },
        },
      });

      const employeesCSV = [
        'Name,Email,Position,CreatedAt',
        ...employees.map(
          ({ user, role, createdAt }) =>
            `${user.fullName},${user.email},${role.name},${createdAt}`
        ),
      ].join('\n');

      return employeesCSV;
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
