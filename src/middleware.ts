import { NextResponse } from 'next/server';

import { auth } from './auth';

const ADMIN_ONLY_ROUTES = [
  /\/business\/[^\/]+\/settings/,
  /\/business\/[^\/]+\/users/,
  /\/business\/[^\/]+\/billing/,
];

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

    const isAdminRoute = ADMIN_ONLY_ROUTES.some(pattern =>
      pattern.test(url.pathname)
    );

    const response = await fetch(`${req.nextUrl.origin}/api/autorization`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: req.auth.user.email,
        businessId,
        requestedPath: url.pathname,
        requiresAdmin: isAdminRoute,
      }),
    });
    // TODO: Check if there is a way of caching this to make it more efficient

    const result = await response.json();
    if (!result.authorized) {
      console.log('Error: ', result.error);

      url.pathname = result.redirectUrl;
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = { matcher: ['/business/:path*'] };
