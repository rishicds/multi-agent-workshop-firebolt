import { GoogleGenerativeAI } from '@google/generative-ai';
import { AnalyticsAgent } from './analytics';
import { ReportAgent } from './report';

export type AgentType = 'analytics' | 'report' | 'email' | 'unknown';

export type IntentResult = {
  intent: 'analytics' | 'report' | 'email' | 'multi_step';
  entities: {
    query_type?: string;
    time_range?: string;
    recipient?: string;
  };
  confidence: number;
};

export class OrchestratorAgent {
  private model: any;
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Valid GEMINI_API_KEY is required for OrchestratorAgent');
    }
    
    this.apiKey = apiKey;
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  /**
   * ✅ COMPLETE: Basic intent parsing
   * Parses user query to determine intent
   */
  async parseIntent(userQuery: string): Promise<IntentResult> {
    const prompt = `
    Analyze this user query and classify the intent for an ecommerce analytics system:
    Query: "${userQuery}"
    
    Context: The system analyzes ecommerce purchase data with the following schema:
    - event_time: timestamp of the event
    - event_type: 'view', 'cart', or 'purchase'
    - product_id: product identifier
    - category_code: product category
    - brand: product brand
    - price: transaction price (null for non-purchase events)
    - user_id: customer identifier
    - user_session: session identifier
    
    The system can:
    - Run analytics queries (revenue, top products, user behavior, category/brand analysis)
    - Generate reports (summary or financial)
    - Send emails with reports
    - Handle multi-step queries that combine the above
    
    Respond in JSON format:
    {
      "intent": "analytics" | "report" | "email" | "multi_step",
      "entities": {
        "query_type": "revenue|top_products|user_behavior|category_performance|brand_analysis",
        "time_range": "time period if specified",
        "recipient": "email address if specified"
      },
      "confidence": 0.0 to 1.0
    }
    
    Examples:
    - "Show me revenue" -> intent: analytics, query_type: revenue
    - "What are the top selling products?" -> intent: analytics, query_type: top_products
    - "Generate report and email to john@example.com" -> intent: multi_step, recipient: john@example.com
    - "How are users behaving?" -> intent: analytics, query_type: user_behavior
    - "Best performing brands" -> intent: analytics, query_type: brand_analysis
    - "Category performance" -> intent: analytics, query_type: category_performance
    `;
    
    const result = await this.model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up the response to extract JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse intent from Gemini response');
    }
    
    return JSON.parse(jsonMatch[0]);
  }

  /**
   * ✅ COMPLETE: Multi-step query handler
   * 
   * Handles queries like "Show revenue AND send report"
   * - Breaks down complex queries into sub-tasks
   * - Coordinates multiple agents in sequence
   * - Returns an ordered array of executed steps with outputs
   */
  async handleMultiStepQuery(userQuery: string) {
    const steps: any[] = [];
    const lower = userQuery.toLowerCase();
    
    // Extract intent signals
    const hasRevenue = /revenue|sales|income|earnings|money/.test(lower);
    const hasTopProducts = /top\s+products|best\s+sellers?|popular\s+items|trending/.test(lower);
    const hasUserBehavior = /user\s+behavior|customer\s+behavior|user\s+activity|engagement/.test(lower);
    const hasCategoryAnalysis = /categor(y|ies)|product\s+categories|category\s+performance/.test(lower);
    const hasBrandAnalysis = /brand(s)?|brand\s+performance|brand\s+analysis/.test(lower);
    const hasReport = /report|summary|generate|create\s+report/.test(lower);
    const recipientMatch = lower.match(/[\w.-]+@[\w.-]+\.[a-z]{2,}/);
    const recipient = recipientMatch?.[0];

    try {
      let analyticsResult: any;
      let queryType: string = '';
      
      // Step 1: Analytics query based on detected intent
      if (hasRevenue) {
        queryType = 'revenue';
      } else if (hasTopProducts) {
        queryType = 'top_products';
      } else if (hasUserBehavior) {
        queryType = 'user_behavior';
      } else if (hasCategoryAnalysis) {
        queryType = 'category_performance';
      } else if (hasBrandAnalysis) {
        queryType = 'brand_analysis';
      }
      
      if (queryType) {
        const analytics = new AnalyticsAgent();
        analyticsResult = await analytics.executeQuery(queryType);
        steps.push({ 
          step: 'analytics', 
          action: `${queryType}_query`,
          output: analyticsResult,
          status: 'completed'
        });
        
        // Step 2: Generate report if requested or if email is needed
        if (hasReport || recipient) {
          const geminiKey = process.env.GEMINI_API_KEY;
          if (!geminiKey) {
            throw new Error('GEMINI_API_KEY environment variable is required for report generation');
          }
          
          const reportAgent = new ReportAgent(geminiKey);
          
          // Determine report type based on query
          const reportType = hasRevenue || hasCategoryAnalysis || hasBrandAnalysis 
            ? 'financial' 
            : 'summary';
          
          let report: string;
          if (reportType === 'financial') {
            report = await reportAgent.generateFinancialReport(analyticsResult);
          } else {
            report = await reportAgent.generateReport(analyticsResult, 'summary');
          }
          
          steps.push({ 
            step: 'report', 
            action: `generate_${reportType}_report`,
            output: report,
            status: 'completed'
          });
          
          // Step 3: Send email if recipient is specified
          if (recipient) {
            const subjectMap: Record<string, string> = {
              revenue: 'Revenue Analysis Report',
              top_products: 'Top Products Performance Report',
              user_behavior: 'User Behavior Insights Report',
              category_performance: 'Category Performance Report',
              brand_analysis: 'Brand Analysis Report'
            };
            
            const subject = subjectMap[queryType] || 'Analytics Report';
            const emailSent = await reportAgent.sendEmail(recipient, subject, report);
            
            steps.push({ 
              step: 'email', 
              action: 'send_report',
              output: { 
                recipient, 
                subject,
                sent: emailSent,
                sandbox: true
              },
              status: emailSent ? 'completed' : 'failed'
            });
          }
        }
      }
      
      return {
        success: true,
        totalSteps: steps.length,
        steps
      };
    } catch (error) {
      steps.push({
        step: 'error',
        action: 'orchestration_failed',
        output: error instanceof Error ? error.message : 'Unknown error',
        status: 'failed'
      });
      
      return {
        success: false,
        totalSteps: steps.length,
        steps,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * ✅ COMPLETE: Route to appropriate agent
   */
  routeTask(intent: IntentResult): AgentType {
    if (intent.intent === 'analytics') return 'analytics';
    if (intent.intent === 'report') return 'report';
    if (intent.intent === 'email') return 'email';
    return 'unknown';
  }
}


