import "./globals.css";
import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth/auth";
import AppShell from "@/components/layout/app-shell";

export const metadata: Metadata = {
  title: "GCSE Russian Course Platform",
  description: "Online GCSE Russian learning platform",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function () {
  try {
    const stored = localStorage.getItem("theme");
    const system = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = stored || (system ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`,
          }}
        />
      </head>
      <body className="min-h-screen">
        <AppShell user={user}>{children}</AppShell>
      </body>
    </html>
  );
}
