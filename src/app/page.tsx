import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrchestratorDemo } from '@/components/agents/OrchestratorDemo';
import { AnalyticsDemo } from '@/components/agents/AnalyticsDemo';
import { ReportDemo } from '@/components/agents/ReportDemo';
import { Separator } from '@/components/ui/separator';
import { AppLayout } from '@/components/layout/AppLayout';

export default function Home() {
  return (
    <AppLayout>
      <div className="p-8" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-normal mb-2" style={{ fontFamily: 'Coolvetica, sans-serif' }}>Multi-Agent AI Demo</h1>
          <p className="text-gray-600 mb-4 text-lg">Gemini + Firebolt MCP + Gmail (sandbox) • Next.js 14</p>
          
          {/* Setup Guide Banner */}
          
          
          <Tabs defaultValue="orchestrator" className="w-full">
            <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="orchestrator">Orchestrator</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="report">Report</TabsTrigger>
              <TabsTrigger value="workshop">Workshop</TabsTrigger>
            </TabsList>
            
            <TabsContent value="orchestrator" className="mt-6">
              <OrchestratorDemo />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-6">
              <AnalyticsDemo />
            </TabsContent>
            
            <TabsContent value="report" className="mt-6">
              <ReportDemo />
            </TabsContent>
            
            <TabsContent value="workshop" className="mt-6">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-semibold mb-4">Interactive Workshop</h2>
                <p className="mb-6 text-lg text-gray-600">
                  Head to the interactive workshop to complete the TODOs and extend the multi-agent system with hands-on exercises.
                </p>
                <Link 
                  href="/workshop" 
                  className="inline-block px-6 py-3 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors"
                >
                  Go to Workshop →
                </Link>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}


