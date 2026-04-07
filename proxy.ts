// middleware.ts
// Clerk middleware that gracefully no-ops when Clerk env vars are missing,
// so the build keeps working until the user provisions the keys.

import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const clerkEnabled = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default clerkEnabled ? clerkMiddleware() : function noopMiddleware() {
  return NextResponse.next();
};

export const config = {
  matcher: [
    // Skip Next.js internals and all static files unless they show up in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest|xml)).*)',
    '/(api|trpc)(.*)',
  ],
};
