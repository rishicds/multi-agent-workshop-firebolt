'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/components/utils';

interface SidebarItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

interface SidebarProps {
  items: SidebarItem[];
  title?: string;
  subtitle?: string;
}

export function Sidebar({ items, title = "FIREBOLT", subtitle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-[#2b2d31] text-[#d9d9d9]">
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 pt-6 pb-2">
        {/* Logo Row */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-white rounded-md">
            {/* <Image 
              src="/google.png" 
              alt="Google Logo"
              width={20}
              height={20}
              className="object-contain"
            /> */}
          </div>
          <span className="text-[#7a7a7a] text-lg font-bold">×</span>
          <div className="flex h-8 w-8 items-center justify-center bg-white rounded-md">
            <Image 
              src="/firebolt.png" 
              alt="Firebolt Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
          <span className="text-[#7a7a7a] text-lg font-bold">×</span>
          <div className="flex h-8 w-8 items-center justify-center bg-white rounded-md">
            <Image 
              src="/devrelsquad.png" 
              alt="DevRelSquad Logo"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        </div>
        {/* Title */}
        <div className="flex flex-col items-center text-center">
          <span className="font-semibold text-sm tracking-tight text-white">Google for Developers × Firebolt × DevRelSquad</span>
          {subtitle && (
            <span className="text-xs text-[#b5b5b5]">{subtitle}</span>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <svg 
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#7a7a7a]" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search in docs"
            className="w-full bg-[#1e1f22] text-[#d9d9d9] placeholder-[#7a7a7a] rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#7AD2A2]"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  "hover:bg-[#3a3d42]",
                  isActive && "bg-[#3a3d42] text-white font-medium"
                )}
              >
                {item.icon && <span className="h-5 w-5 flex-shrink-0">{item.icon}</span>}
                <span className="truncate">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-[#3a3d42] p-4">
        {/* <div className="flex items-center gap-2 mb-3 text-[#d9d9d9]">
          <svg className="h-4 w-4 text-[#d9d9d9]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
          <span className="text-xs">Stars on GitHub</span>
          <span className="text-xs font-medium text-white">52K</span>
        </div> */}
        <Link 
          href="/"
          className="block w-full rounded-lg bg-[#7AD2A2] hover:bg-[#69c190] px-3 py-2.5 text-sm text-[#1e1f22] font-medium transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}