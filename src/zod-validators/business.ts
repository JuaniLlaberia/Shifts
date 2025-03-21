import { Industry } from '@prisma/client';
import { z } from 'zod';

export const createBusinessValidator = z.object({
  name: z
    .string()
    .min(4, { message: 'Min. 4 charac. for the name' })
    .max(30, { message: 'Name must have less than 30 charc.' }),
  image: z.optional(z.string()),
  industry: z.nativeEnum(Industry),
  ownerRole: z
    .string()
    .min(4, { message: 'Min. 4 charac. for the role' })
    .max(30, { message: 'Role must have less than 30 charc.' }),
});

export const updateBusinessValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  name: z.optional(
    z
      .string()
      .min(4, { message: 'Min. 4 charac. for the name' })
      .max(30, { message: 'Name must have less than 30 charc.' })
  ),
  image: z.optional(z.string()),
  industry: z.optional(z.nativeEnum(Industry)),
});

export const deleteBusinessValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const joinBusinessValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const leaveBusinessValidator = z.object({
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
