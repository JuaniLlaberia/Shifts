import { z } from 'zod';
import { RequestType, VacationType } from '@prisma/client';

// Base validator
const baseRequestSchema = z.object({
  type: z.nativeEnum(RequestType),
  comments: z.string().optional(),
  createdBy: z.string().cuid({ message: 'Invalid employee id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

const swapRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.SWAP),
  originalShiftId: z.string().cuid({ message: 'Invalid original shift id' }),
  requestedShiftId: z.string().cuid({ message: 'Invalid requested shift id' }),
  swapWithUserId: z.optional(z.string().cuid({ message: 'Invalid user id' })),
});

const unavailableRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.UNAVAILABLE),
  startDatetime: z.coerce.date(),
  endDatetime: z.coerce.date(),
  comment: z.optional(z.string()),
});

const vacationRequestSchema = baseRequestSchema.extend({
  type: z.literal(RequestType.VACATION),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  vacationType: z.nativeEnum(VacationType),
  totalDays: z.number().positive(),
});

export const createRequestValidator = z.discriminatedUnion('type', [
  swapRequestSchema,
  unavailableRequestSchema,
  vacationRequestSchema,
]);

export const deleteRequestValidator = z.object({
  requestId: z.string().cuid({ message: 'Invalid request id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const acceptRequestValidator = z.object({
  requestId: z.string().cuid({ message: 'Invalid request id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});

export const rejectRequestValidator = z.object({
  requestId: z.string().cuid({ message: 'Invalid request id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
});
