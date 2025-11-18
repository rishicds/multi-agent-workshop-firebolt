"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DollarSign, Package, Users, Grid, Building2, Play, Loader2, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

const QUERY_TYPES = [
  { value: 'revenue', label: 'Revenue', description: 'Total revenue (30 days)', icon: DollarSign },
  { value: 'top_products', label: 'Top Products', description: 'Best selling products (30 days)', icon: Package },
  { value: 'user_behavior', label: 'User Behavior', description: 'Views, carts, purchases (7 days)', icon: Users },
  { value: 'category_performance', label: 'Categories', description: 'Category performance (30 days)', icon: Grid },
  { value: 'brand_analysis', label: 'Brands', description: 'Brand analysis (30 days)', icon: Building2 },
] as const;

export function AnalyticsDemo() {
  const [queryType, setQueryType] = useState<string>('revenue');
  const [naturalLanguageQuery, setNaturalLanguageQuery] = useState<string>('');
  const [queryMode, setQueryMode] = useState<'predefined' | 'natural'>('predefined');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run(useNaturalLanguage: boolean = false) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body = useNaturalLanguage 
        ? { naturalLanguageQuery }
        : { queryType };
        
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to run query');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const renderResultTable = (data: any) => {
    if (!data || !data.result) return null;
    
    const { columns, rows } = data.result;
    if (!rows || rows.length === 0) return <p className="text-slate-500">No data found</p>;

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gradient-to-r from-emerald-50 to-teal-50">
              {columns.map((col: string) => (
                <th key={col} className="text-left p-3 font-semibold capitalize text-emerald-800">
                  {col.replace(/_/g, ' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: any, idx: number) => (
              <tr key={idx} className="border-b border-emerald-100 hover:bg-emerald-50/50 transition-colors">
                {columns.map((col: string) => (
                  <td key={col} className="p-3">
                    {typeof row[col] === 'number' 
                      ? row[col].toLocaleString(undefined, { maximumFractionDigits: 2 })
                      : row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-800">Analytics Agent</CardTitle>
        <CardDescription className="text-slate-600">
          Query your ecommerce database • Database: {process.env.NEXT_PUBLIC_FIREBOLT_DB || 'ecommercedb'} • Table: ecommerce
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Query Mode Toggle */}
          <div className="flex gap-2 border-b pb-4">
            <Button
              variant={queryMode === 'predefined' ? 'default' : 'outline'}
              onClick={() => setQueryMode('predefined')}
              className="flex-1"
            >
              <Grid className="h-4 w-4 mr-2" />
              Predefined Queries
            </Button>
            <Button
              variant={queryMode === 'natural' ? 'default' : 'outline'}
              onClick={() => setQueryMode('natural')}
              className="flex-1"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Natural Language (Gemini + Firebolt)
            </Button>
          </div>

          {/* Predefined Query Selection */}
          {queryMode === 'predefined' && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {QUERY_TYPES.map((qt) => {
                  const Icon = qt.icon;
                  return (
                    <Button
                      key={qt.value}
                      variant={queryType === qt.value ? 'default' : 'outline'}
                      onClick={() => setQueryType(qt.value)}
                      className="h-auto py-4 px-4 flex flex-col items-start gap-2 text-left w-full"
                      aria-pressed={queryType === qt.value}
                      title={qt.description}
                    >
                      <div className="flex items-center gap-2 w-full">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span className="font-semibold text-sm">{qt.label}</span>
                      </div>
                      <span className="text-[0.8rem] opacity-90 leading-snug break-words">{qt.description}</span>
                    </Button>
                  );
                })}
              </div>

              {/* Run Predefined Query Button */}
              <Button onClick={() => run(false)} disabled={loading} className="w-full gap-2 shadow-lg" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Running Query...
                  </>
                ) : (
                  <>
                    <Play className="h-5 w-5" />
                    Execute Query
                  </>
                )}
              </Button>
            </>
          )}

          {/* Natural Language Query Input */}
          {queryMode === 'natural' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Ask a question about your ecommerce data:
                </label>
                <Input
                  type="text"
                  placeholder="e.g., What are the top 5 selling products? or Show me revenue by brand"
                  value={naturalLanguageQuery}
                  onChange={(e) => setNaturalLanguageQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !loading && naturalLanguageQuery.trim()) {
                      run(true);
                    }
                  }}
                  className="text-base"
                />
                <p className="text-xs text-slate-500">
                  💡 Powered by Gemini AI + Firebolt MCP - Your question will be converted to SQL and executed on Firebolt
                </p>
              </div>

              {/* Run Natural Language Query Button */}
              <Button 
                onClick={() => run(true)} 
                disabled={loading || !naturalLanguageQuery.trim()} 
                className="w-full gap-2 shadow-lg" 
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Gemini is generating SQL...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-5 w-5" />
                    Ask Question
                  </>
                )}
              </Button>
            </>
          )}

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
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="success" className="text-sm flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  Query Successful
                </Badge>
                {result.type === 'natural_language' && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Natural Language
                  </Badge>
                )}
                {result.type === 'predefined' && (
                  <Badge variant="outline">Query Type: {result.queryType}</Badge>
                )}
                <Badge variant="outline">Rows: {result.result?.rows?.length || 0}</Badge>
              </div>

              {/* Show Generated SQL for Natural Language Queries */}
              {result.type === 'natural_language' && result.sql && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 shadow-md">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="font-semibold text-purple-800">Generated SQL by Gemini:</span>
                  </div>
                  <pre className="bg-white/70 p-3 rounded-lg text-xs overflow-auto font-mono text-slate-700">
{result.sql}
                  </pre>
                </div>
              )}
              
              <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl p-5 shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff]">
                {renderResultTable(result)}
              </div>

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


