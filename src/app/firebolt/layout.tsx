'use client';

import { WorkshopLayout } from '@/components/layout/WorkshopLayout';

export default function FireboltLayout({ children }: { children: React.ReactNode }) {
  return (
    <WorkshopLayout>
      {children}
    </WorkshopLayout>
  );
}
