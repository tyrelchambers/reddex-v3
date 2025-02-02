import { NextRequest, NextResponse } from "next/server";

// old format was localhost:3000/domainName
// also redirecting new format which is /w/domainName
const knownWebsites = ["/w/astheravendreams", "/w/astheravendreams/submit"];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  if (knownWebsites.includes(path)) {
    const strippedPath = path.replace("/w/", "/");

    const url = request.nextUrl.clone();
    const host = strippedPath.split("/")[1];
    const newPath = strippedPath.split("/")[2];

    url.host = `${host}.reddex.app`;
    url.pathname = newPath ?? "/";
    url.port = "";

    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/w/:path*"],
};
