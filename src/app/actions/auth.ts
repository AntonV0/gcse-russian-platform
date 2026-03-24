"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signUp(formData: FormData): Promise<void> {
  const fullName = String(formData.get("fullName") || "");
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  if (!data.user) {
    redirect(`/signup?error=${encodeURIComponent("User account could not be created.")}`);
  }

  const { error: profileError } = await supabase.from("profiles").upsert({
    id: data.user.id,
    full_name: fullName,
    role: "student",
  });

  if (profileError) {
    redirect(`/signup?error=${encodeURIComponent(profileError.message)}`);
  }

  const { error: accessError } = await supabase.from("user_course_access").upsert(
    {
      user_id: data.user.id,
      course_slug: "gcse-russian",
      course_variant: "foundation",
      access_mode: "trial",
    },
    {
      onConflict: "user_id,course_slug,course_variant",
    }
  );

  if (accessError) {
    redirect(`/signup?error=${encodeURIComponent(accessError.message)}`);
  }

  redirect("/dashboard");
}

export async function signIn(formData: FormData): Promise<void> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
