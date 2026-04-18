import Link from "next/link";
import PageHeader from "@/components/layout/page-header";
import DashboardCard from "@/components/ui/dashboard-card";

export default function OnlineClassesPage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Online Classes"
        description="Learn more about live GCSE Russian tuition through Volna School."
      />

      <DashboardCard title="Live teacher support">
        <div className="space-y-3">
          <p>
            This area can introduce your live online GCSE Russian classes and guide
            students to the Volna School website to find out more or sign up.
          </p>

          <Link
            href="https://volnaschool.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 font-medium app-brand-text"
          >
            Visit Volna School
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </DashboardCard>
    </main>
  );
}
