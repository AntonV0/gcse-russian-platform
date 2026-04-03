"use client";

type AdminConfirmButtonProps = {
  children: React.ReactNode;
  confirmMessage: string;
  className?: string;
};

export default function AdminConfirmButton({
  children,
  confirmMessage,
  className,
}: AdminConfirmButtonProps) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        const confirmed = window.confirm(confirmMessage);

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
