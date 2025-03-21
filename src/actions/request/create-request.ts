'use server';

import { db } from '@/db';
import { protectedAction } from '@/lib/protected-actions';
import { createRequestValidator } from '@/zod-validators/request';
import { validateDateRange } from './validate-date-range';

export const createRequest = protectedAction
  .createServerAction()
  .input(createRequestValidator)
  .handler(async ({ input: fields }) => {
    try {
      const baseData = {
        type: fields.type,
        comments: fields.comments,
        createdBy: fields.createdBy,
        businessId: fields.businessId,
      };

      let specificRequestData = {};

      switch (fields.type) {
        case 'SWAP': {
          specificRequestData = {
            swapRequest: {
              originalShiftId: fields.originalShiftId,
              requestedShiftId: fields.requestedShiftId,
              swapWithUserId: fields.swapWithUserId,
            },
          };
          break;
        }
        case 'UNAVAILABLE': {
          validateDateRange({
            startDate: fields.startDate,
            endDate: fields.endDate,
          });

          specificRequestData = {
            unavailableRequest: {
              startDatetime: fields.startDate,
              endDatetime: fields.endDate,
              comment: fields.comment,
            },
          };
          break;
        }

        case 'VACATION':
          validateDateRange({
            startDate: fields.startDate,
            endDate: fields.endDate,
          });

          specificRequestData = {
            vacationRequest: {
              startDate: fields.startDate,
              endDate: fields.endDate,
              vacationType: fields.vacationType,
              totalDays: fields.totalDays,
            },
          };
          break;

        default:
          throw new Error('Invalid request type');
      }

      await db.request.create({
        data: {
          ...baseData,
          ...specificRequestData,
        },
      });
    } catch (error) {
      if (error instanceof Error) {
        throw error.message;
      }
    }
  });
