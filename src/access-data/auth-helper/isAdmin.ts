'server only';

import { withEmployee } from '../auth-helper/employee-wrapper';

type isAdminType = {} & {
  userId: string;
  employeeId: string;
  isAdmin: boolean;
};

const isAdminBase = async ({ isAdmin }: isAdminType) => {
  try {
    return { isAdmin };
  } catch (error) {
    if (error instanceof Error) throw error.message;
    throw new Error('Unknown error occurred');
  }
};

export const isAdmin = withEmployee(isAdminBase);
