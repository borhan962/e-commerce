import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  });

  const { pathname } = req.nextUrl;
  const isAuthPage =
    pathname.toLowerCase() === "/login" || pathname.toLowerCase() === "/register";

  // If user already has a token and tries to access /Login or /Register, redirect to Home ("/")
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/Login", "/login", "/Register", "/register"],
};

