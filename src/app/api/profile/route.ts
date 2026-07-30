import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getParentGuardianContactErrorMessage,
  validateParentGuardianContact,
} from "@/lib/account/settings-validation";
import {
  DEFAULT_AVATAR_FRAME_KEY,
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
  isProfileAvatarKey,
} from "@/lib/profile/avatar-customization";
import {
  getUnlockedAvatarFrameKeysForCurrentUser,
  persistCurrentAvatarFrameUnlocksForCurrentUser,
} from "@/lib/profile/avatar-unlocks";
import { createClient } from "@/lib/supabase/server";

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function GET() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { message: "Log in to view your profile." },
      { status: 401 }
    );
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select(
      "full_name, display_name, avatar_key, avatar_background_key, equipped_avatar_frame_key, parent_guardian_name, parent_guardian_email, parent_guardian_phone, parent_guardian_consent_confirmed"
    )
    .eq("id", user.id)
    .single();

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/account");

  return NextResponse.json({
    savedProfile: {
      fullName: profile.full_name ?? "",
      displayName: profile.display_name ?? "",
      parentGuardianName: profile.parent_guardian_name ?? "",
      parentGuardianEmail: profile.parent_guardian_email ?? "",
      parentGuardianPhone: profile.parent_guardian_phone ?? "",
      parentGuardianConsentConfirmed: Boolean(profile.parent_guardian_consent_confirmed),
      avatarKey: profile.avatar_key ?? "",
      avatarBackgroundKey: getSafeAvatarBackgroundKey(profile.avatar_background_key),
      avatarFrameKey: getSafeAvatarFrameKey(profile.equipped_avatar_frame_key),
    },
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return NextResponse.json(
      { message: "Log in to update your profile." },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const fullName = getString(formData, "fullName");
  const displayName = getString(formData, "displayName");
  const parentGuardianName = getString(formData, "parentGuardianName");
  const parentGuardianEmail = getString(formData, "parentGuardianEmail");
  const parentGuardianPhone = getString(formData, "parentGuardianPhone");
  const parentGuardianConsentConfirmed =
    formData.get("parentGuardianConsentConfirmed") === "on";
  const avatarKey = getString(formData, "avatarKey");

  if (!isProfileAvatarKey(avatarKey)) {
    return NextResponse.json(
      { message: "Choose a valid avatar before saving." },
      { status: 400 }
    );
  }

  const avatarBackgroundKey = getSafeAvatarBackgroundKey(
    getString(formData, "avatarBackgroundKey")
  );
  const submittedAvatarFrameKey = getSafeAvatarFrameKey(
    getString(formData, "avatarFrameKey")
  );
  let avatarFrameKey = DEFAULT_AVATAR_FRAME_KEY;

  await persistCurrentAvatarFrameUnlocksForCurrentUser();

  if (submittedAvatarFrameKey !== DEFAULT_AVATAR_FRAME_KEY) {
    const unlockedAvatarFrameKeys = await getUnlockedAvatarFrameKeysForCurrentUser();
    avatarFrameKey = unlockedAvatarFrameKeys.has(submittedAvatarFrameKey)
      ? submittedAvatarFrameKey
      : DEFAULT_AVATAR_FRAME_KEY;
  }

  const safeFullName = fullName.length > 100 ? fullName.slice(0, 100) : fullName;
  const safeDisplayName =
    displayName.length > 50 ? displayName.slice(0, 50) : displayName;
  const safeAvatarKey = avatarKey.length > 50 ? avatarKey.slice(0, 50) : avatarKey;
  const parentGuardianValidation = validateParentGuardianContact({
    parentGuardianName,
    parentGuardianEmail,
    parentGuardianPhone,
    parentGuardianConsentConfirmed,
  });

  if (!parentGuardianValidation.isValid) {
    return NextResponse.json(
      { message: getParentGuardianContactErrorMessage(parentGuardianValidation) },
      { status: 400 }
    );
  }

  const { data: currentProfile, error: currentProfileError } = await supabase
    .from("profiles")
    .select("parent_guardian_consent_confirmed, parent_guardian_consent_confirmed_at")
    .eq("id", user.id)
    .single();

  if (currentProfileError) {
    return NextResponse.json({ message: currentProfileError.message }, { status: 400 });
  }

  const nextParentGuardianConsentConfirmedAt =
    parentGuardianValidation.parentGuardianConsentConfirmed
      ? currentProfile.parent_guardian_consent_confirmed &&
        currentProfile.parent_guardian_consent_confirmed_at
        ? currentProfile.parent_guardian_consent_confirmed_at
        : new Date().toISOString()
      : null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: safeFullName || null,
      display_name: safeDisplayName || null,
      avatar_key: safeAvatarKey || null,
      avatar_background_key: avatarBackgroundKey,
      equipped_avatar_frame_key:
        avatarFrameKey === DEFAULT_AVATAR_FRAME_KEY ? null : avatarFrameKey,
      parent_guardian_name: parentGuardianValidation.parentGuardianName,
      parent_guardian_email: parentGuardianValidation.parentGuardianEmail,
      parent_guardian_phone: parentGuardianValidation.parentGuardianPhone,
      parent_guardian_consent_confirmed:
        parentGuardianValidation.parentGuardianConsentConfirmed,
      parent_guardian_consent_confirmed_at: nextParentGuardianConsentConfirmedAt,
      email: user.email ?? null,
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }

  return NextResponse.json({
    savedProfile: {
      fullName: safeFullName,
      displayName: safeDisplayName,
      parentGuardianName: parentGuardianValidation.parentGuardianName ?? "",
      parentGuardianEmail: parentGuardianValidation.parentGuardianEmail ?? "",
      parentGuardianPhone: parentGuardianValidation.parentGuardianPhone ?? "",
      parentGuardianConsentConfirmed:
        parentGuardianValidation.parentGuardianConsentConfirmed,
      avatarKey: safeAvatarKey,
      avatarBackgroundKey,
      avatarFrameKey,
    },
  });
}
