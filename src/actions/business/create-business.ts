'use server';

import { db } from '@/db';
import { DEFAULT_ROLE_COLOR } from '@/lib/consts';
import { authenticatedAction } from '@/lib/safe-actions';
import { createBusinessValidator } from '@/zod-validators/business';

export const createBusiness = authenticatedAction
  .createServerAction()
  .input(createBusinessValidator)
  .handler(
    async ({
      input: { name, image, industry, ownerRole },
      ctx: { userId },
    }) => {
      try {
        await db.$transaction(async tx => {
          // #1 Create business and get ID
          const { id: businessId } = await tx.business.create({
            data: {
              name,
              industry,
              image,
            },
          });

          // #2 Create default department
          const { id: departmentId } = await tx.department.create({
            data: {
              name: 'Management',
              description:
                'This is the default department created for the owners.',
              businessId,
            },
          });

          // #3 Create default owner role
          const { id: roleId } = await tx.role.create({
            data: {
              name: ownerRole,
              color: DEFAULT_ROLE_COLOR,
              permissions: 'ADMIN',
              businessId,
              departmentId,
            },
          });

          // #4 Create employee
          await tx.employee.create({
            data: {
              userId,
              businessId,
              roleId,
            },
          });
        });
      } catch (error) {
        if (error instanceof Error) {
          console.log(`Transaction failed: ${error.message}`);
          throw error.message;
        }
      }
    }
  );
