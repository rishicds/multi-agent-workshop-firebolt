'use client';

import { InteractiveExercise } from '@/components/workshop/InteractiveExercise';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { Database, Sparkles, Mail, ArrowRight, Shield, Terminal, BookOpen, Target, GitFork, CheckCircle2 } from 'lucide-react';

export default function WorkshopPage() {
  return (
    <div className="flex h-full" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-normal mb-2">Workshop</h1>
        <p className="text-gray-600 mb-6 text-lg">Follow the steps in the sidebar. Start with Setup.</p>
        
        {/* Tabbed Theory Section */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">
              <BookOpen className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="theory">
              <Target className="w-4 h-4 mr-2" />
              Why This Exists
            </TabsTrigger>
            <TabsTrigger value="flow">
              <GitFork className="w-4 h-4 mr-2" />
              System Flow
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Multi-Agent AI Workshop</h2>
              <p className="text-gray-700 mb-4">
                Build a complete natural language to SQL pipeline with email reporting using Gemini, Firebolt, and Gmail.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold">Gemini AI</h3>
                  </div>
                  <p className="text-sm text-gray-600">Natural language processing and SQL generation</p>
                </div>
                
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="w-5 h-5 text-orange-600" />
                    <h3 className="font-semibold">Firebolt</h3>
                  </div>
                  <p className="text-sm text-gray-600">High-performance analytics database</p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold">Gmail API</h3>
                  </div>
                  <p className="text-sm text-gray-600">Automated report delivery</p>
                </div>
              </div>

              <Link 
                href="/workshop/01-setup" 
                className="inline-block px-6 py-3 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors"
              >
                Go to Step 1 →
              </Link>
            </Card>
          </TabsContent>

          {/* Theory Tab */}
          <TabsContent value="theory">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                Why This System ?
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3">Modern Analytics Pipeline Requirements</h3>
                  <ul className="space-y-2 ml-6">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Human-like querying of data</strong> (NL → SQL)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Secure compute agents</strong> instead of exposing DB credentials</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Report generation through LLMs</strong></span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span><strong>Cross-platform execution</strong> (desktop, CLI, Next.js, automation)</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-purple-900 mb-2">Google's MCP (Model Context Protocol) Solution</h3>
                      <p className="text-gray-700 mb-2">
                        <strong>The Missing Piece:</strong> It lets you expose Firebolt safely through a local agent, not through the browser.
                      </p>
                      <p className="text-sm text-purple-700">
                        Your Next.js app becomes only a front-end UI, while the MCP server handles all secure operations.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="w-6 h-6 text-blue-600" />
                    Gemini Handles
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">SQL generation</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Query explanation</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Report writing</span>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <span className="font-medium">Multi-step workflow orchestration</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Flow Tab */}
          <TabsContent value="flow">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <GitFork className="w-6 h-6" />
                System Flow Example
              </h2>
              
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <Terminal className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg mb-2">User Request</h3>
                    <p className="text-gray-700 italic">
                      "Show top 10 categories by revenue last month and email me the report."
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold mb-3">Processing Flow</h3>
                
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-blue-600">1</span>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 rounded-lg">
                    <strong>Next.js</strong> receives user query
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-purple-600">2</span>
                  </div>
                  <div className="flex-1 p-3 bg-purple-50 rounded-lg">
                    <strong>Gemini</strong> converts to SQL query
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-orange-600">3</span>
                  </div>
                  <div className="flex-1 p-3 bg-orange-50 rounded-lg">
                    <strong>MCP</strong> securely routes to Firebolt
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-red-600">4</span>
                  </div>
                  <div className="flex-1 p-3 bg-red-50 rounded-lg">
                    <strong>Firebolt</strong> executes query and returns results
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-purple-600">5</span>
                  </div>
                  <div className="flex-1 p-3 bg-purple-50 rounded-lg">
                    <strong>Gemini</strong> generates formatted report
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-green-600">6</span>
                  </div>
                  <div className="flex-1 p-3 bg-green-50 rounded-lg">
                    <strong>Gmail</strong> sends report to user's email
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-gray-700">
                  <strong>Result:</strong> User receives a professionally formatted report in their inbox with top 10 categories by revenue, generated entirely through natural language!
                </p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Link 
          href="/workshop/01-setup" 
          className="inline-block px-6 py-3 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors"
        >
          Go to Step 1 →
        </Link>
      </main>
      
      <aside className="w-80 border-l p-4 hidden lg:block bg-white">
        <InteractiveExercise />
      </aside>
    </div>
  );
}


