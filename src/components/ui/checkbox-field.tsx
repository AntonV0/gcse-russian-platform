import { DevOnlyComponentMarker } from "@/components/ui/dev-component-marker";

type CheckboxFieldProps = {
  name: string;
  label: string;
  value?: string;
  description?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function CheckboxField({
  name,
  label,
  value = "true",
  description,
  defaultChecked,
  disabled = false,
  className,
}: CheckboxFieldProps) {
  return (
    <div className={["dev-marker-host relative", className].filter(Boolean).join(" ")}>
      <DevOnlyComponentMarker
        componentName="CheckboxField"
        filePath="src/components/ui/checkbox-field.tsx"
        tier="semantic"
        componentRole="Semantic checkbox field"
        bestFor="Boolean form settings with a readable label and optional explanation."
        usageExamples={[
          "Published / visible toggles",
          "Locked lesson setting",
          "Admin feature flags",
          "Assignment option checkboxes",
        ]}
        notes="Use CheckboxField for standalone boolean settings. Do not wrap it in FormField unless there is a very specific grouped-form reason."
      />

      <label
        className={["app-checkbox-field", disabled ? "app-checkbox-field-disabled" : ""]
          .filter(Boolean)
          .join(" ")}
      >
        <input
          type="checkbox"
          name={name}
          value={value}
          defaultChecked={defaultChecked}
          disabled={disabled}
          className="app-focus-ring app-checkbox-input"
        />

        <span className="app-checkbox-copy">
          <span className="app-checkbox-label">{label}</span>
          {description ? (
            <span className="app-checkbox-description">{description}</span>
          ) : null}
        </span>
      </label>
    </div>
  );
}
