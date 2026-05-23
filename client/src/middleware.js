import { NextResponse } from "next/server"

export function middleware(request) {
  const token = request.cookies.get("token")?.value

  const protectedRoutes = [
    "/dashboard",
    "/profile",
    "/projects",
    "/skills",
    "/ai-mentor",
    "/team-match",
    "/search",
  ]

  const isProtectedRoute = protectedRoutes.some(
    (route) =>
      request.nextUrl.pathname.startsWith(route)
  )

  // If no token → redirect to login
  if (!token && isProtectedRoute) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/projects/:path*",
    "/skills/:path*",
    "/ai-mentor/:path*",
    "/team-match/:path*",
    "/search/:path*",
  ],
}