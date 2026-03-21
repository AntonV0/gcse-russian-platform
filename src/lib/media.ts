import { createClient } from "@/lib/supabase/server";

export async function getPublicAudioUrl(path: string | null) {
  if (!path) return null;

  const supabase = await createClient();

  const { data } = supabase.storage
    .from("audio")
    .getPublicUrl(path);

  return data.publicUrl;
}