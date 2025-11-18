"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DollarSign, Package, Users, Grid, Building2, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const QUERY_TYPES = [
  { value: 'revenue', label: 'Revenue', description: 'Total revenue (30 days)', icon: DollarSign },
  { value: 'top_products', label: 'Top Products', description: 'Best selling products (30 days)', icon: Package },
  { value: 'user_behavior', label: 'User Behavior', description: 'Views, carts, purchases (7 days)', icon: Users },
  { value: 'category_performance', label: 'Categories', description: 'Category performance (30 days)', icon: Grid },
  { value: 'brand_analysis', label: 'Brands', description: 'Brand analysis (30 days)', icon: Building2 },
] as const;

export function AnalyticsDemo() {
  const [queryType, setQueryType] = useState<string>('revenue');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType }),
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
          {/* Query Type Selection */}
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

          {/* Run Button */}
          <Button onClick={run} disabled={loading} className="w-full gap-2 shadow-lg" size="lg">
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
                <Badge variant="outline">Query Type: {result.queryType}</Badge>
                <Badge variant="outline">Rows: {result.result?.rows?.length || 0}</Badge>
              </div>
              
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


