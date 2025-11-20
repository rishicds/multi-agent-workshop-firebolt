import { NextRequest, NextResponse } from 'next/server';
import { AnalyticsAgent } from '@/lib/agents/analytics';

export async function POST(request: NextRequest) {
  try {
    const { queryType, naturalLanguageQuery } = await request.json();
    
    const analytics = new AnalyticsAgent();
    
    // Handle natural language queries
    if (naturalLanguageQuery) {
      const result = await analytics.executeNaturalLanguageQuery(naturalLanguageQuery);
      
      return NextResponse.json({
        success: result.success,
        type: 'natural_language',
        query: naturalLanguageQuery,
        sql: result.sql,
        result: result.result,
        error: result.error,
      });
    }
    
    // Handle pre-defined queries
    if (!queryType) {
      return NextResponse.json(
        { error: 'Either queryType or naturalLanguageQuery is required' }, 
        { status: 400 }
      );
    }
    
    // Validate queryType
    const validQueryTypes = [
      'revenue',
      'top_products',
      'user_behavior',
      'category_performance',
      'brand_analysis'
    ];
    
    if (!validQueryTypes.includes(queryType)) {
      return NextResponse.json(
        { 
          error: `Invalid queryType. Must be one of: ${validQueryTypes.join(', ')}`,
          validQueryTypes
        }, 
        { status: 400 }
      );
    }
    
    const result = await analytics.executeQuery(queryType);
    
    return NextResponse.json({ 
      success: true,
      type: 'predefined',
      queryType,
      result 
    });
  } catch (error: any) {
    console.error('Analytics API error:', error);
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

// Add GET endpoint for available query types
export async function GET() {
  return NextResponse.json({
    availableQueryTypes: [
      { 
        type: 'revenue', 
        description: 'Total revenue, purchases, and customer metrics for the last 30 days' 
      },
      { 
        type: 'top_products', 
        description: 'Top 10 products by purchase count in the last 30 days' 
      },
      { 
        type: 'user_behavior', 
        description: 'User behavior analysis (views, carts, purchases) for the last 7 days' 
      },
      { 
        type: 'category_performance', 
        description: 'Category performance metrics for the last 30 days' 
      },
      { 
        type: 'brand_analysis', 
        description: 'Brand performance analysis for the last 30 days' 
      }
    ]
  });
}