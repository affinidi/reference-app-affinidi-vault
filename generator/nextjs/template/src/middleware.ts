import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// NextAuth's OAuth callback handler discards the IdP's `error`/`error_description`
// (it only logs them) and redirects to a generic error. Intercept the Auth0
// callback first: when it carries an error, forward the real Auth0 message to
// our sign-in page so we can show it verbatim. Successful callbacks (no `error`)
// pass straight through to NextAuth.
export function middleware(req: NextRequest) {
  const error = req.nextUrl.searchParams.get("error");
  if (!error) return NextResponse.next();

  const errorDescription = req.nextUrl.searchParams.get("error_description");
  const url = new URL("/auth/signin", req.url);
  url.searchParams.set("error", error);
  if (errorDescription) url.searchParams.set("message", errorDescription);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/api/auth/callback/auth0"],
};
