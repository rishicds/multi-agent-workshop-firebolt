import { NextRequest, NextResponse } from 'next/server';
import { OrchestratorAgent } from '@/lib/agents/orchestrator';

export async function POST(request: NextRequest) {
  try {
    const { query, action = 'parse' } = await request.json();
    
    if (!query) {
      return NextResponse.json(
        { error: 'query parameter is required' }, 
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
    
    const orchestrator = new OrchestratorAgent(apiKey);
    
    // Support both intent parsing and multi-step execution
    if (action === 'execute' || action === 'multi_step') {
      const result = await orchestrator.handleMultiStepQuery(query);
      return NextResponse.json({
        action: 'multi_step_execution',
        ...result
      });
    }
    
    // Default: parse intent and route
    const intent = await orchestrator.parseIntent(query);
    const route = orchestrator.routeTask(intent);
    
    return NextResponse.json({ 
      success: true,
      action: 'intent_parsing',
      query,
      intent, 
      route 
    });
  } catch (error: any) {
    console.error('Orchestrator API error:', error);
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
    capabilities: {
      actions: ['parse', 'execute', 'multi_step'],
      supportedIntents: ['analytics', 'report', 'email', 'multi_step'],
      features: [
        'Natural language query parsing',
        'Multi-agent orchestration',
        'Email delivery with reports',
        'Complex workflow execution'
      ]
    },
    examples: [
      {
        query: 'Show me revenue for the last 30 days',
        action: 'parse',
        description: 'Parse intent and determine routing'
      },
      {
        query: 'Generate a revenue report and email it to user@example.com',
        action: 'execute',
        description: 'Execute multi-step workflow'
      }
    ]
  });
}