"use client";

import DevComponentMarker from "@/components/ui/dev-component-marker";

type CheckboxFieldProps = {
  name: string;
  label: string;
  value?: string;
  description?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  className?: string;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

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
    <div className={["dev-marker-host", className].filter(Boolean).join(" ")}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="CheckboxField"
          filePath="src/components/ui/checkbox-field.tsx"
        />
      ) : null}

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
