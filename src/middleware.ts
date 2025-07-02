import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isSignInPage = createRouteMatcher(["/auth"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  const isAuthenticated = await convexAuth.isAuthenticated();

  // Redirect authenticated users from /auth to /test
  if (isSignInPage(request) && isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/");
  }

  // Redirect unauthenticated users to /auth for all routes except /auth
  if (!isSignInPage(request) && !isAuthenticated) {
    return nextjsMiddlewareRedirect(request, "/auth");
  }

  // Allow the request to proceed if none of the above conditions apply
  return;
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};