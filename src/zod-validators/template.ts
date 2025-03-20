import { z } from 'zod';

export const createTemplateValidator = z.object({
  name: z.optional(z.string()),
  startTime: z.date(),
  endTime: z.date(),
  note: z.optional(z.string()),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const updateTemplateValidator = z.object({
  templateId: z.string().cuid({ message: 'Invalid template id' }),
  name: z.optional(z.string()),
  startTime: z.optional(z.date()),
  endTime: z.optional(z.date()),
  note: z.optional(z.string()),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const deleteTemplateValidator = z.object({
  templateId: z.string().cuid({ message: 'Invalid template id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
