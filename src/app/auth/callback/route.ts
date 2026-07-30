import { NextResponse, type NextRequest } from "next/server";
import { getAuthRedirectPath } from "@/lib/auth/redirect-paths";
import { createClient } from "@/lib/supabase/server";

function getConfirmationErrorRedirect(requestUrl: URL, next: string) {
  const loginUrl = new URL("/login", requestUrl.origin);
  loginUrl.searchParams.set(
    "error",
    "That confirmation link is invalid or has expired. Request a new link or log in if the account is already confirmed."
  );
  loginUrl.searchParams.set("next", next);
  return NextResponse.redirect(loginUrl);
}

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = getAuthRedirectPath(requestUrl.searchParams.get("next"));

  if (!code) {
    return getConfirmationErrorRedirect(requestUrl, next);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return getConfirmationErrorRedirect(requestUrl, next);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}
