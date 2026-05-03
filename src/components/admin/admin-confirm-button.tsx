"use client";

import Button from "@/components/ui/button";
import DevComponentMarker from "@/components/ui/dev-component-marker";
import type { AppIconKey } from "@/lib/shared/icons";
import type { ButtonSize } from "@/components/ui/button-styles";

type AdminConfirmButtonProps = {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
  variant?: "danger" | "warning" | "secondary";
  icon?: AppIconKey;
  size?: ButtonSize;
};

const SHOW_UI_DEBUG = process.env.NODE_ENV !== "production";

export default function AdminConfirmButton({
  children,
  confirmMessage,
  className,
  variant = "danger",
  icon = "warning",
  size = "md",
}: AdminConfirmButtonProps) {
  const wrapperClassName = [
    "dev-marker-host relative inline-flex max-w-full",
    className?.split(/\s+/).includes("w-full") ? "w-full" : null,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <span className={wrapperClassName}>
      {SHOW_UI_DEBUG ? (
        <DevComponentMarker
          componentName="AdminConfirmButton"
          filePath="src/components/admin/admin-confirm-button.tsx"
          tier="semantic"
          componentRole="Admin confirmation submit button"
          bestFor="Destructive or high-impact admin form submissions that need a browser confirm step."
          usageExamples={[
            "Archive course button",
            "Delete lesson block",
            "Deactivate user access",
            "Reset generated content",
          ]}
          notes="Use inside forms that submit after confirmation. Prefer clearer custom confirmation flows later for complex destructive actions."
        />
      ) : null}

      <Button
        type="submit"
        variant={variant}
        icon={icon}
        size={size}
        className={className}
        onClick={(event) => {
          const confirmed = window.confirm(confirmMessage);

          if (!confirmed) {
            event.preventDefault();
          }
        }}
      >
        {children}
      </Button>
    </span>
  );
}
