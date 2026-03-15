import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from './lib/auth'; // Ensure this uses a server-compatible getter for sessions

export default async function middleware(req: NextRequest) {
  // BetterAuth provides a middleware matcher or session fetcher, 
  // for now we skeleton the protection. The actual fetch must use fetch API or better-auth helpers.
  // In a real app we'd verify the cookie/session here. 
  
  if (req.nextUrl.pathname.startsWith('/dashboard')) {
     // Admin only
  }

  if (req.nextUrl.pathname.startsWith('/portal')) {
     // Client portal only
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/portal/:path*'],
};
