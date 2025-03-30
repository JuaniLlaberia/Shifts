import { NextResponse } from 'next/server';

import { db } from '@/db';

export async function POST(request: Request) {
  const body = await request.json();
  const { email, businessId, requiresAdmin } = body;

  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, completedOnboarding: true },
  });
  // Check that user exists
  if (!user) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: '/sign-in',
      error: 'user_not_found',
    });
  }
  // Check that "auth" onboarding has been completed
  if (!user.completedOnboarding) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: '/sign-in/onboarding',
      error: 'auth_onboarding_incomplete',
    });
  }

  const employee = await db.employee.findUnique({
    where: { businessId_userId: { businessId, userId: user.id } },
    select: {
      id: true,
      role: {
        select: { permissions: true },
      },
      completedOnboarding: true,
      business: { select: { configured: true } },
    },
  });
  // Check if user is employee
  if (!employee) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: '/access-denied',
      error: 'not_an_employee',
    });
  }

  const configured = employee.business.configured;
  const isEmployeeAdmin = employee.role.permissions === 'ADMIN';
  // Check if user is admin and needs to complete configuration
  if (isEmployeeAdmin && !configured) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: `/business/${businessId}/configure`,
      error: 'business_needs_setup',
    });
  }

  //Check if user is not admin and route is "admin only" not allow
  if (!isEmployeeAdmin && requiresAdmin) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: `/business/${businessId}/my-shifts`,
      error: 'route_protected_for_admins',
    });
  }

  // Check if employee has completed custom business onboarding
  if (!employee.completedOnboarding) {
    return NextResponse.json({
      authorized: false,
      redirectUrl: `/business/${businessId}/employee-onboarding`,
      error: 'employee_onboarding_incomplete',
    });
  }

  //Authorize user
  return NextResponse.json({
    authorized: true,
  });
}
