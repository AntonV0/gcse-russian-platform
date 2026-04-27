import { redirect } from "next/navigation";
import { getTrimmedString } from "@/app/actions/shared/form-data";

export function buildRedirectUrl(
  basePath: string,
  params: Record<string, string | null | undefined>
) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const query = searchParams.toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function getRedirectTo(formData: FormData, fallback: string) {
  const redirectTo = getTrimmedString(formData, "redirectTo");
  return redirectTo || fallback;
}

export function redirectWithError(redirectTo: string, error: string): never {
  redirect(buildRedirectUrl(redirectTo, { error }));
}

export function redirectWithSuccess(redirectTo: string, success: string): never {
  redirect(buildRedirectUrl(redirectTo, { success }));
}
