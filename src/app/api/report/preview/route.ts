import { NextRequest, NextResponse } from 'next/server';
import { generateReportHTML } from '@/lib/utils/email-templates';

/**
 * Preview endpoint to see HTML email templates
 * This returns the HTML directly for browser preview
 */
export async function POST(request: NextRequest) {
  try {
    const { report, reportType = 'summary' } = await request.json();
    
    if (!report) {
      return NextResponse.json(
        { error: 'report parameter is required' }, 
        { status: 400 }
      );
    }
    
    // Generate HTML
    const html = generateReportHTML(
      report, 
      reportType as 'summary' | 'detailed' | 'financial',
      'Firebolt Analytics Database'
    );
    
    // Return HTML directly for browser preview
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('Preview API error:', error);
    return NextResponse.json(
      { 
        error: error?.message ?? 'Unknown error',
        details: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
