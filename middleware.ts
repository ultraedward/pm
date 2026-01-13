import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const { pathname } = req.nextUrl;

      // ✅ PUBLIC APIs (NO AUTH)
      if (
        pathname.startsWith("/api/alerts") ||
        pathname.startsWith("/api/charts") ||
        pathname.startsWith("/api/prices")
      ) {
        return true;
      }

      // Everything else requires auth
      return !!token;
    },
  },
});

export const config = {
  matcher: [
    /*
     * Apply middleware to everything EXCEPT:
     * - static files
     * - auth routes
     */
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
