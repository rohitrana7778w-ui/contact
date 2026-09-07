import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Admin routes protection
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=AdminAccessRequired", req.url));
    }

    // Provider dashboard routes protection
    if (pathname.startsWith("/dashboard/provider") && token?.role !== "PROVIDER" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login?error=ProviderAccessRequired", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Require auth for admin, dashboard, saved
        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/dashboard") ||
          pathname.startsWith("/saved")
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/saved/:path*"],
};
