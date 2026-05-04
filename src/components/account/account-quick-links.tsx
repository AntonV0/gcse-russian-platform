import Link from "next/link";
import DashboardCard from "@/components/ui/dashboard-card";

const accountLinks = [
  {
    title: "Profile",
    href: "/profile",
    label: "Open profile",
    description:
      "Update your display name, full name, and preset avatar from your profile area.",
  },
  {
    title: "Settings",
    href: "/settings",
    label: "Open settings",
    description:
      "Manage your password, appearance, and future account preferences from one place.",
  },
  {
    title: "Billing",
    href: "/account/billing",
    label: "Open billing",
    description:
      "Review Foundation and Higher access, upgrade options, and subscription actions.",
  },
  {
    title: "Dashboard",
    href: "/dashboard",
    label: "Open dashboard",
    description:
      "Go back to your main student hub for progress, quick links, and next steps.",
  },
];

export function AccountQuickLinks() {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {accountLinks.map((item) => (
        <DashboardCard key={item.href} title={item.title}>
          <div className="space-y-3">
            <p>{item.description}</p>

            <Link
              href={item.href}
              className="inline-flex items-center gap-2 font-medium app-brand-text"
            >
              {item.label}
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </DashboardCard>
      ))}
    </section>
  );
}
