"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";
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
};

export default function LoadingButton({
  idleLabel,
  pendingLabel,
  variant = "primary",
  size = "md",
  className,
  idleIcon,
  pendingIcon = "pending",
  iconPosition = "left",
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
      icon={pending ? pendingIcon : idleIcon}
      iconPosition={iconPosition}
      disabled={isDisabled}
      aria-busy={pending || undefined}
    >
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}
