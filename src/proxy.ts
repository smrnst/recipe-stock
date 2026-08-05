import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const basicAuth = request.headers.get("authorization");

  if (basicAuth) {
    const encoded = basicAuth.split(" ")[1];
    const decoded = atob(encoded);
    const [user, pass] = decoded.split(":");

    if (user === process.env.BASIC_AUTH_USER && pass === process.env.BASIC_AUTH_PASSWORD) {
      return NextResponse.next();
    }
  }

  return new NextResponse("認証が必要です", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Recipe Stock"',
    },
  });
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};