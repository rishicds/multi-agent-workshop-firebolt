'use client';

import React, { Suspense } from 'react';
import { WorkshopSidebar } from '@/components/ui/workshop-sidebar';

interface WorkshopLayoutProps {
  children: React.ReactNode;
}

function SidebarFallback() {
  return (
    <div className="flex h-full w-64 flex-col bg-[#2b2d31] text-[#d9d9d9]">
      <div className="flex flex-col gap-3 px-4 pt-6 pb-2">
        <div className="flex items-center justify-center gap-2">
          <div className="h-8 w-8 bg-white rounded-md animate-pulse" />
          <span className="text-[#7a7a7a] text-lg font-bold">×</span>
          <div className="h-8 w-8 bg-white rounded-md animate-pulse" />
          <span className="text-[#7a7a7a] text-lg font-bold">×</span>
          <div className="h-8 w-8 bg-white rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function WorkshopLayout({ children }: WorkshopLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <Suspense fallback={<SidebarFallback />}>
        <WorkshopSidebar />
      </Suspense>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}