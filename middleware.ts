import { NextResponse, type NextRequest } from "next/server"

const SESSION_COOKIE = "storeos_session"

// Paths that don't require authentication
const PUBLIC_PATHS = ["/login", "/signup"]
const PUBLIC_API_PREFIXES = ["/api/auth", "/api/shopify/callback", "/api/shopify/auth"]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasCookie = Boolean(request.cookies.get(SESSION_COOKIE)?.value)

  const isPublicPage = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))
  const isPublicApi = PUBLIC_API_PREFIXES.some((p) => pathname.startsWith(p))

  // Logged-in users shouldn't see login/signup
  if (hasCookie && isPublicPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Unauthenticated users hitting a protected path → login
  if (!hasCookie && !isPublicPage && !isPublicApi) {
    const url = new URL("/login", request.url)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on everything except Next internals and static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
}
