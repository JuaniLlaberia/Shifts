'server only';

import { auth } from '@/auth';
import { db } from '@/db';

export const getAuthUser = async () => {
  const session = await auth();
  if (!session || !session.user?.email)
    throw new Error('User needs to be logged in');

  try {
    const user = await db.user.findUnique({
      where: { email: session.user?.email },
    });

    if (!user) throw new Error('User not found');
    return user;
  } catch {
    throw new Error('Failed to get user');
  }
};
