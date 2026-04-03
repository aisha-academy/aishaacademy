import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

const locales = ["fr", "en"];
const defaultLocale = "fr";

function getLocale(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameHasLocale) return null;
  return defaultLocale;
}

async function getSupabaseUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {},
      },
    },
  );
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // ── Admin Routes ──────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    const user = await getSupabaseUser(request);

    // Already logged in → redirect away from login page to dashboard
    if (pathname === "/admin/login" && user) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    // Not logged in → redirect to login (except login page itself)
    if (pathname !== "/admin/login" && !user) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // All good → refresh Supabase session & continue
    return await updateSession(request);
  }

  // ── Locale Routing ────────────────────────────────────────────
  const locale = getLocale(request);
  if (locale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url),
    );
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
