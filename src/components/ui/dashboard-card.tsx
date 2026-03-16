type DashboardCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function DashboardCard({
  title,
  children,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <h2 className="mb-2 font-semibold">{title}</h2>
      <div className="text-sm text-gray-600">{children}</div>
    </div>
  );
}