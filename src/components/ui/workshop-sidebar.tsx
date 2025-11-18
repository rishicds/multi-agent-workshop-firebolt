'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/components/utils';

interface WorkshopStep {
  slug: string;
  title: string;
  description?: string;
  tools: ('gemini' | 'firebolt' | 'both')[];
}

const workshopSteps: WorkshopStep[] = [
  { slug: '01-setup', title: 'Setup & Configuration', description: 'Environment & API setup', tools: ['gemini', 'firebolt'] },
  { slug: '02-analytics', title: 'Analytics Overview', description: 'Firebolt data & queries', tools: ['firebolt'] },
  { slug: '03-orchestration-theory', title: 'Orchestration Theory', description: 'Multi-agent patterns', tools: [] },
  { slug: '04-orchestrator', title: 'Analytics Agent', description: 'Build Firebolt query agent', tools: ['firebolt'] },
  { slug: '05-report', title: 'Report Agent', description: 'Generate reports with Gemini', tools: ['gemini'] },
  { slug: '06-integration', title: 'Orchestrator Agent', description: 'Coordinate all agents', tools: ['both'] },
];

interface WorkshopSidebarProps {
  title?: string;
  subtitle?: string;
}

export function WorkshopSidebar({ title = "FIREBOLT", subtitle = "" }: WorkshopSidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const section = searchParams.get('section');

  return (
    <div className="flex h-full w-64 flex-col bg-[#2b2d31] text-[#d9d9d9]">
      {/* Header */}
      <div className="flex flex-col gap-3 px-4 pt-6 pb-2">
        {/* Logo Row */}
        <div className="flex items-center justify-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center bg-white rounded-md">
            
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

      {/* Search Bar */}
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
      <div className="flex-1 p-4 overflow-auto">
        <nav className="space-y-1">
          {/* Home Link */}
          <Link
            href="/"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "hover:bg-[#3a3d42]",
              pathname === '/' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
            )}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Quickstart
          </Link>

          {/* Firebolt Setup Section - Bright Red/Coral Theme */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2 px-3">
              <div className="flex h-4 w-4 items-center justify-center bg-[#ff6b6b] rounded">
                <Image 
                  src="/firebolt.png" 
                  alt="Firebolt"
                  width={12}
                  height={12}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <div className="text-xs font-semibold text-[#ff6b6b] uppercase tracking-wider">
                Firebolt Setup
              </div>
            </div>
            <Link
              href="/firebolt"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                pathname === '/firebolt' && !section ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                pathname === '/firebolt' && !section ? "bg-[#ff6b6b] text-white" : "bg-[#3a3d42] text-[#ff6b6b]"
              )}>
                1
              </div>
              <span>Account Setup</span>
            </Link>
            <Link
              href="/firebolt?section=create-engine"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                section === 'create-engine' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                section === 'create-engine' ? "bg-[#ff6b6b] text-white" : "bg-[#3a3d42] text-[#ff6b6b]"
              )}>
                2
              </div>
              <span>Create Engine</span>
            </Link>
            <Link
              href="/firebolt?section=database"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                section === 'database' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                section === 'database' ? "bg-[#ff6b6b] text-white" : "bg-[#3a3d42] text-[#ff6b6b]"
              )}>
                3
              </div>
              <span>Database & Data</span>
            </Link>
            <Link
              href="/firebolt?section=service-account"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                section === 'service-account' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                section === 'service-account' ? "bg-[#ff6b6b] text-white" : "bg-[#3a3d42] text-[#ff6b6b]"
              )}>
                4
              </div>
              <span>Service Account</span>
            </Link>
          </div>

          {/* API Setup Section - Bright Blue Theme */}
          <div className="pt-4">
            <div className="flex items-center gap-2 mb-2 px-3">
              <div className="flex h-4 w-4 items-center justify-center bg-[#4da6ff] rounded">
                <Image 
                  src="/google.png" 
                  alt="Google"
                  width={12}
                  height={12}
                  className="object-contain"
                />
              </div>
              <div className="text-xs font-semibold text-[#4da6ff] uppercase tracking-wider">
                Google API Setup
              </div>
            </div>
            <Link
              href="/firebolt?section=gemini-setup"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                section === 'gemini-setup' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                section === 'gemini-setup' ? "bg-[#4da6ff] text-white" : "bg-[#3a3d42] text-[#4da6ff]"
              )}>
                5
              </div>
              <span>Gemini API</span>
            </Link>
            <Link
              href="/firebolt?section=gmail-setup"
              className={cn(
                "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                "hover:bg-[#3a3d42]",
                section === 'gmail-setup' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                section === 'gmail-setup' ? "bg-[#4da6ff] text-white" : "bg-[#3a3d42] text-[#4da6ff]"
              )}>
                6
              </div>
              <span>Gmail SMTP</span>
            </Link>
          </div>

          {/* Workshop Steps Section */}
          <div className="pt-4">
            <div className="text-xs font-semibold text-[#bce8d0] uppercase tracking-wider mb-2 px-3">
              Workshop Steps
            </div>
            <Link
              href="/workshop"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors mb-1",
                "hover:bg-[#3a3d42]",
                pathname === '/workshop' ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
              )}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Overview
            </Link>
            
            {workshopSteps.map((step, index) => {
              const stepPath = `/workshop/${step.slug}`;
              const isActive = pathname === stepPath;
              
              // Determine badge color based on tools
              const getBadgeColors = () => {
                if (step.tools.includes('both')) {
                  return {
                    bg: 'bg-gradient-to-r from-[#4da6ff] to-[#ff6b6b]',
                    text: 'text-white'
                  };
                }
                if (step.tools.includes('gemini')) {
                  return {
                    bg: 'bg-[#4da6ff]',
                    text: 'text-white'
                  };
                }
                if (step.tools.includes('firebolt')) {
                  return {
                    bg: 'bg-[#ff6b6b]',
                    text: 'text-white'
                  };
                }
                return {
                  bg: 'bg-[#3a3d42]',
                  text: 'text-[#9ca3af]'
                };
              };

              const badgeColors = getBadgeColors();
              
              return (
                <Link
                  key={step.slug}
                  href={stepPath}
                  className={cn(
                    "flex items-start gap-3 rounded-lg px-3 py-2 text-sm transition-colors group",
                    "hover:bg-[#3a3d42]",
                    isActive ? "bg-[#3a3d42] text-white" : "text-[#d9d9d9]"
                  )}
                >
                  <div className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold mt-0.5",
                    isActive ? badgeColors.bg : "bg-[#3a3d42]",
                    isActive ? badgeColors.text : "text-[#9ca3af]"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium",
                      isActive ? "text-white" : "text-[#d9d9d9] group-hover:text-white"
                    )}>
                      {step.title}
                    </div>
                    {step.description && (
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-xs text-[#b5b5b5] truncate">
                          {step.description}
                        </span>
                        {step.tools.length > 0 && (
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {step.tools.includes('both') ? (
                              <>
                                <div className="w-1.5 h-1.5 rounded-full bg-[#4da6ff]" title="Gemini" />
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b]" title="Firebolt" />
                              </>
                            ) : (
                              <>
                                {step.tools.includes('gemini') && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#4da6ff]" title="Gemini" />
                                )}
                                {step.tools.includes('firebolt') && (
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b6b]" title="Firebolt" />
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>

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
          className="block w-full rounded-lg bg-[#bce8d0] hover:bg-[#a8ddc4] px-3 py-2.5 text-sm text-gray-800 font-medium transition-colors text-center"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}