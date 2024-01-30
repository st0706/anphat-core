import micromatch from "micromatch";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add routes that don't require authentication
const unAuthenticatedRoutes = [
  "/",
  "/api/health",
  "/api/auth/**",
  "/auth/**",
  "/invitations/*",
  "/api/invitations/*",
  "/terms-condition"
];

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const url = new URL(req.url);
  const origin = url.origin;
  // const pathname = url.pathname;
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-url", req.url);
  requestHeaders.set("x-origin", origin);
  requestHeaders.set("x-pathname", pathname);

  // Bypass routes that don't require authentication
  if (micromatch.isMatch(pathname, unAuthenticatedRoutes)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req
  });

  // No token, redirect to signin page
  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl ", encodeURI(req.url));

    return NextResponse.redirect(url);
  }

  // All good, let the request through
  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|logo.png|api/uploadthing).*)"]
};
