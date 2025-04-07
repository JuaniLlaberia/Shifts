'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { updateLocationValidator } from '@/zod-validators/location';

export const updateLocation = protectedAction
  .createServerAction()
  .input(updateLocationValidator)
  .handler(
    async ({
      input: { locationId, businessId, name, address, latitude, longitude },
    }) => {
      try {
        await db.location.update({
          where: { id: locationId },
          data: {
            name,
            address,
            latitude,
            longitude,
          },
        });

        revalidatePath(`/business/${businessId}/settings/locations`);
      } catch (error) {
        if (error instanceof Error) throw error.message;
        throw new Error('Unknown error occurred');
      }
    }
  );
