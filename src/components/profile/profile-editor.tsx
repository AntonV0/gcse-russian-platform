"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
  DEFAULT_AVATAR_BACKGROUND_KEY,
  DEFAULT_AVATAR_FRAME_KEY,
  avatarFrameOptions,
  getSafeAvatarBackgroundKey,
  getSafeAvatarFrameKey,
  type AvatarBackgroundKey,
  type AvatarFrameKey,
} from "@/lib/profile/avatar-customization";
import {
  PROFILE_UPDATED_EVENT,
  type ProfileUpdatedEventDetail,
} from "@/lib/profile/profile-events";
import ProfileAvatarSection from "./profile-editor/profile-avatar-section";
import ProfileDetailsSection from "./profile-editor/profile-details-section";
import {
  ProfileActionErrorInline,
  ProfileUpdatedInline,
} from "./profile-editor/profile-feedback";
import type {
  ProfileEditorProps,
  ProfileLearningSnapshot,
} from "./profile-editor/profile-editor-types";
import {
  AVATARS_PER_PAGE,
  PROFILE_RECONCILE_TIMEOUT_MS,
  PROFILE_SAVE_TIMEOUT_MS,
  PROFILE_UNSAVED_CHANGES_MESSAGE,
  fetchProfileJson,
  getAvatar,
  getAvatarPageForKey,
  getProfileInitials,
} from "./profile-editor/profile-editor-utils";
import ProfilePreviewCard from "./profile-editor/profile-preview-card";
import ProfileSubmitButton from "./profile-editor/profile-submit-button";

export type { ProfileLearningSnapshot };

export default function ProfileEditor({
  avatars,
  email,
  initialFullName,
  initialDisplayName,
  initialParentGuardianName,
  initialParentGuardianEmail,
  initialParentGuardianConsentConfirmed,
  initialAvatarKey,
  initialAvatarBackgroundKey,
  initialAvatarFrameKey,
  unlockedAvatarFrameKeys,
  learningSnapshot,
  profileUpdated = false,
}: ProfileEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedFullName, setSavedFullName] = useState(initialFullName ?? "");
  const [savedDisplayName, setSavedDisplayName] = useState(initialDisplayName ?? "");
  const [savedParentGuardianName, setSavedParentGuardianName] = useState(
    initialParentGuardianName ?? ""
  );
  const [savedParentGuardianEmail, setSavedParentGuardianEmail] = useState(
    initialParentGuardianEmail ?? ""
  );
  const [savedParentGuardianConsentConfirmed, setSavedParentGuardianConsentConfirmed] =
    useState(initialParentGuardianConsentConfirmed);
  const [savedAvatarKey, setSavedAvatarKey] = useState(initialAvatarKey ?? "");
  const [savedAvatarBackgroundKey, setSavedAvatarBackgroundKey] =
    useState<AvatarBackgroundKey>(
      initialAvatarBackgroundKey ?? DEFAULT_AVATAR_BACKGROUND_KEY
    );
  const [savedAvatarFrameKey, setSavedAvatarFrameKey] = useState<AvatarFrameKey>(
    initialAvatarFrameKey ?? DEFAULT_AVATAR_FRAME_KEY
  );
  const [fullName, setFullName] = useState(initialFullName ?? "");
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [parentGuardianName, setParentGuardianName] = useState(
    initialParentGuardianName ?? ""
  );
  const [parentGuardianEmail, setParentGuardianEmail] = useState(
    initialParentGuardianEmail ?? ""
  );
  const [parentGuardianConsentConfirmed, setParentGuardianConsentConfirmed] = useState(
    initialParentGuardianConsentConfirmed
  );
  const [avatarKey, setAvatarKey] = useState(initialAvatarKey ?? "");
  const [avatarBackgroundKey, setAvatarBackgroundKey] = useState<AvatarBackgroundKey>(
    initialAvatarBackgroundKey ?? DEFAULT_AVATAR_BACKGROUND_KEY
  );
  const [avatarFrameKey, setAvatarFrameKey] = useState<AvatarFrameKey>(
    initialAvatarFrameKey ?? DEFAULT_AVATAR_FRAME_KEY
  );
  const [showProfileUpdated, setShowProfileUpdated] = useState(profileUpdated);
  const [avatarPage, setAvatarPage] = useState(() => {
    return getAvatarPageForKey(avatars, initialAvatarKey ?? "");
  });

  const selectedAvatar = useMemo(
    () => getAvatar(avatars, avatarKey),
    [avatarKey, avatars]
  );
  const avatarPageCount = Math.max(1, Math.ceil(avatars.length / AVATARS_PER_PAGE));
  const activeAvatarPage = Math.min(avatarPage, avatarPageCount - 1);
  const visibleAvatars = avatars.slice(
    activeAvatarPage * AVATARS_PER_PAGE,
    activeAvatarPage * AVATARS_PER_PAGE + AVATARS_PER_PAGE
  );
  const previewName = displayName.trim() || fullName.trim() || "Student";
  const initials = getProfileInitials(fullName || displayName, email);
  const unlockedFrameKeys = useMemo(
    () => new Set<AvatarFrameKey>([...unlockedAvatarFrameKeys, savedAvatarFrameKey]),
    [savedAvatarFrameKey, unlockedAvatarFrameKeys]
  );
  const earnedFrames = avatarFrameOptions.filter(
    (frame) => frame.key !== DEFAULT_AVATAR_FRAME_KEY && unlockedFrameKeys.has(frame.key)
  );
  const hasDetailsChanges =
    fullName !== savedFullName ||
    displayName !== savedDisplayName ||
    parentGuardianName !== savedParentGuardianName ||
    parentGuardianEmail !== savedParentGuardianEmail ||
    parentGuardianConsentConfirmed !== savedParentGuardianConsentConfirmed;
  const hasAvatarChanges =
    avatarKey !== savedAvatarKey ||
    avatarBackgroundKey !== savedAvatarBackgroundKey ||
    avatarFrameKey !== savedAvatarFrameKey;
  const hasAnyChanges = hasDetailsChanges || hasAvatarChanges;
  const shouldShowProfileUpdated = showProfileUpdated && !hasAnyChanges;

  const resetDetailsChanges = () => {
    setFullName(savedFullName);
    setDisplayName(savedDisplayName);
    setParentGuardianName(savedParentGuardianName);
    setParentGuardianEmail(savedParentGuardianEmail);
    setParentGuardianConsentConfirmed(savedParentGuardianConsentConfirmed);
  };
  const resetAvatarChanges = () => {
    setAvatarKey(savedAvatarKey);
    setAvatarBackgroundKey(savedAvatarBackgroundKey);
    setAvatarFrameKey(savedAvatarFrameKey);
    setAvatarPage(getAvatarPageForKey(avatars, savedAvatarKey));
  };

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSaving || !hasAnyChanges) {
      return;
    }

    const formData = new FormData(event.currentTarget);
    setIsSaving(true);
    setSaveError(null);

    try {
      let result: Awaited<ReturnType<typeof fetchProfileJson>>;

      try {
        result = await fetchProfileJson(
          "/api/profile",
          {
            method: "POST",
            body: formData,
          },
          PROFILE_SAVE_TIMEOUT_MS
        );
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          throw error;
        }

        await new Promise((resolve) => window.setTimeout(resolve, 800));
        result = await fetchProfileJson(
          `/api/profile?reconcile=${Date.now()}`,
          {
            method: "GET",
          },
          PROFILE_RECONCILE_TIMEOUT_MS
        );
      }

      const { response, payload } = result;

      if (!response.ok || !payload.savedProfile) {
        throw new Error(payload.message || "Profile update failed.");
      }

      const savedProfile = payload.savedProfile;
      const nextAvatarBackgroundKey = getSafeAvatarBackgroundKey(
        savedProfile.avatarBackgroundKey
      );
      const nextAvatarFrameKey = getSafeAvatarFrameKey(savedProfile.avatarFrameKey);
      const profileEventDetail = {
        ...savedProfile,
        avatarBackgroundKey: nextAvatarBackgroundKey,
        avatarFrameKey: nextAvatarFrameKey,
      } satisfies ProfileUpdatedEventDetail;

      setFullName(savedProfile.fullName);
      setDisplayName(savedProfile.displayName);
      setParentGuardianName(savedProfile.parentGuardianName);
      setParentGuardianEmail(savedProfile.parentGuardianEmail);
      setParentGuardianConsentConfirmed(savedProfile.parentGuardianConsentConfirmed);
      setAvatarKey(savedProfile.avatarKey);
      setAvatarBackgroundKey(nextAvatarBackgroundKey);
      setAvatarFrameKey(nextAvatarFrameKey);
      setSavedFullName(savedProfile.fullName);
      setSavedDisplayName(savedProfile.displayName);
      setSavedParentGuardianName(savedProfile.parentGuardianName);
      setSavedParentGuardianEmail(savedProfile.parentGuardianEmail);
      setSavedParentGuardianConsentConfirmed(
        savedProfile.parentGuardianConsentConfirmed
      );
      setSavedAvatarKey(savedProfile.avatarKey);
      setSavedAvatarBackgroundKey(nextAvatarBackgroundKey);
      setSavedAvatarFrameKey(nextAvatarFrameKey);
      setAvatarPage(getAvatarPageForKey(avatars, savedProfile.avatarKey));
      setShowProfileUpdated(true);
      window.dispatchEvent(
        new CustomEvent(PROFILE_UPDATED_EVENT, {
          detail: profileEventDetail,
        })
      );

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      url.searchParams.delete("error");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Profile update failed.");
      setShowProfileUpdated(false);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (!hasAnyChanges) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest<HTMLAnchorElement>("a[href]");

      if (!anchor || anchor.target || anchor.hasAttribute("download")) {
        return;
      }

      const href = anchor.getAttribute("href");

      if (!href || href.startsWith("#")) {
        return;
      }

      const nextUrl = new URL(href, window.location.href);
      const isSamePageHash =
        nextUrl.origin === window.location.origin &&
        nextUrl.pathname === window.location.pathname &&
        nextUrl.search === window.location.search &&
        nextUrl.hash.length > 0;

      if (isSamePageHash) {
        return;
      }

      if (!window.confirm(PROFILE_UNSAVED_CHANGES_MESSAGE)) {
        event.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("click", handleDocumentClick, true);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [hasAnyChanges]);

  useEffect(() => {
    if (!shouldShowProfileUpdated) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowProfileUpdated(false);

      const url = new URL(window.location.href);
      url.searchParams.delete("success");
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }, 5200);

    return () => window.clearTimeout(timeoutId);
  }, [shouldShowProfileUpdated]);

  return (
    <form onSubmit={handleProfileSubmit} className="space-y-6">
      <section>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px] xl:items-center">
          <div className="flex min-w-0 flex-col justify-center gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge tone="info" icon="user">
                Student profile
              </Badge>
              <Badge tone="muted" icon="palette">
                Name and avatar
              </Badge>
            </div>

            <div className="space-y-2">
              <h1 className="app-heading-hero">Build your student profile</h1>
              <p className="app-subtitle max-w-2xl">
                Choose a name and avatar that make GCSE Russian feel like yours.
              </p>
            </div>

            {shouldShowProfileUpdated ? <ProfileUpdatedInline /> : null}
            {saveError ? <ProfileActionErrorInline message={saveError} /> : null}

            <div className="app-feature-panel-actions">
              <Button href="#profile-details" variant="secondary" size="sm" icon="user">
                Edit details
              </Button>

              <Button href="#profile-avatar" variant="quiet" size="sm" icon="palette">
                Choose avatar
              </Button>
            </div>
          </div>

          <ProfilePreviewCard
            avatar={selectedAvatar}
            backgroundKey={avatarBackgroundKey}
            displayName={previewName}
            frameKey={avatarFrameKey}
            hasChanges={hasAnyChanges}
            initials={initials}
            pending={isSaving}
            earnedFrames={earnedFrames}
          />
        </div>
      </section>

      <ProfileDetailsSection
        email={email}
        fullName={fullName}
        displayName={displayName}
        parentGuardianName={parentGuardianName}
        parentGuardianEmail={parentGuardianEmail}
        parentGuardianConsentConfirmed={parentGuardianConsentConfirmed}
        hasDetailsChanges={hasDetailsChanges}
        isSaving={isSaving}
        onFullNameChange={setFullName}
        onDisplayNameChange={setDisplayName}
        onParentGuardianNameChange={setParentGuardianName}
        onParentGuardianEmailChange={setParentGuardianEmail}
        onParentGuardianConsentConfirmedChange={setParentGuardianConsentConfirmed}
        onReset={resetDetailsChanges}
      />

      <ProfileAvatarSection
        visibleAvatars={visibleAvatars}
        selectedAvatar={selectedAvatar}
        avatarKey={avatarKey}
        avatarBackgroundKey={avatarBackgroundKey}
        avatarFrameKey={avatarFrameKey}
        initials={initials}
        isSaving={isSaving}
        activeAvatarPage={activeAvatarPage}
        avatarPageCount={avatarPageCount}
        unlockedFrameKeys={unlockedFrameKeys}
        learningSnapshot={learningSnapshot}
        hasAvatarChanges={hasAvatarChanges}
        onAvatarKeyChange={setAvatarKey}
        onAvatarBackgroundKeyChange={setAvatarBackgroundKey}
        onAvatarFrameKeyChange={setAvatarFrameKey}
        onAvatarPageChange={setAvatarPage}
        onReset={resetAvatarChanges}
      />

      {hasAnyChanges ? (
        <div className="sticky bottom-3 z-20 flex justify-end xl:hidden">
          <div className="rounded-xl border border-[var(--accent-selected-border)] bg-[var(--background-elevated)]/92 p-2 shadow-[var(--shadow-md)] backdrop-blur">
            <ProfileSubmitButton
              intent="all"
              hasChanges={hasAnyChanges}
              idleLabel="Save changes"
              pending={isSaving}
            />
          </div>
        </div>
      ) : null}
    </form>
  );
}
