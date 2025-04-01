import { getAuthUser } from '@/access-data/user/get-auth-user';
import { db } from '@/db';
import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { UploadThingError } from 'uploadthing/server';
import { z } from 'zod';

const f = createUploadthing();

type MetadataParams = {
  businessId: string;
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
        businessId: z.string(),
        isOnboarding: z.optional(z.boolean()),
      })
    )
    .middleware(async ({ input }): Promise<MetadataParams> => {
      const userId = await getAuthUser();
      if (!userId) throw new UploadThingError('Unauthorized');

      const { businessId, isOnboarding } = input;

      return { businessId, isOnboarding };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { businessId, isOnboarding } = metadata;

      try {
        await db.business.update({
          where: { id: businessId },
          data: {
            image: file.ufsUrl,
            completedOnboardingSteps: isOnboarding ? { increment: 1 } : {},
          },
        });
      } catch {
        throw new UploadThingError('Failed to update database');
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
