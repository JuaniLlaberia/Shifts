'server only';

import { auth } from '@/auth';
import { db } from '@/db';

export const getAuthUser = async () => {
  const session = await auth();
  if (!session || !session.user?.email) return null;

  try {
    const user = await db.user.findUnique({
      where: { email: session.user?.email },
      select: { id: true, locale: true },
    });

    if (!user) throw new Error('User not found');
    return user;
  } catch {
    throw new Error('Failed to get user');
  }
};
