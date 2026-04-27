"use server";

import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getTrimmedString } from "@/app/actions/shared/form-data";
import {
  getRedirectTo,
  redirectWithError,
  redirectWithSuccess,
} from "@/app/actions/admin/admin-user-action-shared";
import {
  addStudentToTeachingGroupAction as addStudentToTeachingGroup,
  addTeacherToTeachingGroupAction as addTeacherToTeachingGroup,
  removeStudentFromTeachingGroupAction as removeStudentFromTeachingGroup,
  removeTeacherFromTeachingGroupAction as removeTeacherFromTeachingGroup,
} from "@/app/actions/admin/admin-user-teaching-group-actions";

export async function addStudentToTeachingGroupAction(formData: FormData) {
  await addStudentToTeachingGroup(formData);
}

export async function removeStudentFromTeachingGroupAction(formData: FormData) {
  await removeStudentFromTeachingGroup(formData);
}

export async function addTeacherToTeachingGroupAction(formData: FormData) {
  await addTeacherToTeachingGroup(formData);
}

export async function removeTeacherFromTeachingGroupAction(formData: FormData) {
  await removeTeacherFromTeachingGroup(formData);
}

export async function setTeacherRoleAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const mode = getTrimmedString(formData, "mode");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !mode) {
    redirectWithError(redirectTo, "Missing required fields");
  }

  if (mode !== "enable" && mode !== "disable") {
    redirectWithError(redirectTo, "Invalid teacher role action");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("profiles")
    .update({
      is_teacher: mode === "enable",
    })
    .eq("id", userId);

  if (error) {
    console.error("Error updating teacher role:", { userId, mode, error });
    redirectWithError(
      redirectTo,
      `Failed to update teacher role: ${error.message ?? "unknown error"}`
    );
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/teachers");
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teachers/${userId}`);

  redirectWithSuccess(
    redirectTo,
    mode === "enable" ? "Teacher role enabled" : "Teacher role removed"
  );
}

export async function deactivateAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const grantId = getTrimmedString(formData, "grantId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !grantId) {
    redirectWithError(redirectTo, "Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deactivating access grant:", { userId, grantId, error });
    redirectWithError(
      redirectTo,
      `Failed to deactivate access grant: ${error.message ?? "unknown error"}`
    );
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirectWithSuccess(redirectTo, "Access grant deactivated");
}

export async function switchStudentAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const productId = getTrimmedString(formData, "productId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !productId) {
    redirectWithError(redirectTo, "Missing required fields");
  }

  const supabase = await createClient();

  const { data: product, error: productError } = await supabase
    .from("products")
    .select("id, code, name")
    .eq("id", productId)
    .maybeSingle();

  if (productError || !product) {
    console.error("Error loading product for access switch:", {
      userId,
      productId,
      error: productError,
    });
    redirectWithError(
      redirectTo,
      `Failed to load selected product: ${productError?.message ?? "unknown error"}`
    );
  }

  let accessMode = "full";
  const code = (product.code ?? "").toLowerCase();

  if (code.includes("trial")) {
    accessMode = "trial";
  } else if (code.includes("volna")) {
    accessMode = "volna";
  }

  const { error: deactivateError } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("user_id", userId)
    .eq("is_active", true);

  if (deactivateError) {
    console.error("Error deactivating existing active grants:", {
      userId,
      error: deactivateError,
    });
    redirectWithError(
      redirectTo,
      `Failed to deactivate current access: ${deactivateError.message ?? "unknown error"}`
    );
  }

  const { data: existingGrant, error: existingGrantError } = await supabase
    .from("user_access_grants")
    .select("id")
    .eq("user_id", userId)
    .eq("product_id", productId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingGrantError) {
    console.error("Error checking for existing matching grant:", {
      userId,
      productId,
      error: existingGrantError,
    });
    redirectWithError(
      redirectTo,
      `Failed to check existing access grant: ${
        existingGrantError.message ?? "unknown error"
      }`
    );
  }

  if (existingGrant) {
    const { error: reactivateError } = await supabase
      .from("user_access_grants")
      .update({
        access_mode: accessMode,
        source: "manual_admin",
        starts_at: new Date().toISOString(),
        ends_at: null,
        is_active: true,
      })
      .eq("id", existingGrant.id)
      .eq("user_id", userId);

    if (reactivateError) {
      console.error("Error reactivating existing access grant:", {
        userId,
        productId,
        grantId: existingGrant.id,
        error: reactivateError,
      });
      redirectWithError(
        redirectTo,
        `Failed to reactivate existing access grant: ${
          reactivateError.message ?? "unknown error"
        }`
      );
    }
  } else {
    const { error: insertError } = await supabase.from("user_access_grants").insert({
      user_id: userId,
      product_id: product.id,
      access_mode: accessMode,
      source: "manual_admin",
      starts_at: new Date().toISOString(),
      ends_at: null,
      is_active: true,
      granted_by: null,
    });

    if (insertError) {
      console.error("Error inserting new access grant:", {
        userId,
        productId,
        error: insertError,
      });

      redirectWithError(
        redirectTo,
        `Failed to create new access grant: ${insertError.message ?? "unknown error"}`
      );
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirectWithSuccess(redirectTo, "Student access updated");
}
