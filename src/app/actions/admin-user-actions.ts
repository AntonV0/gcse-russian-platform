"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function buildRedirectUrl(
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

function getRedirectTo(formData: FormData, fallback: string) {
  const redirectTo = getTrimmedString(formData, "redirectTo");
  return redirectTo || fallback;
}

export async function setTeacherRoleAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const mode = getTrimmedString(formData, "mode");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !mode) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  if (mode !== "enable" && mode !== "disable") {
    redirect(buildRedirectUrl(redirectTo, { error: "Invalid teacher role action" }));
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
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to update teacher role: ${error.message ?? "unknown error"}`,
      })
    );
  }

  revalidatePath("/admin/students");
  revalidatePath("/admin/teachers");
  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teachers/${userId}`);

  redirect(
    buildRedirectUrl(redirectTo, {
      success: mode === "enable" ? "Teacher role enabled" : "Teacher role removed",
    })
  );
}

export async function deactivateAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const grantId = getTrimmedString(formData, "grantId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !grantId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deactivating access grant:", { userId, grantId, error });
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to deactivate access grant: ${error.message ?? "unknown error"}`,
      })
    );
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirect(buildRedirectUrl(redirectTo, { success: "Access grant deactivated" }));
}

export async function switchStudentAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const productId = getTrimmedString(formData, "productId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !productId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
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
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to load selected product: ${productError?.message ?? "unknown error"}`,
      })
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
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to deactivate current access: ${deactivateError.message ?? "unknown error"}`,
      })
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
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to check existing access grant: ${existingGrantError.message ?? "unknown error"}`,
      })
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
      redirect(
        buildRedirectUrl(redirectTo, {
          error: `Failed to reactivate existing access grant: ${reactivateError.message ?? "unknown error"}`,
        })
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

      redirect(
        buildRedirectUrl(redirectTo, {
          error: `Failed to create new access grant: ${insertError.message ?? "unknown error"}`,
        })
      );
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirect(buildRedirectUrl(redirectTo, { success: "Student access updated" }));
}

export async function addStudentToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !groupId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  const supabase = await createClient();

  const { data: existingMembership, error: existingError } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "student")
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing student membership:", {
      userId,
      groupId,
      error: existingError,
    });
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to check existing student membership: ${existingError.message ?? "unknown error"}`,
      })
    );
  }

  if (!existingMembership) {
    const { error } = await supabase.from("teaching_group_members").insert({
      user_id: userId,
      group_id: groupId,
      member_role: "student",
    });

    if (error) {
      console.error("Error adding student to teaching group:", {
        userId,
        groupId,
        error,
      });
      redirect(
        buildRedirectUrl(redirectTo, {
          error: `Failed to add student to teaching group: ${error.message ?? "unknown error"}`,
        })
      );
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(buildRedirectUrl(redirectTo, { success: "Student added to teaching group" }));
}

export async function removeStudentFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, `/admin/students/${userId}`);

  if (!userId || !groupId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "student");

  if (error) {
    console.error("Error removing student from teaching group:", {
      userId,
      groupId,
      error,
    });
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to remove student from teaching group: ${error.message ?? "unknown error"}`,
      })
    );
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(
    buildRedirectUrl(redirectTo, { success: "Student removed from teaching group" })
  );
}

export async function addTeacherToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, `/admin/teachers/${userId}`);

  if (!userId || !groupId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  const supabase = await createClient();

  const { data: existingMembership, error: existingError } = await supabase
    .from("teaching_group_members")
    .select("user_id, group_id, member_role")
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "teacher")
    .maybeSingle();

  if (existingError) {
    console.error("Error checking existing teacher membership:", {
      userId,
      groupId,
      error: existingError,
    });
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to check existing teacher membership: ${existingError.message ?? "unknown error"}`,
      })
    );
  }

  if (!existingMembership) {
    const { error } = await supabase.from("teaching_group_members").insert({
      user_id: userId,
      group_id: groupId,
      member_role: "teacher",
    });

    if (error) {
      console.error("Error adding teacher to teaching group:", {
        userId,
        groupId,
        error,
      });
      redirect(
        buildRedirectUrl(redirectTo, {
          error: `Failed to add teacher to teaching group: ${error.message ?? "unknown error"}`,
        })
      );
    }
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(buildRedirectUrl(redirectTo, { success: "Teacher added to teaching group" }));
}

export async function removeTeacherFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");
  const redirectTo = getRedirectTo(formData, `/admin/teachers/${userId}`);

  if (!userId || !groupId) {
    redirect(buildRedirectUrl(redirectTo, { error: "Missing required fields" }));
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("teaching_group_members")
    .delete()
    .eq("user_id", userId)
    .eq("group_id", groupId)
    .eq("member_role", "teacher");

  if (error) {
    console.error("Error removing teacher from teaching group:", {
      userId,
      groupId,
      error,
    });
    redirect(
      buildRedirectUrl(redirectTo, {
        error: `Failed to remove teacher from teaching group: ${error.message ?? "unknown error"}`,
      })
    );
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(
    buildRedirectUrl(redirectTo, { success: "Teacher removed from teaching group" })
  );
}
