"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, BarChart3, TrendingUp, Package, Mail, Loader2, CheckCircle2, AlertCircle, Info, DollarSign } from 'lucide-react';

const REPORT_TYPES = [
  { value: 'summary', label: 'Summary', description: 'Executive summary (~250-300 words)', icon: FileText },
  { value: 'detailed', label: 'Detailed', description: 'Comprehensive analysis', icon: BarChart3 },
  { value: 'financial', label: 'Financial', description: 'Financial report with recommendations (~500-600 words)', icon: TrendingUp },
] as const;

const DATA_SOURCES = [
  { value: 'revenue', label: 'Revenue', description: 'Total revenue & customer metrics', icon: DollarSign },
  { value: 'top_products', label: 'Top Products', description: 'Best selling products', icon: Package },
  { value: 'user_behavior', label: 'User Behavior', description: 'Views, carts, purchases', icon: BarChart3 },
  { value: 'category_performance', label: 'Categories', description: 'Category performance', icon: TrendingUp },
  { value: 'brand_analysis', label: 'Brands', description: 'Brand analysis', icon: FileText },
] as const;

export function ReportDemo() {
  const [reportType, setReportType] = useState<string>('summary');
  const [recipient, setRecipient] = useState('user@example.com');
  const [subject, setSubject] = useState('E-commerce Analytics Report');
  const [dataSource, setDataSource] = useState<string>('revenue');
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function previewHTMLEmail() {
    if (!result || !result.report) {
      setError('Please generate a report first before previewing the email');
      return;
    }
    
    try {
      const res = await fetch('/api/report/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          report: result.report,
          reportType: reportType 
        }),
      });
      
      if (!res.ok) {
        throw new Error('Failed to generate preview');
      }
      
      const htmlContent = await res.text();
      
      // Open in new window
      const previewWindow = window.open('', '_blank');
      if (previewWindow) {
        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
      } else {
        setError('Please allow popups to preview the email');
      }
    } catch (e: any) {
      setError(e.message);
    }
  }

  async function fetchAnalyticsData() {
    setFetchingData(true);
    setError(null);
    try {
      const res = await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryType: dataSource }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch analytics data');
      setAnalyticsData(data.result);
      return data.result;
    } catch (e: any) {
      setError(e.message);
      throw e;
    } finally {
      setFetchingData(false);
    }
  }

  async function run() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // First fetch the analytics data if not already fetched
      let dataToUse = analyticsData;
      if (!dataToUse) {
        dataToUse = await fetchAnalyticsData();
      }
      
      // Then generate and send the report
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: dataToUse,
          reportType,
          recipient,
          subject,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate report');
      setResult(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-emerald-800">Report Agent</CardTitle>
        <CardDescription className="text-slate-600">
          AI-powered report generation with Gemini • Email delivery via Gmail SMTP
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Report Type Selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-emerald-800">Report Type</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {REPORT_TYPES.map((rt) => {
                const Icon = rt.icon;
                return (
                  <Button
                    key={rt.value}
                    variant={reportType === rt.value ? 'default' : 'outline'}
                    onClick={() => setReportType(rt.value)}
                    className="h-auto py-4 px-4 flex flex-col items-start gap-2 text-left w-full"
                    title={rt.description}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="font-semibold text-sm">{rt.label}</span>
                    </div>
                    <span className="text-[0.8rem] opacity-90 leading-snug break-words">{rt.description}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Data Source Selection */}
          <div>
            <label className="text-sm font-semibold mb-2 block text-emerald-800">Data Source</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
              {DATA_SOURCES.map((ds) => {
                const Icon = ds.icon;
                return (
                  <Button
                    key={ds.value}
                    variant={dataSource === ds.value ? 'default' : 'outline'}
                    onClick={() => {
                      setDataSource(ds.value);
                      setAnalyticsData(null); // Clear cached data when source changes
                    }}
                    className="h-auto py-3 px-3 flex flex-col items-start gap-1 text-left w-full"
                    title={ds.description}
                  >
                    <div className="flex items-center gap-2 w-full">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span className="font-semibold text-xs">{ds.label}</span>
                    </div>
                    <span className="text-[0.75rem] opacity-90 leading-snug break-words">{ds.description}</span>
                  </Button>
                );
              })}
            </div>
            
            {/* Fetch Data Preview Button */}
            <Button 
              onClick={fetchAnalyticsData} 
              disabled={fetchingData}
              variant="outline"
              className="w-full mt-3 gap-2"
              size="sm"
            >
              {fetchingData ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Fetching Data...
                </>
              ) : (
                <>
                  <BarChart3 className="h-4 w-4" />
                  {analyticsData ? 'Refresh Data from Firebolt' : 'Fetch Data from Firebolt'}
                </>
              )}
            </Button>
          </div>

          {/* Data Preview */}
          {analyticsData && (
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff]">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm font-semibold text-emerald-800">
                  Data Loaded: {analyticsData.rows?.length || 0} rows
                </p>
              </div>
              <details className="text-sm">
                <summary className="cursor-pointer text-emerald-700 hover:text-emerald-900 transition-colors font-medium">
                  Preview Data
                </summary>
                <pre className="bg-white/70 p-3 rounded-lg mt-2 text-xs overflow-auto max-h-40 shadow-inner">
                  {JSON.stringify(analyticsData, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Email Configuration */}
          <div className="space-y-2">
            <label className="text-sm font-semibold block text-emerald-800">Email Details</label>
            <Input
              aria-label="Recipient email"
              placeholder="recipient@example.com"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              type="email"
              className="shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff] border-0 focus:ring-2 focus:ring-emerald-400"
            />
            <Input
              aria-label="Email subject"
              placeholder="Report subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff] border-0 focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Email Mode Info */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 shadow-md">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Email Mode:</strong> {process.env.NEXT_PUBLIC_GMAIL_CONFIGURED === 'true' ? 'Production (Real emails)' : 'Sandbox (Preview only)'}
              </p>
            </div>
          </div>

          {/* Generate Button */}
          <Button onClick={run} disabled={loading || fetchingData} className="w-full gap-2 shadow-lg" size="lg">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating Report...
              </>
            ) : (
              <>
                <Mail className="h-5 w-5" />
                {analyticsData ? 'Generate Report & Send Email' : 'Fetch Data & Generate Report'}
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
                  Report Generated
                </Badge>
                <Badge variant="outline">Type: {result.reportType}</Badge>
                {result.emailSent !== undefined && (
                  <Badge variant={result.emailSent ? 'success' : 'outline'} className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {result.emailSent ? 'Email Sent' : 'Email Preview'}
                  </Badge>
                )}
              </div>

              {result.recipient && (
                <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 text-sm shadow-[inset_2px_2px_5px_#d4ede1,_inset_-2px_-2px_5px_#ffffff]">
                  <p className="text-emerald-800"><strong>To:</strong> {result.recipient}</p>
                  <p className="text-emerald-800"><strong>Subject:</strong> {result.subject}</p>
                </div>
              )}

              {/* Report Content */}
              <div className="bg-white rounded-xl p-5 shadow-[3px_3px_8px_#d4ede1,_-3px_-3px_8px_#ffffff]">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-lg text-emerald-800">Report Content:</h4>
                  <Button
                    onClick={previewHTMLEmail}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Preview HTML Email
                  </Button>
                </div>
                <article className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-slate-700" aria-live="polite">
                  {result.report}
                </article>
              </div>

              {/* Raw JSON Toggle */}
              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-slate-600 hover:text-emerald-700 transition-colors font-medium">
                  View Raw JSON Response
                </summary>
                <pre className="bg-gradient-to-br from-slate-50 to-slate-100 p-4 rounded-xl mt-2 text-xs overflow-auto max-h-60 shadow-inner">
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


