import { Locale } from '@prisma/client';
import { z } from 'zod';

export const updateUserValidator = z.object({
  fullName: z.optional(
    z.string().min(1, { message: 'Your name must have at least 1 charc.' })
  ),
  image: z.optional(z.string()),
  locale: z.optional(z.nativeEnum(Locale)),
});
