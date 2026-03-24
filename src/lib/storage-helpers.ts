import { createClient } from "@/lib/supabase/server";

export async function getSignedStorageUrl(
  bucket: string,
  path: string | null,
  expiresIn = 60 * 10
): Promise<string | null> {
  if (!path) return null;

  const supabase = await createClient();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error("Error creating signed storage URL:", error);
    return null;
  }

  return data.signedUrl;
}
