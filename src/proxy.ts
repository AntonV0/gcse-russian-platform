import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { supabaseAnonKey, supabaseUrl } from "@/lib/supabase/env";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: this triggers session refresh if needed
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /*
     * Refresh Supabase auth only for authenticated application surfaces.
     * Public marketing/resource pages, API/webhook handlers, OG image routes,
     * metadata, and static assets should not pay the auth-refresh cost here.
     */
    "/admin/:path*",
    "/account/:path*",
    "/assignments/:path*",
    "/dashboard/:path*",
    "/mock-exams/:mockExamSlug/attempts/:path*",
    "/online-classes/:path*",
    "/profile/:path*",
    "/question-sets/:path*",
    "/settings/:path*",
    "/teacher/:path*",
  ],
};
