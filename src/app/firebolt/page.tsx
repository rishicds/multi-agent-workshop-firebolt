'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import FireboltSetupSection from '@/components/firebolt/FireboltSetupSection';
import CreateEngineSection from '@/components/firebolt/CreateEngineSection';
import FireboltDatabaseSection from '@/components/firebolt/FireboltDatabaseSection';
import FireboltServiceAccountSection from '@/components/firebolt/FireboltServiceAccountSection';
import GeminiSetupSection from '@/components/firebolt/GeminiSetupSection';
import GmailSetupSection from '@/components/firebolt/GmailSetupSection';

function FireboltContent() {
  const searchParams = useSearchParams();
  const [selectedSection, setSelectedSection] = useState('setup');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section === 'create-engine') {
      setSelectedSection('create-engine');
    } else if (section === 'database') {
      setSelectedSection('firebolt-database');
    } else if (section === 'service-account') {
      setSelectedSection('firebolt-service-account');
    } else if (section === 'gemini-setup') {
      setSelectedSection('gemini-setup');
    } else if (section === 'gmail-setup') {
      setSelectedSection('gmail-setup');
    } else {
      setSelectedSection('setup');
    }
  }, [searchParams]);

  return (
    <div className="flex h-full" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
      <main className="flex-1 overflow-auto p-8">
        {selectedSection === 'setup' && (
          <FireboltSetupSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'create-engine' && (
          <CreateEngineSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'firebolt-database' && (
          <FireboltDatabaseSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'firebolt-service-account' && (
          <FireboltServiceAccountSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'gemini-setup' && (
          <GeminiSetupSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'gmail-setup' && (
          <GmailSetupSection setSelectedSection={setSelectedSection} />
        )}
        {selectedSection === 'home' && (
          <div>
            <h1 className="text-4xl font-bold mb-6">Firebolt Setup Home</h1>
            <p className="text-gray-700 mb-4">Welcome to the Firebolt setup guide.</p>
            <button
              onClick={() => setSelectedSection('setup')}
              className="text-blue-600 underline hover:text-blue-800"
            >
              → Go to Setup Guide
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex h-full" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
      <main className="flex-1 overflow-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </main>
    </div>
  );
}

export default function FireboltPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <FireboltContent />
    </Suspense>
  );
}
