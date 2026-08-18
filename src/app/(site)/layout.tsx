import MainLayout from "@/components/layout/MainLayout";
import BotGate from "@/components/BotGate";
import { LoadingProvider } from "@/context/LoadingContext";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <BotGate>
      <LoadingProvider>
        <MainLayout>{children}</MainLayout>
      </LoadingProvider>
    </BotGate>
  );
}