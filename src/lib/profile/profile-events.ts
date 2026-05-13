export const PROFILE_UPDATED_EVENT = "profile:updated";

export type ProfileUpdatedEventDetail = {
  fullName?: string;
  displayName?: string;
  avatarKey?: string;
  avatarBackgroundKey?: string;
  avatarFrameKey?: string;
};
