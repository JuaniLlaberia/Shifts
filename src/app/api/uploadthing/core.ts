import { getAuthUser } from '@/access-data/user/get-auth-user';
import { db } from '@/db';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

const f = createUploadthing();

type MetadataParams = {
  businessId?: string;
  userId: string;
  isOnboarding?: boolean;
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    .input(
      z.object({
        businessId: z.optional(z.string()),
        isOnboarding: z.optional(z.boolean()),
      })
    )
    .middleware(async ({ input }): Promise<MetadataParams> => {
      const user = await getAuthUser();
      if (!user) throw new UploadThingError('Unauthorized');

      const { businessId, isOnboarding } = input;

      return { businessId, userId: user.id, isOnboarding };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { businessId, userId, isOnboarding } = metadata;

      try {
        if (businessId) {
          await db.business.update({
            where: { id: businessId },
            data: {
              image: file.ufsUrl,
              completedOnboardingSteps: isOnboarding ? { increment: 1 } : {},
            },
          });
        } else {
          await db.user.update({
            where: { id: userId },
            data: { image: file.ufsUrl },
          });
        }
      } catch {
        throw new UploadThingError('Failed to update database');
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
