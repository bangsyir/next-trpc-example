import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  // get pathname (e.g. /, /protected)
  const path = req.nextUrl.pathname;

  // if it's the root path, just render it
  if (path === "/") {
    return NextResponse.next();
  }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!session && path.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (session && (path === "/login" || path === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|about).*)"],
};
