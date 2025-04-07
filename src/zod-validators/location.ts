import { z } from 'zod';

export const createLocationValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  isOnboarding: z.optional(z.boolean()),
});

export const updateLocationValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  name: z.optional(z.string()),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  locationId: z.string().cuid({ message: 'Invalid location id' }),
});

export const deleteLocationValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  locationId: z.string().cuid({ message: 'Invalid location id' }),
});
