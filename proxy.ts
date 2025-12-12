import { auth } from "@/auth"

export const proxy = auth((req) => {
  if (!req.auth && req.nextUrl.pathname.startsWith("/dashboard")) {
    const loginUrl = new URL("/login", req.nextUrl.origin)
    return Response.redirect(loginUrl)
  }

  if (req.auth && req.nextUrl.pathname === "/login") {
    const dashboardUrl = new URL("/dashboard", req.nextUrl.origin)
    return Response.redirect(dashboardUrl)
  }
})

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
}
