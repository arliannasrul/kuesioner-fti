import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAuth = !!token;
    const isAuthPage = req.nextUrl.pathname.startsWith("/login");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin");

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return null;
    }

    if (!isAuth && (isAdminPage || isAdminApi)) {
      let from = req.nextUrl.pathname;
      if (req.nextUrl.search) {
        from += req.nextUrl.search;
      }
      return NextResponse.redirect(
        new URL(`/login?from=${encodeURIComponent(from)}`, req.url)
      );
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/login"],
};
