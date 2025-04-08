'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { deleteLocationValidator } from '@/zod-validators/location';

export const deleteLocaiton = protectedAction
  .createServerAction()
  .input(deleteLocationValidator)
  .handler(async ({ input: { businessId, locationId } }) => {
    try {
      const businessLocations = await db.location.findMany({
        where: { businessId },
        select: { id: true },
      });
      if (businessLocations.length === 1)
        throw new Error('You cannot delete your only location');

      await db.location.delete({
        where: { id: locationId },
      });

      revalidatePath(`/business/${businessId}/settings/locations`);
    } catch (error) {
      if (error instanceof Error) throw error.message;
      throw new Error('Unknown error occurred');
    }
  });
