'use server';

import { db } from '@/db';
import { authenticatedAction } from '@/lib/safe-actions';
import { joinBusinessValidator } from '@/zod-validators/business';

export const joinBusiness = authenticatedAction
  .createServerAction()
  .input(joinBusinessValidator)
  .handler(async ({ input: { businessId }, ctx: { userId } }) => {
    try {
      // Check if user is already employee of a business
      const employee = await db.employee.findFirst({
        where: { userId },
        select: { id: true, businessId: true },
      });

      if (Boolean(employee?.id)) {
        if (employee?.businessId === businessId)
          throw new Error('User is already an employee of this business');

        await db.$transaction(async tx => {
          await Promise.all([
            tx.employee.delete({ where: { id: employee?.id } }),
            tx.employee.update({
              where: { businessId_userId: { businessId, userId } },
              data: {
                status: 'JOINED',
              },
            }),
          ]);
        });
      } else {
        await db.employee.update({
          where: { businessId_userId: { businessId, userId } },
          data: {
            status: 'JOINED',
          },
        });
      }
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');

    }
  });
