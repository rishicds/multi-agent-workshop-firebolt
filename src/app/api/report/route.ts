import { NextRequest, NextResponse } from 'next/server';
import { ReportAgent } from '@/lib/agents/report';

export async function POST(request: NextRequest) {
  try {
    const { data, reportType = 'summary', recipient, subject = 'Analytics Report' } = await request.json();
    
    if (!data) {
      return NextResponse.json(
        { error: 'data parameter is required' }, 
        { status: 400 }
      );
    }
    
    // Validate reportType
    const validReportTypes = ['summary', 'detailed', 'financial'];
    if (reportType && !validReportTypes.includes(reportType)) {
      return NextResponse.json(
        { 
          error: `Invalid reportType. Must be one of: ${validReportTypes.join(', ')}`,
          validReportTypes
        }, 
        { status: 400 }
      );
    }
    
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_api_key_here') {
      return NextResponse.json(
        { 
          error: 'GEMINI_API_KEY not configured. Please set it in your .env file.',
          hint: 'Get your API key from https://aistudio.google.com'
        }, 
        { status: 500 }
      );
    }
    
    const reportAgent = new ReportAgent(apiKey);
    
    // Generate the appropriate report type
    let report: string;
    if (reportType === 'financial') {
      report = await reportAgent.generateFinancialReport(data);
    } else {
      report = await reportAgent.generateReport(data, reportType as 'summary' | 'detailed');
    }
    
    let emailSent: boolean | undefined;
    if (recipient) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient)) {
        return NextResponse.json(
          { error: 'Invalid email address format' }, 
          { status: 400 }
        );
      }
      
      emailSent = await reportAgent.sendEmail(
        recipient, 
        subject, 
        report, 
        reportType as 'summary' | 'detailed' | 'financial'
      );
    }
    
    return NextResponse.json({ 
      success: true,
      reportType,
      report, 
      emailSent: !!emailSent,
      ...(recipient && { recipient, subject })
    });
  } catch (error: any) {
    console.error('Report API error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error?.message ?? 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      }, 
      { status: 500 }
    );
  }
}

// Add GET endpoint for capabilities
export async function GET() {
  return NextResponse.json({
    reportTypes: [
      { 
        type: 'summary', 
        description: 'Executive summary with key insights (~250-300 words)' 
      },
      { 
        type: 'detailed', 
        description: 'Detailed analysis with comprehensive metrics' 
      },
      { 
        type: 'financial', 
        description: 'Financial report with executive summary, metrics, trends, and recommendations (~500-600 words)' 
      }
    ],
    features: [
      'AI-generated reports using Gemini',
      'Email delivery via Gmail SMTP',
      'Customizable report subjects',
      'Sandbox mode for testing'
    ],
    emailConfig: {
      sandboxMode: process.env.NODE_ENV !== 'production' || !process.env.GMAIL_USER,
      configured: !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD)
    }
  });
}