"use client";

import { useFormStatus } from "react-dom";
import AppIcon from "@/components/ui/app-icon";
import type { AppIconKey } from "@/lib/shared/icons";

type AuthSubmitButtonProps = {
  idleLabel: string;
  pendingLabel: string;
  idleIcon: AppIconKey;
};

export default function AuthSubmitButton({
  idleLabel,
  pendingLabel,
  idleIcon,
}: AuthSubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="app-btn-base app-btn-primary min-h-11 w-full px-4 py-3 text-sm"
      disabled={pending}
      aria-busy={pending || undefined}
    >
      <span className="flex items-center justify-center gap-2">
        <AppIcon icon={pending ? "pending" : idleIcon} size={16} />
        {pending ? pendingLabel : idleLabel}
      </span>
    </button>
  );
}
