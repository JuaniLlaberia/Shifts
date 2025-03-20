import { NextResponse } from 'next/server';
import { notFound } from 'next/navigation';

import { auth } from './auth';
import { db } from './db';

export default auth(async req => {
  const url = req.nextUrl.clone();

  // If user is not auth => Redirect to sign-in page
  if (!req.auth || !req.auth.user?.email) {
    url.pathname = '/sign-in';
    return NextResponse.redirect(url);
  }

  // If user is not a member => Redirect to sign-in page with error "User is not member of this business"
  const businessIdMatch = url.pathname.match(/\/business\/([^\/]+)/);
  if (businessIdMatch) {
    const businessId = businessIdMatch[1];

    const user = await db.user.findUnique({
      where: { email: req.auth.user?.email },
      select: { id: true },
    });
    if (!user) return notFound();

    const userId = user.id;

    const cacheKey = `biz_member_${userId}_${businessId}`;
    const cachedValue = req.cookies.get(cacheKey)?.value;

    if (cachedValue === 'true') return NextResponse.next();
    else if (cachedValue === 'false') {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    const isMember = await db.employee.findUnique({
      where: { businessId_userId: { businessId, userId } },
    });

    if (!isMember) {
      const response = NextResponse.redirect(url);

      response.cookies.set(cacheKey, 'false', {
        httpOnly: true,
        maxAge: 3600,
        path: '/',
      });
      return response;
    } else {
      const response = NextResponse.next();

      response.cookies.set(cacheKey, 'true', {
        httpOnly: true,
        maxAge: 3600,
        path: '/',
      });

      return response;
    }
  }

  return NextResponse.next();
});

export const config = { matcher: ['/business/:path*'] };
