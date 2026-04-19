type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={["text-sm", className].filter(Boolean).join(" ")}>
      <span className="font-medium text-[var(--text-primary)]">{label}:</span>{" "}
      <span className="app-text-muted">{value}</span>
    </div>
  );
}
