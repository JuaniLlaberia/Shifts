'server only';

import { Prisma } from '@prisma/client';

import { db } from '@/db';
import { withEmployee } from '../auth-helper/employee-wrapper';

type DateRange = {
  startDate: Date;
  endDate: Date;
};

type GetShiftsParams = {
  businessId: string;
  dateRange?: DateRange;
  employeeIds?: string[];
  viewType?: 'day' | 'week' | '2weeks' | 'month';
} & { userId: string; employeeId: string; isAdmin: boolean };

const getShiftsBase = async ({
  businessId,
  isAdmin,
  dateRange,
  employeeIds,
  viewType = 'week',
}: GetShiftsParams) => {
  try {
    const startDate = dateRange?.startDate || new Date();
    let endDate = dateRange?.endDate;

    if (!endDate) {
      // Calculate end date based on view type if not provided
      endDate = new Date(startDate);

      switch (viewType) {
        case 'day':
          // End date is same as start date for day view
          break;
        case 'week':
          endDate.setDate(endDate.getDate() + 7);
          break;
        case '2weeks':
          endDate.setDate(endDate.getDate() + 14);
          break;
        case 'month':
          endDate.setMonth(endDate.getMonth() + 1);
          break;
      }
    }

    // Base query conditions
    const whereClause: Prisma.ShiftWhereInput = {
      businessId,
      startTime: {
        gte: startDate,
      },
      endTime: {
        lte: endDate,
      },
    };

    // Add employee filter if specified
    if (employeeIds && employeeIds.length > 0) {
      whereClause.assignedTo = {
        in: employeeIds,
      };
    }

    const shifts = await db.shift.findMany({
      where: whereClause,
      include: {
        employee: {
          select: {
            id: true,
            user: { select: { fullName: true, image: true } },
            role: { select: { name: true } },
          },
        },
      },
      orderBy: [{ startTime: 'asc' }],
    });

    // Group shifts by employee with metrics
    const shiftsByEmployee = shifts.reduce(
      (acc, shift) => {
        const employeeId = shift.assignedTo;

        if (!acc[employeeId]) {
          acc[employeeId] = {
            employee: shift.employee,
            shifts: [],
            shiftsCount: 0,
            totalHours: 0,
            totalScheduledHours: 0,
            totalWorkedHours: 0,
          };
        }

        acc[employeeId].shifts.push(shift);

        acc[employeeId].shiftsCount += 1;

        const scheduledDurationMs =
          shift.endTime.getTime() - shift.startTime.getTime();
        const scheduledHours = scheduledDurationMs / (1000 * 60 * 60);
        acc[employeeId].totalScheduledHours += scheduledHours;

        if (shift.clockIn && shift.clockOut) {
          const workedDurationMs =
            shift.clockOut.getTime() - shift.clockIn.getTime();
          const workedHours = workedDurationMs / (1000 * 60 * 60);
          acc[employeeId].totalWorkedHours += workedHours;
        }

        acc[employeeId].totalHours += scheduledHours;

        return acc;
      },
      {} as Record<
        string,
        {
          employee: (typeof shifts)[0]['employee'];
          shifts: typeof shifts;
          shiftsCount: number;
          totalHours: number;
          totalScheduledHours: number;
          totalWorkedHours: number;
        }
      >
    );

    return {
      shiftsByEmployee,
      dateRange: {
        startDate: startDate,
        endDate: endDate,
      },
      isAdmin,
    };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getShifts = withEmployee(getShiftsBase);
