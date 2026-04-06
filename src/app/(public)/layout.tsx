import PageContainer from "@/components/layout/page-container";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}
