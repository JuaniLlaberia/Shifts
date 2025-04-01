import { z } from 'zod';

export const createLocationValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  name: z.string(),
  address: z.string(),
  latitude: z.number(),
  longitude: z.number(),

  isOnboarding: z.optional(z.boolean()),
});
