# Ecommerce Schema Integration Updates

## Overview
Updated the multi-agent workshop to work with the Firebolt ecommerce database schema.

## Database Schema
```sql
"ecommerce" (
  "event_time" TIMESTAMPTZ NOT NULL,
  "event_type" TEXT NOT NULL,
  "product_id" BIGINT NOT NULL,
  "category_id" TEXT NULL,
  "category_code" TEXT NULL,
  "brand" TEXT NULL,
  "price" NUMERIC(38, 9) NULL,
  "user_id" TEXT NULL,
  "user_session" TEXT NULL
)
```

## Updated Components

### 1. Analytics Agent (`src/lib/agents/analytics.ts`)

#### New Query Types
- **`revenue`** - Comprehensive revenue analysis with:
  - Total revenue (30-day window)
  - Total purchases
  - Unique customers
  - Average revenue per customer

- **`top_products`** - Product performance metrics:
  - Product ID, brand, category
  - Purchase count
  - Total revenue
  - Average price
  - Top 10 by purchase count

- **`user_behavior`** - User engagement analysis:
  - Event type breakdown
  - Event counts
  - Unique users per event type
  - Unique sessions
  - 7-day window

- **`category_performance`** - Category-level insights:
  - Purchases and revenue by category
  - Average price
  - Unique customers
  - Top 10 categories

- **`brand_analysis`** - Brand performance:
  - Purchases and revenue by brand
  - Average price
  - Customer count
  - Top 10 brands

#### Enhanced Methods
- **`getCustomerGrowth()`** - Updated for ecommerce schema:
  - Tracks unique purchasers by month
  - Calculates month-over-month growth percentage
  - 12-month historical view

- **`getConversionFunnel()`** - NEW method:
  - Tracks view → cart → purchase funnel
  - Calculates conversion rates at each stage
  - Overall conversion rate
  - 30-day analysis window

- **`getRevenueTimeSeries()`** - NEW method:
  - Time-series revenue analysis
  - Configurable intervals (day/week/month)
  - Revenue, transactions, customer counts
  - Average order value
  - Period-over-period growth rates
  - 90-day window

- **`optimizeQuery()`** - Updated optimization plan:
  - Ecommerce-specific partitioning strategies
  - Materialized views for daily revenue and product performance
  - Comprehensive indexing strategy (event_time, event_type, user_id, product_id, category, brand)
  - Composite indexes for common filter combinations

### 2. Orchestrator Agent (`src/lib/agents/orchestrator.ts`)

#### Enhanced Intent Parsing
- **`parseIntent()`** - Updated with ecommerce context:
  - Recognizes all new query types
  - Better prompt engineering for ecommerce use cases
  - Improved JSON extraction with error handling
  - Example-driven prompting

#### Multi-Step Query Handling
- **`handleMultiStepQuery()`** - Enhanced capabilities:
  - Supports all 5 query types (revenue, top_products, user_behavior, category_performance, brand_analysis)
  - Intelligent report type selection (financial vs summary)
  - Query-specific email subjects
  - Better regex patterns for intent detection
  - Improved error handling and status tracking

### 3. Report Agent (`src/lib/agents/report.ts`)

#### Enhanced Report Generation
- **`generateReport()`** - Ecommerce-aware reports:
  - Context about ecommerce data sources
  - Product, brand, and user behavior focus
  - Actionable insights emphasis
  - Comparative analysis
  - Increased length (250-300 words)

- **`generateFinancialReport()`** - Improved for ecommerce:
  - Executive summary with period context
  - Ecommerce-specific metrics (AOV, conversion rates, revenue per customer)
  - Product/category/brand performance insights
  - Customer engagement analysis
  - Time-based trend detection
  - Strategic recommendations for growth
  - 500-600 word comprehensive analysis

- **`generateEcommerceInsights()`** - NEW method:
  - Revenue optimization strategies
  - Customer behavior patterns
  - Product performance analysis
  - Actionable business recommendations
  - Inventory and marketing guidance

### 4. API Routes

#### Orchestrator API (`src/app/api/orchestrator/route.ts`)
- Added support for `action` parameter:
  - `action: 'parse'` - Intent parsing only (default)
  - `action: 'execute'` or `action: 'multi_step'` - Execute full multi-step query
- Returns different response formats based on action

## Example Queries

### Revenue Analysis
```
"Show me revenue for the last 30 days"
```
Returns: Total revenue, purchases, customers, revenue per customer

### Product Performance
```
"What are our top selling products?"
```
Returns: Top 10 products with sales count, revenue, avg price

### Multi-Step Query
```
"Show revenue and send report to manager@company.com"
```
Executes:
1. Revenue query
2. Financial report generation
3. Email delivery (sandbox mode)

### Customer Behavior
```
"How are users behaving on our site?"
```
Returns: Event type breakdown with user and session counts

### Category Analysis
```
"Which product categories are performing best?"
```
Returns: Top 10 categories with revenue, purchases, customers

### Brand Performance
```
"Analyze brand performance"
```
Returns: Top 10 brands with sales metrics

## Query Patterns Supported

The orchestrator now recognizes these patterns:
- Revenue: `revenue|sales|income|earnings|money`
- Products: `top products|best sellers|popular items|trending`
- Behavior: `user behavior|customer behavior|user activity|engagement`
- Categories: `category|categories|product categories|category performance`
- Brands: `brand|brands|brand performance|brand analysis`
- Reports: `report|summary|generate|create report`
- Email: Automatically detects email addresses

## Performance Optimizations

### Recommended Firebolt Optimizations
1. **Partitioning**: `PARTITION BY DATE_TRUNC('day', event_time)`
2. **Indexes**:
   - `event_time` (date filtering)
   - `event_type` (event filtering)
   - `user_id` (user analysis)
   - `product_id` (product queries)
   - `category_code`, `brand` (grouping)
3. **Materialized Views**:
   - `daily_revenue_summary` - Pre-aggregated daily metrics
   - `product_performance_summary` - Pre-computed product stats
4. **Composite Indexes**: For common query patterns

## Testing

### Test the Analytics Agent
```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"queryType": "revenue"}'
```

### Test the Orchestrator
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue and top products", "action": "execute"}'
```

### Test Multi-Step with Email
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show revenue and send report to alice@example.com", "action": "execute"}'
```

## Workshop Integration

The workshop steps (04-orchestrator.mdx, 05-report.mdx, 06-integration.mdx) remain compatible. Students can now:
- Work with real ecommerce data
- Build more sophisticated analytics queries
- Generate industry-relevant reports
- Practice with realistic multi-agent scenarios

## Next Steps

1. **Data Loading**: Load sample ecommerce data into Firebolt
2. **Frontend Updates**: Update UI components to display new metrics
3. **Caching**: Implement caching for frequent queries
4. **Monitoring**: Add query performance tracking
5. **Advanced Analytics**: Add cohort analysis, retention metrics, RFM segmentation
