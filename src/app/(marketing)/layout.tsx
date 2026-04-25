import PageContainer from "@/components/layout/page-container";
import MarketingSiteFooter from "@/components/marketing/marketing-site-footer";
import MarketingSiteHeader from "@/components/marketing/marketing-site-header";
import JsonLd from "@/components/seo/json-ld";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
} from "@/lib/seo/structured-data";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={[buildOrganizationJsonLd(), buildWebSiteJsonLd()]} />
      <MarketingSiteHeader user={null} />

      <main className="app-shell-main flex-1">
        <PageContainer>{children}</PageContainer>
      </main>

      <MarketingSiteFooter />
    </div>
  );
}
