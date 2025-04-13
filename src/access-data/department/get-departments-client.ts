'use server';

import z from 'zod';
import { createServerAction } from 'zsa';

import { db } from '@/db';

export const getDepartmentsClient = createServerAction()
  .input(
    z.object({
      businessId: z.string(),
    })
  )
  .handler(async ({ input: { businessId } }) => {
    const departments = await db.department.findMany({
      where: { businessId },
      select: { id: true, name: true },
    });

    return departments;
  });
