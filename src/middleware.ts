import { NextResponse } from 'next/server';

import { auth } from './auth';
import { db } from './db';

export default auth(async req => {
  const url = req.nextUrl.clone();

  // If user is not auth => Redirect to sign-in page
  if (!req.auth) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // If user is not a member => Redirect to sign-in page with error "User is not member of this business"
  const businessIdMatch = url.pathname.match(/\/business\/([^\/]+)/);
  if (businessIdMatch) {
    const businessId = businessIdMatch[1];
    const userId = 'cm8db762h0000utd40slt9tzt';

    const cacheKey = `biz_member_${userId}_${businessId}`;
    const cachedValue = req.cookies.get(cacheKey)?.value;

    if (cachedValue === 'true') return NextResponse.next();
    else if (cachedValue === 'false') {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    const isMember = await db.businessEmployee.findUnique({
      where: { businessId_userId: { businessId, userId } },
    });

    if (!isMember) {
      const response = NextResponse.redirect(url);

      response.cookies.set(cacheKey, 'false', {
        httpOnly: true,
        maxAge: 3600, // Cache for 1 hour
        path: '/',
      });
      return response;
    } else {
      const response = NextResponse.next();

      response.cookies.set(cacheKey, 'true', {
        httpOnly: true,
        maxAge: 3600, // Cache for 1 hour
        path: '/',
      });

      return response;
    }
  }

  return NextResponse.next();
});

export const config = { matcher: ['/business/:path*'] };
