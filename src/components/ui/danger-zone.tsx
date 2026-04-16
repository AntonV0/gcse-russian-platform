type Props = {
  title?: string;
  children: React.ReactNode;
};

export default function DangerZone({ title = "Danger zone", children }: Props) {
  return (
    <section className="rounded-2xl border border-red-200 bg-white shadow-sm">
      <div className="border-b border-red-200 px-5 py-4 font-semibold text-red-700">
        {title}
      </div>

      <div className="space-y-3 p-5 text-sm">{children}</div>
    </section>
  );
}
