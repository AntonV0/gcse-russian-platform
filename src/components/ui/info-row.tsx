type InfoRowProps = {
  label: string;
  value: React.ReactNode;
  className?: string;
};

export default function InfoRow({ label, value, className }: InfoRowProps) {
  return (
    <div className={className}>
      <span className="font-medium">{label}:</span> {value}
    </div>
  );
}
