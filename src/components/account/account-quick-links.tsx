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
    title: "Courses",
    href: "/courses",
    label: "Open courses",
    description:
      "Return to your learning content, modules, and lessons whenever you are ready.",
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
