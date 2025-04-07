'server only';

import { auth } from '@/auth';
import { db } from '@/db';

export const getAuthUserInformation = async () => {
  const session = await auth();
  if (!session || !session.user?.email) return null;

  try {
    const user = await db.user.findUnique({
      where: { email: session.user?.email },
    });

    return user;
  } catch {
    throw new Error('Failed to get user');
  }
};
