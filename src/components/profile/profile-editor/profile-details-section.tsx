import Button from "@/components/ui/button";
import FormField from "@/components/ui/form-field";
import Input from "@/components/ui/input";
import ProfileSubmitButton from "./profile-submit-button";

export default function ProfileDetailsSection({
  email,
  fullName,
  displayName,
  parentGuardianName,
  parentGuardianEmail,
  parentGuardianConsentConfirmed,
  hasDetailsChanges,
  isSaving,
  onFullNameChange,
  onDisplayNameChange,
  onParentGuardianNameChange,
  onParentGuardianEmailChange,
  onParentGuardianConsentConfirmedChange,
  onReset,
}: {
  email: string | null | undefined;
  fullName: string;
  displayName: string;
  parentGuardianName: string;
  parentGuardianEmail: string;
  parentGuardianConsentConfirmed: boolean;
  hasDetailsChanges: boolean;
  isSaving: boolean;
  onFullNameChange: (value: string) => void;
  onDisplayNameChange: (value: string) => void;
  onParentGuardianNameChange: (value: string) => void;
  onParentGuardianEmailChange: (value: string) => void;
  onParentGuardianConsentConfirmedChange: (value: boolean) => void;
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
              Password and reset options are in{" "}
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

      <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--background-muted)] p-4">
        <div>
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Parent or guardian contact
          </h3>
          <p className="mt-1 text-sm app-text-muted">
            Optional details for students whose account setup, support, or payment
            decisions involve a parent or guardian.
          </p>
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <FormField
            label="Parent/guardian name"
            description="Used only for account support and safeguarding context."
          >
            <Input
              id="parentGuardianName"
              name="parentGuardianName"
              value={parentGuardianName}
              onChange={(event) => onParentGuardianNameChange(event.target.value)}
              placeholder="Enter parent or guardian name"
              disabled={isSaving}
            />
          </FormField>

          <FormField
            label="Parent/guardian email"
            description="Useful where an adult helps manage the account."
          >
            <Input
              id="parentGuardianEmail"
              name="parentGuardianEmail"
              type="email"
              value={parentGuardianEmail}
              onChange={(event) => onParentGuardianEmailChange(event.target.value)}
              placeholder="parent@example.com"
              disabled={isSaving}
            />
          </FormField>
        </div>

        <label className="mt-4 flex items-start gap-3 rounded-lg border border-[var(--border-subtle)] bg-[var(--surface-elevated)] p-3 text-sm leading-6 text-[var(--text-secondary)]">
          <input
            name="parentGuardianConsentConfirmed"
            type="checkbox"
            checked={parentGuardianConsentConfirmed}
            disabled={isSaving}
            onChange={(event) =>
              onParentGuardianConsentConfirmedChange(event.target.checked)
            }
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--accent-fill)]"
          />
          <span>
            A parent or guardian is aware of this account setup where that is
            appropriate for the student.
          </span>
        </label>
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
