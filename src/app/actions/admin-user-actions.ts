"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdminAccess } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";

function getTrimmedString(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

export async function deactivateAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const grantId = getTrimmedString(formData, "grantId");

  if (!userId || !grantId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("user_access_grants")
    .update({ is_active: false })
    .eq("id", grantId)
    .eq("user_id", userId);

  if (error) {
    console.error("Error deactivating access grant:", { userId, grantId, error });
    throw new Error("Failed to deactivate access grant");
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirect(`/admin/students/${userId}`);
}

export async function switchStudentAccessGrantAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const productId = getTrimmedString(formData, "productId");

  if (!userId || !productId) {
    throw new Error("Missing required fields");
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
    throw new Error("Failed to load selected product");
  }

  let accessMode = "full";
  const code = (product.code ?? "").toLowerCase();

  if (code.includes("trial")) {
    accessMode = "trial";
  } else if (code.includes("volna")) {
    accessMode = "volna";
  }

  // Step 1: deactivate all currently active grants for this user
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
    throw new Error(
      `Failed to deactivate current access: ${deactivateError.message ?? "unknown error"}`
    );
  }

  // Step 2: if a matching grant already exists for this user/product, reactivate it
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
    throw new Error(
      `Failed to check existing access grant: ${existingGrantError.message ?? "unknown error"}`
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
      throw new Error(
        `Failed to reactivate existing access grant: ${reactivateError.message ?? "unknown error"}`
      );
    }
  } else {
    // Step 3: otherwise create a new grant
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

      throw new Error(
        `Failed to create new access grant: ${insertError.message ?? "unknown error"}`
      );
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath("/admin/students");
  redirect(`/admin/students/${userId}`);
}

export async function addStudentToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
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
    throw new Error("Failed to check existing student membership");
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
      throw new Error("Failed to add student to teaching group");
    }
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/students/${userId}`);
}

export async function removeStudentFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
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
    throw new Error("Failed to remove student from teaching group");
  }

  revalidatePath(`/admin/students/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/students/${userId}`);
}

export async function addTeacherToTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
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
    throw new Error("Failed to check existing teacher membership");
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
      throw new Error("Failed to add teacher to teaching group");
    }
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/teachers/${userId}`);
}

export async function removeTeacherFromTeachingGroupAction(formData: FormData) {
  const canAccess = await requireAdminAccess();
  if (!canAccess) throw new Error("Unauthorized");

  const userId = getTrimmedString(formData, "userId");
  const groupId = getTrimmedString(formData, "groupId");

  if (!userId || !groupId) {
    throw new Error("Missing required fields");
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
    throw new Error("Failed to remove teacher from teaching group");
  }

  revalidatePath(`/admin/teachers/${userId}`);
  revalidatePath(`/admin/teaching-groups/${groupId}`);
  redirect(`/admin/teachers/${userId}`);
}
