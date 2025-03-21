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
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
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

// Accept request
export const baseApproveRequestValidator = z.object({
  requestId: z.string().cuid({ message: 'Invalid request id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  type: z.nativeEnum(RequestType),
  comments: z.optional(z.string()),
  extraData: z.object({}),
});

const unavailableApprovedValidator = baseApproveRequestValidator.extend({
  type: z.literal(RequestType.UNAVAILABLE),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
  }),
});

const shiftSwapApprovedValidator = baseApproveRequestValidator.extend({
  type: z.literal(RequestType.SWAP),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    originalShiftId: z.string().cuid({ message: 'Invalid original shift id' }),
    requestedShiftId: z
      .string()
      .cuid({ message: 'Invalid requested shift id' }),
  }),
});

const vacationApprovedValidator = baseApproveRequestValidator.extend({
  type: z.literal(RequestType.VACATION),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
  }),
});

// Combine schemas with discriminated union
export const acceptRequestValidator = z.discriminatedUnion('type', [
  unavailableApprovedValidator,
  shiftSwapApprovedValidator,
  vacationApprovedValidator,
]);

// Reject request
const baseRejectRequestValidator = z.object({
  requestId: z.string().cuid({ message: 'Invalid request id' }),
  businessId: z.string().cuid({ message: 'Invalid business id' }),
  type: z.nativeEnum(RequestType),
  extraData: z.object({}),
});

const unavailableRejectedValidator = baseRejectRequestValidator.extend({
  type: z.literal(RequestType.UNAVAILABLE),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    date: z.string().or(z.date()),
  }),
});

const shiftSwapRejectedValidator = baseRejectRequestValidator.extend({
  type: z.literal(RequestType.SWAP),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    shiftDate: z.string().or(z.date()),
  }),
});

const vacationRejectedValidator = baseRejectRequestValidator.extend({
  type: z.literal(RequestType.VACATION),
  extraData: z.object({
    createdBy: z.string().cuid({ message: 'Invalid employee id' }),
    startDate: z.string().or(z.date()),
    endDate: z.string().or(z.date()),
  }),
});

export const rejectRequestValidator = z.discriminatedUnion('type', [
  unavailableRejectedValidator,
  shiftSwapRejectedValidator,
  vacationRejectedValidator,
]);
