"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPublicSiteUrl } from "@/lib/seo/site";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getSafeRedirectPath(value: string, fallback = "/dashboard") {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  if (value.includes("\\")) {
    return fallback;
  }

  return value;
}

export type AuthActionState = {
  message: string | null;
};

function authError(message: string): AuthActionState {
  return { message };
}

export async function signUp(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "fullName");

  if (!fullName) {
    return authError("Enter the student's full name.");
  }

  if (!email) {
    return authError("Enter the account email address.");
  }

  if (!password || password.length < 8) {
    return authError("Password must be at least 8 characters.");
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return authError(error.message);
  }

  const userId = data.user?.id;

  if (userId) {
    const safeFullName = fullName.length > 100 ? fullName.slice(0, 100) : fullName;
    const safeDisplayName =
      safeFullName.length > 50 ? safeFullName.slice(0, 50) : safeFullName;

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: userId,
        email,
        full_name: safeFullName || null,
        display_name: safeDisplayName || null,
      },
      {
        onConflict: "id",
      }
    );

    if (profileError) {
      return authError(profileError.message);
    }
  }

  redirect("/dashboard");
}

export async function signIn(
  _previousState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const next = getSafeRedirectPath(getString(formData, "next"));

  if (!email) {
    return authError("Enter the account email address.");
  }

  if (!password) {
    return authError("Enter the account password.");
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return authError(error.message);
  }

  redirect(next);
}

export async function requestPasswordReset(formData: FormData) {
  const email = getString(formData, "email");

  if (!email) {
    redirect("/forgot-password?error=Enter%20the%20account%20email%20address");
  }

  const supabase = await createClient();
  const redirectTo = getPublicSiteUrl("/auth/callback?next=/settings").toString();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });

  if (error) {
    redirect(`/forgot-password?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/forgot-password?success=reset-email-sent");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function updateStudentProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  const fullName = getString(formData, "fullName");
  const displayName = getString(formData, "displayName");
  const avatarKey = getString(formData, "avatarKey");

  const safeFullName = fullName.length > 100 ? fullName.slice(0, 100) : fullName;
  const safeDisplayName =
    displayName.length > 50 ? displayName.slice(0, 50) : displayName;
  const safeAvatarKey = avatarKey.length > 50 ? avatarKey.slice(0, 50) : avatarKey;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: safeFullName || null,
      display_name: safeDisplayName || null,
      avatar_key: safeAvatarKey || null,
      email: user.email ?? null,
    })
    .eq("id", user.id);

  if (error) {
    redirect(`/profile?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/profile");
  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/account");

  redirect("/profile?success=profile-updated");
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();

  const password = getString(formData, "password");
  const confirmPassword = getString(formData, "confirmPassword");

  if (!password || password.length < 8) {
    redirect("/settings?error=Password%20must%20be%20at%20least%208%20characters");
  }

  if (password !== confirmPassword) {
    redirect("/settings?error=Passwords%20do%20not%20match");
  }

  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    redirect(`/settings?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/settings");
  redirect("/settings?success=password-updated");
}
