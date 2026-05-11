"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";
import type {
  ButtonInteraction,
  ButtonSize,
  ButtonVariant,
} from "@/components/ui/button-styles";
import type { AppIconKey } from "@/lib/shared/icons";

type LoadingButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "children" | "className"
> & {
  idleLabel: string;
  pendingLabel: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  idleIcon?: AppIconKey;
  pendingIcon?: AppIconKey;
  iconPosition?: "left" | "right";
  interaction?: ButtonInteraction;
  iconOnly?: boolean;
  ariaLabel?: string;
};

export default function LoadingButton({
  idleLabel,
  pendingLabel,
  variant = "primary",
  size = "md",
  className,
  idleIcon,
  pendingIcon = "sync",
  iconPosition = "left",
  interaction,
  iconOnly = false,
  ariaLabel,
  disabled,
  type = "submit",
  ...buttonProps
}: LoadingButtonProps) {
  const { pending } = useFormStatus();
  const isDisabled = disabled || pending;

  return (
    <Button
      {...buttonProps}
      type={type}
      variant={variant}
      size={size}
      className={className}
      icon={idleIcon}
      iconPosition={iconPosition}
      iconOnly={iconOnly}
      ariaLabel={ariaLabel}
      interaction={interaction}
      disabled={isDisabled}
      loading={pending}
      loadingLabel={pendingLabel}
      loadingIcon={pendingIcon}
    >
      {idleLabel}
    </Button>
  );
}
