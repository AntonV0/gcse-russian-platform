import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import ProfileSubmitButton from "./profile-submit-button";

export default function ProfileDetailsSection({
  email,
  fullName,
  displayName,
  hasDetailsChanges,
  isSaving,
  onFullNameChange,
  onDisplayNameChange,
  onReset,
}: {
  email: string | null | undefined;
  fullName: string;
  displayName: string;
  hasDetailsChanges: boolean;
  isSaving: boolean;
  onFullNameChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onReset: () => void;
}) {
  return (
    <section
      id="profile-details"
      className="app-surface app-section-padding flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="app-heading-section">Your details</h2>
          <p className="mt-1 text-sm app-text-muted">Choose how your name appears.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <FormField
          label="Full name"
          description="For certificates, reports, and teacher feedback."
        >
          <Input
            id="fullName"
            name="fullName"
            value={fullName}
            onChange={(event) => onFullNameChange(event.target.value)}
            placeholder="Enter full name"
            disabled={isSaving}
          />
        </FormField>

        <FormField
          label="Display name"
          description="The shorter name you want to see in lessons."
        >
          <Input
            id="displayName"
            name="displayName"
            value={displayName}
            onChange={(event) => onDisplayNameChange(event.target.value)}
            placeholder="Enter display name"
            disabled={isSaving}
          />
        </FormField>

        <FormField
          label="Email"
          description={
            <>
              Sign-in email changes are found in{" "}
              <a
                href="/settings"
                className="font-bold text-[var(--accent-ink)] underline-offset-4 hover:underline"
              >
                Settings
              </a>
              .
            </>
          }
          className="lg:col-span-2"
        >
          <Input id="email" name="email" value={email ?? ""} disabled readOnly />
        </FormField>
      </div>

      <div
        className={[
          "mt-auto flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between",
          hasDetailsChanges
            ? "border-[var(--accent-selected-border)] bg-[var(--surface-muted-bg)] shadow-[0_8px_18px_color-mix(in_srgb,var(--accent-border-ink)_12%,transparent)]"
            : "border-[var(--border-subtle)] bg-[var(--background-muted)]",
        ].join(" ")}
      >
        <div>
          <div className="text-sm font-semibold text-[var(--text-primary)]">
            {hasDetailsChanges ? "Ready to update your details?" : "No detail changes"}
          </div>
          <p className="mt-1 text-sm app-text-muted">
            {hasDetailsChanges
              ? "Save after changing your full name or display name."
              : "Your details are saved."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 sm:justify-end">
          <ProfileSubmitButton
            intent="details"
            hasChanges={hasDetailsChanges}
            idleLabel="Save profile details"
            pending={isSaving}
          />

          {hasDetailsChanges ? (
            <Button
              type="button"
              variant="secondary"
              icon="cancel"
              iconOnly
              ariaLabel="Cancel profile detail changes"
              disabled={isSaving}
              onClick={onReset}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
