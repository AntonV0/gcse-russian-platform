"use server";

import { redirect } from "next/navigation";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { getBoolean, getTrimmedString } from "@/app/actions/shared/form-data";
import { getPastPaperPayload } from "@/app/actions/admin/past-papers/past-paper-payloads";
import { getPastPaperBulkImportPayloads } from "@/app/actions/admin/past-papers/past-paper-bulk-import-payloads";

export async function createPastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const payload = getPastPaperPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase.from("past_paper_resources").insert(payload);

  if (error) {
    console.error("Error creating past paper resource:", { payload, error });
    throw new Error(`Failed to create past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}

export async function bulkCreatePastPaperResourcesAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const rawImport = getTrimmedString(formData, "bulkImport");

  if (!rawImport) {
    throw new Error("Paste at least one row to import");
  }

  const payloads = getPastPaperBulkImportPayloads(rawImport);
  const supabase = await createClient();
  const skipDuplicateUrls = getBoolean(formData, "skipDuplicateUrls");
  let rowsToInsert = payloads;
  let skippedCount = 0;

  if (skipDuplicateUrls) {
    const officialUrls = payloads.map((payload) => payload.official_url);
    const { data: existingResources, error: existingError } = await supabase
      .from("past_paper_resources")
      .select("official_url")
      .in("official_url", officialUrls);

    if (existingError) {
      console.error("Error checking existing past paper URLs:", existingError);
      throw new Error(`Failed to check duplicate URLs: ${existingError.message}`);
    }

    const existingUrls = new Set(
      (existingResources ?? []).map((resource) => String(resource.official_url))
    );
    const seenUrls = new Set<string>();

    rowsToInsert = payloads.filter((payload) => {
      if (existingUrls.has(payload.official_url) || seenUrls.has(payload.official_url)) {
        skippedCount += 1;
        return false;
      }

      seenUrls.add(payload.official_url);
      return true;
    });
  }

  if (rowsToInsert.length === 0) {
    redirect(`/admin/past-papers?imported=0&skipped=${skippedCount}`);
  }

  const { error } = await supabase.from("past_paper_resources").insert(rowsToInsert);

  if (error) {
    console.error("Error bulk importing past paper resources:", {
      count: rowsToInsert.length,
      error,
    });
    throw new Error(`Failed to bulk import past paper resources: ${error.message}`);
  }

  redirect(`/admin/past-papers?imported=${rowsToInsert.length}&skipped=${skippedCount}`);
}

export async function updatePastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const resourceId = getTrimmedString(formData, "resourceId");

  if (!resourceId) {
    throw new Error("Missing resource id");
  }

  const payload = getPastPaperPayload(formData);
  const supabase = await createClient();

  const { error } = await supabase
    .from("past_paper_resources")
    .update(payload)
    .eq("id", resourceId);

  if (error) {
    console.error("Error updating past paper resource:", {
      resourceId,
      payload,
      error,
    });
    throw new Error(`Failed to update past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}

export async function deletePastPaperResourceAction(formData: FormData) {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }

  const resourceId = getTrimmedString(formData, "resourceId");

  if (!resourceId) {
    throw new Error("Missing resource id");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("past_paper_resources")
    .delete()
    .eq("id", resourceId);

  if (error) {
    console.error("Error deleting past paper resource:", { resourceId, error });
    throw new Error(`Failed to delete past paper resource: ${error.message}`);
  }

  redirect("/admin/past-papers");
}
