import { GoogleGenerativeAI } from '@google/generative-ai';
import { GmailClient } from '@/lib/services/gmail';

export class ReportAgent {
  private model: any;
  private gmailClient: GmailClient;

  constructor(apiKey: string) {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('Valid GEMINI_API_KEY is required for ReportAgent');
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    this.model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    this.gmailClient = new GmailClient();
  }

  /**
   * ✅ COMPLETE: Generate basic summary
   */
  async generateReport(data: any, reportType: 'summary' | 'detailed' = 'summary'): Promise<string> {
    const prompt = `
    Create a professional ${reportType} ecommerce analytics report from this data:
    ${JSON.stringify(data, null, 2)}
    
    Data Context - This is from an ecommerce platform that tracks:
    - Purchase transactions with pricing information
    - Product details (product_id, brand, category_code)
    - Customer behavior (user_id, user_session)
    - Event types: 'view' (browsing), 'cart' (add to cart), 'purchase' (completed sale)
    
    The data includes:
    - Revenue metrics (total_revenue, avg_revenue_per_customer)
    - Transaction counts (total_purchases, unique_customers)
    - Product performance (purchase_count, by brand/category)
    - Customer engagement (event_count, unique_users, sessions)
    
    Format: Executive summary with key insights and metrics
    Length: ~250-300 words
    Style: Professional, data-driven, actionable
    
    Include:
    1. Key Performance Indicators (KPIs)
       - Present actual numbers from the data
       - Explain what each metric means for the business
    
    2. Notable Trends or Patterns
       - Identify top performers (products, categories, brands)
       - Note customer engagement patterns
       - Highlight conversion or behavioral insights
    
    3. Comparative Insights (if data allows)
       - Compare top vs. bottom performers
       - Revenue concentration analysis
       - Customer value distribution
    
    4. Brief Recommendations
       - 2-3 actionable suggestions based on the data
       - Focus on revenue optimization or customer retention
    
    Note: If the data appears empty or has null values, acknowledge this and suggest data collection improvements.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * ✅ COMPLETE: Custom financial report template
   * 
   * Creates a financial report template with:
   * 1. Executive Summary
   * 2. Key Metrics (bullet points)
   * 3. Trends Analysis
   * 4. Recommendations
   */
  async generateFinancialReport(data: any): Promise<string> {
    const prompt = `
    Using this ecommerce financial data, create a comprehensive financial report with the following structure:
    
    DATA CONTEXT:
    This is real ecommerce transaction data from a Firebolt analytics database with the following schema:
    - event_time: timestamp of customer interactions
    - event_type: 'view', 'cart', or 'purchase' events
    - product_id: unique product identifier
    - category_code: product category (e.g., electronics.smartphone, apparel.shoes)
    - brand: product brand name
    - price: transaction amount (only for 'purchase' events, null otherwise)
    - user_id: unique customer identifier
    - user_session: session tracking ID
    
    ACTUAL DATA:
    ${JSON.stringify(data, null, 2)}
    
    REPORT STRUCTURE:
    
    1. EXECUTIVE SUMMARY (3-4 sentences)
       - Overview of key findings from the data
       - Overall business health assessment
       - Time period covered (check period_start/period_end if available, or note "all-time data")
       - Most significant insight or achievement
    
    2. KEY METRICS (bullet points with actual numbers)
       Revenue Metrics:
       - Total Revenue: [extract total_revenue from data]
       - Total Transactions/Purchases: [extract total_purchases or purchase_count]
       - Average Order Value (AOV): [calculate or extract avg_price]
       
       Customer Metrics:
       - Unique Customers: [extract unique_customers or customers]
       - Revenue per Customer: [extract avg_revenue_per_customer]
       - Customer Engagement: [extract unique_users, unique_sessions if available]
       
       Product/Category Performance:
       - Top Product/Category/Brand: [identify highest performer from data]
       - Performance Distribution: [note concentration or spread]
       
       Growth Indicators:
       - Growth rates: [extract growth_pct, revenue_growth_pct if available]
       - Trends: [note any period-over-period changes]
    
    3. TRENDS ANALYSIS (detailed insights)
       Purchasing Patterns:
       - Event distribution (view vs cart vs purchase if available)
       - Conversion signals (view_to_cart_rate, cart_to_purchase_rate if present)
       
       Product Performance:
       - Top performing products/categories/brands by revenue
       - Average prices and their implications
       - Volume leaders (high purchase_count products)
       
       Customer Behavior:
       - User engagement levels (event_count, unique_sessions)
       - Session quality indicators
       - Repeat purchase signals if detectable
       
       Time-Based Patterns:
       - Seasonal trends if time-series data is present
       - Month-over-month or period-over-period changes
       - Growth trajectory assessment
       
       Standout Observations:
       - Any significant anomalies or exceptional performers
       - Underperforming segments that need attention
    
    4. RECOMMENDATIONS (actionable strategies)
       Revenue Optimization:
       - Upsell/cross-sell opportunities based on top products
       - Pricing strategies suggested by avg_price analysis
       - Product mix adjustments
       
       Customer Acquisition & Retention:
       - Strategies to improve conversion rates
       - Customer value maximization tactics
       - Engagement improvement suggestions
       
       Product & Inventory:
       - Focus areas based on category/brand performance
       - Stock optimization for top sellers
       - Underperformer management
       
       Risk Mitigation:
       - Address declining metrics if present
       - Diversification suggestions if revenue is concentrated
       - Data quality improvements if gaps exist
    
    FORMATTING GUIDELINES:
    - Use clear headings with markdown formatting (## for sections, ### for subsections)
    - Present metrics as bullet points with actual values
    - Use bold for important numbers (**$123,456**)
    - Include percentages rounded to 2 decimal places
    - If data is missing or null, note it explicitly and suggest data collection
    - Keep tone professional, analytical, and solution-oriented
    
    LENGTH: Comprehensive but focused (~600-700 words)
    STYLE: Executive-level, data-driven, confident
    
    IMPORTANT: Base ALL analysis on the actual data provided. Don't invent numbers or make assumptions beyond what the data shows.
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }

  /**
   * ✅ COMPLETE: Email delivery with error handling
   * 
   * Sends email via Gmail API
   * - Includes sandbox mode for development
   * - Proper error handling
   * - Formatted email body
   */
  async sendEmail(recipient: string, subject: string, body: string): Promise<boolean> {
    try {
      // Send via Gmail client (it handles sandbox vs real mode internally)
      const result = await this.gmailClient.send({ 
        recipient, 
        subject, 
        body 
      });
      
      if (result) {
        console.log('✅ Email sent successfully');
      } else {
        console.log('⚠️ Email send returned false (check logs for details)');
      }
      
      return result;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      return false;
    }
  }

  /**
   * Generate ecommerce-specific insights report
   * Analyzes product, category, and customer behavior patterns
   */
  async generateEcommerceInsights(data: any): Promise<string> {
    const prompt = `
    Analyze this ecommerce data and provide strategic business insights:
    
    DATA SOURCE: Firebolt ecommerce analytics database
    Schema includes:
    - event_time, event_type ('view'/'cart'/'purchase')
    - product_id, category_code, brand
    - price (for purchase events)
    - user_id, user_session
    
    ACTUAL DATA:
    ${JSON.stringify(data, null, 2)}
    
    ANALYSIS FRAMEWORK:
    
    1. Revenue Optimization
       - Identify high-value products and categories from the data
       - Analyze pricing opportunities (avg_price, price ranges)
       - Suggest cross-sell and upsell potential based on product/category combinations
       - Revenue concentration analysis (top performers vs long tail)
    
    2. Customer Behavior
       - Purchase patterns from event_count and unique_users
       - Customer segmentation opportunities (high-value vs casual buyers)
       - Engagement signals from user_session data
       - Retention indicators (if growth_pct or repeat metrics present)
    
    3. Product Performance
       - Top performers (by purchase_count, total_revenue)
       - Bottom performers needing attention
       - Category trends and opportunities
       - Brand positioning and market share
    
    4. Actionable Recommendations
       - Inventory management strategies (stock top sellers)
       - Marketing focus areas (promote high-margin or trending items)
       - Product development opportunities (gaps in category/brand offerings)
       - Customer acquisition strategies (optimize conversion funnel)
       - Data-driven pricing adjustments
    
    Format: Clear sections with markdown headings (##) and bullet points
    Style: Strategic, executive-level, actionable
    Length: ~400-500 words
    
    IMPORTANT: 
    - Base insights on ACTUAL data provided, not assumptions
    - If data is limited or null, note it and suggest data collection needs
    - Focus on actionable recommendations that can drive business growth
    `;

    const result = await this.model.generateContent(prompt);
    return result.response.text();
  }
}

// Report Templates for different types of reports
const REPORT_TEMPLATES = {
  executive: `
# Executive Report

## Overview
{overview}

## Key Findings
{findings}

## Strategic Recommendations
{recommendations}
`,
  technical: `
# Technical Analysis Report

## Data Summary
{summary}

## Detailed Metrics
{metrics}

## Technical Insights
{insights}

## Next Steps
{next_steps}
`,
  financial: `
# Financial Report

## Executive Summary
{executive_summary}

## Key Metrics
{key_metrics}

## Trends Analysis
{trends}

## Recommendations
{recommendations}
`
};


