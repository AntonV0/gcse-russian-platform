"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getOptionalString, getTrimmedString } from "@/app/actions/shared/form-data";
import { requireAdminAccess } from "@/lib/auth/admin-auth";
import { createClient } from "@/lib/supabase/server";

function getOptionalNonNegativeNumber(formData: FormData, key: string) {
  const raw = getTrimmedString(formData, key);

  if (!raw) return null;

  const value = Number(raw);

  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${key} must be a non-negative number`);
  }

  return value;
}

function parseStringArrayJson(value: string, key: string) {
  try {
    const parsed = JSON.parse(value || "[]");

    if (!Array.isArray(parsed)) {
      throw new Error(`${key} must be an array`);
    }

    return parsed.map((item) => String(item));
  } catch (error) {
    console.error("Error parsing grammar table columns:", { key, value, error });
    throw new Error(`${key} must be valid JSON`);
  }
}

function parseStringMatrixJson(value: string, key: string) {
  try {
    const parsed = JSON.parse(value || "[]");

    if (!Array.isArray(parsed)) {
      throw new Error(`${key} must be an array`);
    }

    return parsed.map((row) => {
      if (!Array.isArray(row)) {
        throw new Error(`${key} rows must be arrays`);
      }

      return row.map((cell) => String(cell));
    });
  } catch (error) {
    console.error("Error parsing grammar table rows:", { key, value, error });
    throw new Error(`${key} must be valid JSON`);
  }
}

async function requireGrammarAdmin() {
  const canAccess = await requireAdminAccess();

  if (!canAccess) {
    throw new Error("Unauthorized");
  }
}

async function getNextTableOrder(grammarPointId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("grammar_tables")
    .select("sort_order")
    .eq("grammar_point_id", grammarPointId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error calculating grammar table order:", {
      grammarPointId,
      error,
    });
    throw new Error("Failed to calculate grammar table order");
  }

  return (data?.sort_order ?? -1) + 1;
}

function getPointEditPath(grammarSetId: string, grammarPointId: string) {
  return `/admin/grammar/${grammarSetId}/points/${grammarPointId}/edit`;
}

export async function createGrammarTableAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const title = getTrimmedString(formData, "title");
  const columns = parseStringArrayJson(
    getTrimmedString(formData, "columnsJson"),
    "columns"
  );
  const rows = parseStringMatrixJson(getTrimmedString(formData, "rowsJson"), "rows");
  const optionalNote = getOptionalString(formData, "optionalNote");
  const manualSortOrder = getOptionalNonNegativeNumber(formData, "sortOrder");

  if (!grammarSetId || !grammarPointId || !title) {
    throw new Error("Missing required fields");
  }

  if (columns.length === 0) {
    throw new Error("At least one table column is required");
  }

  const sortOrder = manualSortOrder ?? (await getNextTableOrder(grammarPointId));
  const supabase = await createClient();

  const { error } = await supabase.from("grammar_tables").insert({
    grammar_point_id: grammarPointId,
    title,
    columns,
    rows,
    optional_note: optionalNote,
    sort_order: sortOrder,
  });

  if (error) {
    console.error("Error creating grammar table:", { grammarPointId, error });
    throw new Error("Failed to create grammar table");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}

export async function updateGrammarTableAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarTableId = getTrimmedString(formData, "grammarTableId");
  const title = getTrimmedString(formData, "title");
  const columns = parseStringArrayJson(
    getTrimmedString(formData, "columnsJson"),
    "columns"
  );
  const rows = parseStringMatrixJson(getTrimmedString(formData, "rowsJson"), "rows");
  const optionalNote = getOptionalString(formData, "optionalNote");
  const sortOrder = getOptionalNonNegativeNumber(formData, "sortOrder") ?? 0;

  if (!grammarSetId || !grammarPointId || !grammarTableId || !title) {
    throw new Error("Missing required fields");
  }

  if (columns.length === 0) {
    throw new Error("At least one table column is required");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_tables")
    .update({
      title,
      columns,
      rows,
      optional_note: optionalNote,
      sort_order: sortOrder,
    })
    .eq("id", grammarTableId)
    .eq("grammar_point_id", grammarPointId);

  if (error) {
    console.error("Error updating grammar table:", {
      grammarTableId,
      grammarPointId,
      error,
    });
    throw new Error("Failed to update grammar table");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}

export async function deleteGrammarTableAction(formData: FormData) {
  await requireGrammarAdmin();

  const grammarSetId = getTrimmedString(formData, "grammarSetId");
  const grammarPointId = getTrimmedString(formData, "grammarPointId");
  const grammarTableId = getTrimmedString(formData, "grammarTableId");

  if (!grammarSetId || !grammarPointId || !grammarTableId) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  const { error } = await supabase
    .from("grammar_tables")
    .delete()
    .eq("id", grammarTableId)
    .eq("grammar_point_id", grammarPointId);

  if (error) {
    console.error("Error deleting grammar table:", {
      grammarTableId,
      grammarPointId,
      error,
    });
    throw new Error("Failed to delete grammar table");
  }

  const path = getPointEditPath(grammarSetId, grammarPointId);
  revalidatePath(path);
  revalidatePath("/grammar");
  redirect(path);
}
