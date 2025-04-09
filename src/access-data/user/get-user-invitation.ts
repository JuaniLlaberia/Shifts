'server only';

import { db } from '@/db';
import { withAuth } from '../auth-helper/auth-wrapper';

type getUserInvitationsType = {} & { userId: string };

const getUserInvitationsBase = async ({ userId }: getUserInvitationsType) => {
  try {
    const invitations = await db.employee.findMany({
      where: { userId, status: 'PENDING' },
      select: {
        id: true,
        businessId: true,
        role: { select: { name: true, color: true } },
        business: { select: { name: true, image: true } },
      },
    });

    return invitations;
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getUserInvitations = withAuth(getUserInvitationsBase);
