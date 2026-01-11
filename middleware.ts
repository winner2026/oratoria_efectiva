import { withAuth } from "next-auth/middleware"

export default withAuth;

export const config = { 
  matcher: [
    /*
     * Match all request paths except for:
     * 1. / (landing page)
     * 2. /auth/login (login page)
     * 3. /api/auth/* (next-auth endpoints)
     * 4. /_next/* (internal next.js files)
     * 5. /public/* (static assets)
     * 6. Favicon, icons, etc.
     */
    "/((?!api/auth|_next|favicon.ico|public|auth/login|$|waitlist|offer).*)",
  ],
}
