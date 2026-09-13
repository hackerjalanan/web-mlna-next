'use client';

import Navbar from '@/components/layout/Navbar';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { useLoading } from '@/context/LoadingContext';
import Loading from '@/context/Loading';
import { usePathname } from 'next/navigation';
import FloatingMenu from '@/components/FloatingMenu';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { isPending } = useLoading();
  const pathname = usePathname();
  const isGalleryPreview = pathname.startsWith('/gallery/preview');

  return (
    <div className={isGalleryPreview ? 'h-dvh overflow-hidden' : 'min-h-screen'}>
      <Navbar />

      <main
        className={`flex flex-col ${
          isGalleryPreview ? 'h-dvh overflow-hidden' : 'min-h-screen'
        }`}
      >
        {/* PAGE CONTENT */}
        <div className={`relative flex-1 min-h-0 ${isGalleryPreview ? 'bg-black overflow-hidden' : ''}`}>
          {isPending ? (
            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
              <Loading />
            </div>
          ) : (
            children
          )}
        </div>
      </main>

      <FloatingMenu />
    </div>
  );
}