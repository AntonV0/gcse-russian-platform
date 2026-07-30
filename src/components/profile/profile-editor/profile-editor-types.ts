import type {
  AvatarBackgroundKey,
  AvatarFrameKey,
  ProfileAvatarOption,
} from "@/lib/profile/avatar-customization";

export type ProfileLearningSnapshot = {
  completedLessons: number;
  totalLessons: number;
};

export type ProfileEditorProps = {
  avatars: ProfileAvatarOption[];
  email: string | null | undefined;
  initialFullName: string | null | undefined;
  initialDisplayName: string | null | undefined;
  initialParentGuardianName: string | null | undefined;
  initialParentGuardianEmail: string | null | undefined;
  initialParentGuardianPhone: string | null | undefined;
  initialParentGuardianConsentConfirmed: boolean;
  initialAvatarKey: string | null | undefined;
  initialAvatarBackgroundKey: AvatarBackgroundKey;
  initialAvatarFrameKey: AvatarFrameKey;
  unlockedAvatarFrameKeys: AvatarFrameKey[];
  learningSnapshot: ProfileLearningSnapshot;
  profileUpdated?: boolean;
};

export type SavedProfileResponse = {
  savedProfile?: {
    fullName: string;
    displayName: string;
    parentGuardianName: string;
    parentGuardianEmail: string;
    parentGuardianPhone: string;
    parentGuardianConsentConfirmed: boolean;
    avatarKey: string;
    avatarBackgroundKey: string;
    avatarFrameKey: string;
  };
  message?: string;
};

export type ProfileSubmitIntent = "all" | "details" | "avatar";
