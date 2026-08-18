import MainLayout from "@/components/layout/MainLayout";
import BotGate from "@/components/BotGate";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BotGate>
      <MainLayout>{children}</MainLayout>
    </BotGate>
  );
}