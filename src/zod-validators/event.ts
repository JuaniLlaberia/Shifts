import { z } from 'zod';

export const createEventValidator = z.object({
  name: z
    .string()
    .min(1, { message: 'Event must have a name' })
    .max(50, { message: 'Event name must have less than 50 charc.' }),
  description: z.optional(
    z
      .string()
      .max(250, { message: 'Event description must have less than 250 charc.' })
  ),
  date: z.coerce.date(),
  location: z.string(),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const updateEventValidator = z.object({
  eventId: z.string().cuid({ message: 'Invalid event id' }),
  name: z.optional(
    z
      .string()
      .min(1, { message: 'Event must have a name' })
      .max(50, { message: 'Event name must have less than 50 charc.' })
  ),
  description: z.optional(
    z
      .string()
      .max(250, { message: 'Event description must have less than 250 charc.' })
  ),
  date: z.coerce.date(),
  location: z.optional(z.string()),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const deleteEventValidator = z.object({
  eventId: z.string().cuid({ message: 'Invalid event id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  date: z.coerce.date(),
  name: z.string(),
});
