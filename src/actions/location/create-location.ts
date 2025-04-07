'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createLocationValidator } from '@/zod-validators/location';
import { revalidatePath } from 'next/cache';

export const createLocation = protectedAction
  .createServerAction()
  .input(createLocationValidator)
  .handler(
    async ({
      input: { address, latitude, longitude, name, businessId, isOnboarding },
    }) => {
      try {
        await db.location.create({
          data: {
            name,
            address,
            latitude,
            longitude,
            businessId,
          },
        });

        if (isOnboarding) {
          await db.business.update({
            where: { id: businessId },
            data: {
              completedOnboardingSteps: { increment: 1 },
            },
          });
        } else {
          revalidatePath(`/business/${businessId}/settings/locations`);
        }
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Transaction failed: ${error.message}`);
          throw error.message;
        }
        throw new Error('Unknown error occurred');
      }
    }
  );
