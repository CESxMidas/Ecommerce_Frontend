import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedMatchers = ["/account", "/checkout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedMatchers.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    return NextResponse.next();
  }

  const signInUrl = new URL("/auth/login", request.url);
  signInUrl.searchParams.set("callbackUrl", pathname);

  return NextResponse.redirect(signInUrl);
}

export const config = {
  matcher: ["/account/:path*", "/checkout"],
};
