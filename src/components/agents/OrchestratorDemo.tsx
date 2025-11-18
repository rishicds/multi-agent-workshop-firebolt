"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Zap, Loader2, AlertCircle, CheckCircle2, XCircle } from 'lucide-react';

const EXAMPLE_QUERIES = [
  'Show me revenue for the last 30 days',
  'What are the top selling products?',
  'Analyze user behavior',
  'Show category performance',
  'Generate a revenue report and email to user@example.com',
  'Show me brand analysis and send the report',
];

export function OrchestratorDemo() {
  const [query, setQuery] = useState('Show revenue for the last 30 days');
  const [action, setAction] = useState<'parse' | 'execute'>('parse');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, action }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process query');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const renderIntentParsing = (data: any) => {
    if (!data.intent) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="secondary" className="text-sm">Intent</Badge>
          <span className="font-mono font-semibold text-emerald-700">{data.intent.intent}</span>
          <Badge variant="outline">Confidence: {(data.intent.confidence * 100).toFixed(0)}%</Badge>
          {data.route && (
            <>
              <span className="text-slate-400">→</span>
              <Badge>Route</Badge>
              <span className="font-semibold capitalize text-emerald-700">{data.route}</span>
            </>
          )}
        </div>
        
        {data.intent.entities && Object.keys(data.intent.entities).length > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff]">
            <p className="text-sm font-semibold mb-2 text-emerald-800">Extracted Entities:</p>
            <pre className="text-xs overflow-auto text-slate-700">
              {JSON.stringify(data.intent.entities, null, 2)}
            </pre>
          </div>
        )}
      </div>
    );
  };

  const renderMultiStepExecution = (data: any) => {
    if (!data.steps) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={data.success ? "success" : "warning"} className="text-sm flex items-center gap-1">
            {data.success ? (
              <>
                <CheckCircle2 className="h-3 w-3" />
                Success
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" />
                Failed
              </>
            )}
          </Badge>
          <Badge variant="outline">Total Steps: {data.totalSteps}</Badge>
        </div>

        <div className="space-y-3">
          {data.steps.map((step: any, idx: number) => (
            <div key={idx} className="rounded-xl p-4 bg-gradient-to-br from-white to-emerald-50/30 shadow-[3px_3px_8px_#d4ede1,_-3px_-3px_8px_#ffffff]">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="secondary">Step {idx + 1}</Badge>
                <span className="font-semibold capitalize text-emerald-800">{step.step}</span>
                <Badge variant={step.status === 'completed' ? 'success' : step.status === 'failed' ? 'warning' : 'outline'}>
                  {step.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 mb-2">Action: {step.action}</p>
              
              <details className="text-sm">
                <summary className="cursor-pointer text-slate-600 hover:text-emerald-700 transition-colors font-medium">
                  View Output
                </summary>
                <pre className="bg-white/70 p-3 rounded-lg mt-2 text-xs overflow-auto max-h-40 shadow-inner">
                  {typeof step.output === 'string' 
                    ? step.output 
                    : JSON.stringify(step.output, null, 2)}
                </pre>
              </details>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-800">Orchestrator Agent</CardTitle>
        <CardDescription className="text-slate-600">
          Natural language query parsing & multi-agent orchestration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Mode Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button
              variant={action === 'parse' ? 'default' : 'outline'}
              onClick={() => setAction('parse')}
              className="flex-1 gap-2 min-h-[3rem]"
            >
              <Search className="h-4 w-4" />
              <span>Parse Intent Only</span>
            </Button>
            <Button
              variant={action === 'execute' ? 'default' : 'outline'}
              onClick={() => setAction('execute')}
              className="flex-1 gap-2 min-h-[3rem]"
            >
              <Zap className="h-4 w-4" />
              <span>Execute Multi-Step</span>
            </Button>
          </div>

          {/* Query Input */}
          <div className="space-y-2">
            <Input
              aria-label="User query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your natural language query..."
              className="text-base shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff] border-0 focus:ring-2 focus:ring-emerald-400"
            />
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-slate-700 font-semibold mr-1 self-center">Examples:</span>
              {EXAMPLE_QUERIES.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setQuery(example)}
                  className="text-xs px-3 py-2 bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-300 hover:from-emerald-50 hover:to-teal-50 hover:border-emerald-400 rounded-lg shadow-[2px_2px_5px_#d4ede1,_-2px_-2px_5px_#ffffff] hover:shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff] text-left transition-all text-slate-800 hover:text-emerald-800 font-medium"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Run Button */}
          <Button onClick={run} disabled={loading} className="w-full gap-2 shadow-lg" size="lg">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {action === 'parse' ? 'Parsing...' : 'Executing...'}
              </>
            ) : (
              <>
                {action === 'parse' ? (
                  <>
                    <Search className="h-5 w-5" />
                    Parse Query
                  </>
                ) : (
                  <>
                    <Zap className="h-5 w-5" />
                    Execute Workflow
                  </>
                )}
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-4 shadow-md" role="alert">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-700 font-semibold">Error</p>
              </div>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && (
            <div className="space-y-4">
              {result.action === 'intent_parsing' && renderIntentParsing(result)}
              {result.action === 'multi_step_execution' && renderMultiStepExecution(result)}

              {/* Raw JSON Toggle */}
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
                  View Raw JSON Response
                </summary>
                <pre className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl mt-2 text-xs overflow-auto max-h-60 shadow-inner" aria-live="polite">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}


