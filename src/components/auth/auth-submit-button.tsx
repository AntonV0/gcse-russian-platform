"use client";

import { useFormStatus } from "react-dom";
import Button from "@/components/ui/button";
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
    <Button
      type="submit"
      variant="primary"
      className="w-full py-3"
      icon={idleIcon}
      disabled={pending}
      loading={pending}
      loadingLabel={pendingLabel}
    >
      {idleLabel}
    </Button>
  );
}
