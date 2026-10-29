import { type NextRequest, NextResponse } from "next/server";

// -----pages only for logged out users
const authRoutes = ["/signin", "/signup"];

// -----pages that need login (their inner pages too)
const protectedRoutes = [
  "/blood-request",
  "/create-request",
  "/my-requests",
  "/donors",
  "/become-donor",
  "/dashboard",
];

// -----"/donors" matches /donors and /donors/123, not /donors-list
const isProtected = (pathname: string) =>
  protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

// -----only checks the cookie is there (backend still checks if it's valid)
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLoggedIn = request.cookies.has("accessToken");

  // ----logged in user can't open signin/signup, goes home instead
  if (isLoggedIn && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // ----page needs login, goes to signin instead
  if (!isLoggedIn && isProtected(pathname)) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}

// -----run only on these pages (not on api, images, css)
export const config = {
  matcher: [
    "/signin",
    "/signup",
    "/blood-request/:path*",
    "/create-request",
    "/my-requests",
    "/donors/:path*",
    "/become-donor",
    "/dashboard/:path*",
  ],
};
