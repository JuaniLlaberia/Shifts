'server only';

import { notFound } from 'next/navigation';

import { db } from '@/db';
import { withAdmin } from '../auth-helper/admin-wrapper';

type getBusinessConfigurationType = {
  businessId: string;
};

const getBusinessConfigurationBase = async ({
  businessId,
}: getBusinessConfigurationType) => {
  try {
    const business = await db.business.findUnique({
      where: { id: businessId },
      select: {
        id: true,
        name: true,
        configured: true,
        completedOnboardingSteps: true,
      },
    });
    if (!business) return notFound();

    return business;
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const getBusinessConfiguration = withAdmin(getBusinessConfigurationBase);
