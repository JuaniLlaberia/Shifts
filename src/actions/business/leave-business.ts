'use server';

import { redirect } from 'next/navigation';

import { db } from '@/db';
import { memberAction } from '@/lib/member-actions';
import { leaveBusinessValidator } from '@/zod-validators/business';

export const leaveBusiness = memberAction
  .createServerAction()
  .input(leaveBusinessValidator)
  .handler(async ({ ctx: { employeeId } }) => {
    try {
      await db.employee.delete({ where: { id: employeeId } });

      redirect('/');
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
