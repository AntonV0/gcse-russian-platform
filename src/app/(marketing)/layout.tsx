import PageContainer from "@/components/layout/page-container";
import MarketingSiteFooter from "@/components/marketing/marketing-site-footer";
import MarketingSiteHeader from "@/components/marketing/marketing-site-header";
import { getCurrentUser } from "@/lib/auth/auth";

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col">
      <MarketingSiteHeader user={user ? { email: user.email } : null} />

      <main className="app-shell-main flex-1">
        <PageContainer>{children}</PageContainer>
      </main>

      <MarketingSiteFooter />
    </div>
  );
}
