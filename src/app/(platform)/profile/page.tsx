import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth/auth";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  const profile = await getCurrentProfile();

  return (
    <main className="space-y-6">
      <PageHeader
        title="Profile"
        description="Your profile details and avatar choices will be managed here."
      />

      <section className="grid gap-4 md:grid-cols-2">
        <DashboardCard title="Full name">
          {profile?.full_name ?? "No name saved"}
        </DashboardCard>

        <DashboardCard title="Email">{user?.email ?? "Not logged in"}</DashboardCard>
      </section>

      <DashboardCard title="Preset avatars">
        Preset avatar selection will be added here in the next profile milestone.
      </DashboardCard>
    </main>
  );
}
