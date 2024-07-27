import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";
import { href } from "./lib/href";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrl: Routes = {
  "/": true,
  [href.login]: true,
  [href.sms]: true,
  [href.signup]: true,
  [href.github.start]: true,
  [href.github.complete]: true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const pathname = request.nextUrl.pathname;
  const isPublicOnlyUrl = publicOnlyUrl[pathname];

  if (!session.id) {
    if (!isPublicOnlyUrl) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    if (isPublicOnlyUrl) {
      return NextResponse.redirect(new URL(href.home, request.url));
    }
  }
}

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|favicon.ico).*)"],
};
