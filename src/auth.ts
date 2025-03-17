import Google from 'next-auth/providers/google';

import NextAuth from 'next-auth';
import { db } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user?.email) return false;

      try {
        let existingUser = await db.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          existingUser = await db.user.create({
            data: {
              email: user.email,
              fullName: user.name,
              image: user.image ?? undefined,
            },
          });
        }
      } catch {
        console.error('Failed to create user');
        return false;
      }

      return true;
    },
  },
});
