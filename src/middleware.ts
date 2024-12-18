import { NextRequest, NextResponse } from "next/server";

const knownWebsites = [
  "/astheravendreams",
  "/astheravendreams/submit",
  "/storiesaftermidnight",
  "/storiesaftermidnight/submit",
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (knownWebsites.includes(path)) {
    return NextResponse.redirect(new URL(`/w${path}`, request.url));
  }
}

export const config = {
  matcher: "/:path*",
};
