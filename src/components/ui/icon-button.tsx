"use client";

import Button from "@/components/ui/button";
import type { ButtonSize, ButtonVariant } from "@/components/ui/button-styles";
import type { AppIconKey } from "@/lib/shared/icons";

type IconButtonBaseProps = {
  icon: AppIconKey;
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  title?: string;
};

type IconButtonAsButtonProps = IconButtonBaseProps &
  Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-label" | "children" | "className" | "title"
  > & {
    href?: never;
  };

type IconButtonAsLinkProps = IconButtonBaseProps & {
  href: string;
};

type IconButtonProps = IconButtonAsButtonProps | IconButtonAsLinkProps;

export default function IconButton(props: IconButtonProps) {
  const { icon, label, variant = "secondary", size = "sm", className } = props;

  if ("href" in props && props.href) {
    return (
      <Button
        href={props.href}
        variant={variant}
        size={size}
        icon={icon}
        iconOnly
        ariaLabel={label}
        className={className}
      />
    );
  }

  const buttonProps: Partial<IconButtonAsButtonProps> = {
    ...(props as IconButtonAsButtonProps),
  };

  delete buttonProps.icon;
  delete buttonProps.label;
  delete buttonProps.variant;
  delete buttonProps.size;
  delete buttonProps.className;

  return (
    <Button
      {...buttonProps}
      variant={variant}
      size={size}
      icon={icon}
      iconOnly
      ariaLabel={label}
      className={className}
    />
  );
}
