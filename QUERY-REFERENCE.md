# Ecommerce Analytics Query Reference

Quick reference for all available analytics queries and their outputs.

## Database Schema

The `ecommerce` table is a **Firebolt FACT TABLE** optimized for analytical queries:

```sql
CREATE FACT TABLE ecommerce (
  event_time     TIMESTAMPTZ NOT NULL,    -- When the event occurred (PRIMARY INDEX)
  event_type     TEXT NOT NULL,           -- 'view', 'cart', or 'purchase'
  product_id     BIGINT NOT NULL,         -- Unique product identifier
  category_id    TEXT NULL,               -- Category identifier (optional)
  category_code  TEXT NULL,               -- Category path (e.g., 'electronics.smartphone')
  brand          TEXT NULL,               -- Product brand (optional)
  price          NUMERIC(38, 9) NULL,     -- Product price (NULL for view events)
  user_id        TEXT NULL,               -- Unique user identifier (optional)
  user_session   TEXT NULL                -- Session identifier (optional)
)
PRIMARY INDEX event_time;
```

**FACT TABLE Benefits**:
- ✅ Automatic sparse indexing on ALL columns (no manual creation!)
- ✅ Fast partition pruning for time-based queries
- ✅ Optimized columnar compression
- ✅ Best for append-only analytical workloads

**Important**: Always use `IS NOT NULL` filters on nullable fields (brand, category_code, user_id, price) to avoid empty result groups.

## Available Query Types

### 1. Revenue Analysis (`revenue`)

**What it does**: Analyzes revenue and customer metrics over the last 30 days.

**Sample Query**:
```typescript
await analytics.executeQuery('revenue');
```

**Natural Language Examples**:
- "Show me revenue"
- "What's our total sales?"
- "Revenue analysis for last month"
- "How much money did we make?"

**Output Schema**:
```typescript
{
  total_revenue: number,
  total_purchases: number,
  unique_customers: number,
  avg_revenue_per_customer: number
}
```

**SQL**:
```sql
SELECT 
  SUM(price) as total_revenue,
  COUNT(*) as total_purchases,
  COUNT(DISTINCT user_id) as unique_customers,
  ROUND(SUM(price) / NULLIF(COUNT(DISTINCT user_id), 0), 2) as avg_revenue_per_customer
FROM public.ecommerce 
WHERE event_type = 'purchase' 
AND event_time > CURRENT_DATE - INTERVAL '30 days'
```

**Note**: Uses `NULLIF` to prevent divide-by-zero errors when calculating averages.

---

### 2. Top Products (`top_products`)

**What it does**: Identifies best-selling products by purchase count.

**Sample Query**:
```typescript
await analytics.executeQuery('top_products');
```

**Natural Language Examples**:
- "Top selling products"
- "Best sellers"
- "Popular items"
- "What products are trending?"

**Output Schema**:
```typescript
Array<{
  product_id: number,
  brand: string,
  category_code: string,
  purchase_count: number,
  total_revenue: number,
  avg_price: number
}>
```

**SQL**:
```sql
SELECT 
  product_id,
  brand,
  category_code,
  COUNT(*) as purchase_count,
  SUM(price) as total_revenue,
  ROUND(AVG(price), 2) as avg_price
FROM public.ecommerce 
WHERE event_type = 'purchase'
AND event_time > CURRENT_DATE - INTERVAL '30 days'
GROUP BY product_id, brand, category_code
ORDER BY purchase_count DESC 
LIMIT 10
```

**Note**: May include rows with NULL brand or category_code. Filter with `AND brand IS NOT NULL` if needed.

---

### 3. User Behavior (`user_behavior`)

**What it does**: Breaks down user activity by event type over the last 7 days.

**Sample Query**:
```typescript
await analytics.executeQuery('user_behavior');
```

**Natural Language Examples**:
- "User behavior analysis"
- "How are customers engaging?"
- "User activity report"
- "Customer behavior patterns"

**Output Schema**:
```typescript
Array<{
  event_type: string,
  event_count: number,
  unique_users: number,
  unique_sessions: number
}>
```

**SQL**:
```sql
SELECT 
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT user_session) as unique_sessions
FROM public.ecommerce
WHERE event_time > CURRENT_DATE - INTERVAL '7 days'
GROUP BY event_type
ORDER BY event_count DESC
```

**Note**: `user_id` and `user_session` are nullable, so distinct counts may be lower than total events.

---

### 4. Category Performance (`category_performance`)

**What it does**: Analyzes sales and revenue by product category.

**Sample Query**:
```typescript
await analytics.executeQuery('category_performance');
```

**Natural Language Examples**:
- "Category performance"
- "Which categories sell best?"
- "Product category analysis"
- "Top performing categories"

**Output Schema**:
```typescript
Array<{
  category_code: string,
  purchases: number,
  revenue: number,
  avg_price: number,
  unique_customers: number
}>
```

**SQL**:
```sql
SELECT 
  category_code,
  COUNT(*) as purchases,
  SUM(price) as revenue,
  ROUND(AVG(price), 2) as avg_price,
  COUNT(DISTINCT user_id) as unique_customers
FROM public.ecommerce
WHERE event_type = 'purchase'
AND category_code IS NOT NULL  -- Filter NULL categories
AND event_time > CURRENT_DATE - INTERVAL '30 days'
GROUP BY category_code
ORDER BY revenue DESC
LIMIT 10
```

**Note**: `IS NOT NULL` filter prevents NULL category_code from appearing in results.

---

### 5. Brand Analysis (`brand_analysis`)

**What it does**: Compares brand performance across purchases.

**Sample Query**:
```typescript
await analytics.executeQuery('brand_analysis');
```

**Natural Language Examples**:
- "Brand performance"
- "Best performing brands"
- "Brand analysis"
- "Which brands are selling?"

**Output Schema**:
```typescript
Array<{
  brand: string,
  purchases: number,
  revenue: number,
  avg_price: number,
  customers: number
}>
```

**SQL**:
```sql
SELECT 
  brand,
  COUNT(*) as purchases,
  SUM(price) as revenue,
  ROUND(AVG(price), 2) as avg_price,
  COUNT(DISTINCT user_id) as customers
FROM public.ecommerce
WHERE event_type = 'purchase'
AND brand IS NOT NULL  -- Filter NULL brands
AND event_time > CURRENT_DATE - INTERVAL '30 days'
GROUP BY brand
ORDER BY revenue DESC
LIMIT 10
```

**Note**: `IS NOT NULL` filter prevents NULL brand from appearing in results.

---

## Advanced Methods

### Customer Growth Analysis

**What it does**: Month-over-month customer growth with percentage changes.

**Sample Query**:
```typescript
await analytics.getCustomerGrowth();
```

**Output Schema**:
```typescript
Array<{
  month: Date,
  new_customers: number,
  prev_month_customers: number,
  growth_pct: number
}>
```

---

### Conversion Funnel

**What it does**: Tracks conversion rates through the purchase funnel.

**Sample Query**:
```typescript
await analytics.getConversionFunnel();
```

**Output Schema**:
```typescript
{
  total_views: number,
  total_cart_adds: number,
  total_purchases: number,
  view_to_cart_rate: number,
  cart_to_purchase_rate: number,
  overall_conversion_rate: number
}
```

---

### Revenue Time Series

**What it does**: Revenue trends over time with growth metrics.

**Sample Query**:
```typescript
await analytics.getRevenueTimeSeries('day'); // or 'week', 'month'
```

**Output Schema**:
```typescript
Array<{
  period: Date,
  revenue: number,
  transactions: number,
  customers: number,
  avg_order_value: number,
  prev_period_revenue: number,
  revenue_growth_pct: number
}>
```

---

## Multi-Step Queries

The orchestrator can handle complex queries that combine multiple steps:

### Example 1: Revenue + Report + Email
```
"Show revenue and send report to manager@company.com"
```

**Execution Steps**:
1. Run revenue query
2. Generate financial report
3. Send email (sandbox mode)

### Example 2: Multiple Analytics
```
"Show top products and category performance"
```

**Execution Steps**:
1. Run top_products query
2. Run category_performance query
3. Generate combined report

---

## Report Types

### Summary Report
- **Length**: 250-300 words
- **Format**: Executive summary with key insights
- **Use for**: Quick overviews, email updates
- **Generated by**: `reportAgent.generateReport(data, 'summary')`

### Financial Report
- **Length**: 500-600 words
- **Format**: 4-section structured report
  1. Executive Summary
  2. Key Metrics (bullets)
  3. Trends Analysis
  4. Recommendations
- **Use for**: Revenue, category, brand analysis
- **Generated by**: `reportAgent.generateFinancialReport(data)`

### Ecommerce Insights Report
- **Length**: ~400 words
- **Format**: Strategic business insights
- **Sections**:
  1. Revenue Optimization
  2. Customer Behavior
  3. Product Performance
  4. Actionable Recommendations
- **Generated by**: `reportAgent.generateEcommerceInsights(data)`

---

## API Usage Examples

### Direct Analytics Query
```bash
curl -X POST http://localhost:3000/api/analytics \
  -H "Content-Type: application/json" \
  -d '{"queryType": "revenue"}'
```

### Orchestrator - Parse Intent Only
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{"query": "Show me revenue"}'
```

### Orchestrator - Execute Multi-Step
```bash
curl -X POST http://localhost:3000/api/orchestrator \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Show revenue and send report to alice@example.com",
    "action": "execute"
  }'
```

### Generate Report
```bash
curl -X POST http://localhost:3000/api/report \
  -H "Content-Type: application/json" \
  -d '{
    "data": {"total_revenue": 123456, "total_purchases": 542},
    "reportType": "summary",
    "recipient": "manager@company.com",
    "subject": "Weekly Revenue Report"
  }'
```

---

## Time Windows

All queries use recent data windows optimized for performance:

- **Revenue**: Last 30 days
- **Top Products**: Last 30 days
- **User Behavior**: Last 7 days
- **Category Performance**: Last 30 days
- **Brand Analysis**: Last 30 days
- **Customer Growth**: Last 12 months
- **Conversion Funnel**: Last 30 days
- **Revenue Time Series**: Last 90 days

---

## Event Types

The ecommerce schema supports these event types (NOT NULL constraint):
- `view` - Product page views (price may be NULL)
- `cart` - Add to cart events
- `purchase` - Completed purchases (price should not be NULL)

**Field Behavior by Event Type**:
| Field | view | cart | purchase |
|-------|------|------|----------|
| event_time | ✅ NOT NULL | ✅ NOT NULL | ✅ NOT NULL |
| event_type | ✅ NOT NULL | ✅ NOT NULL | ✅ NOT NULL |
| product_id | ✅ NOT NULL | ✅ NOT NULL | ✅ NOT NULL |
| price | ⚠️ May be NULL | ✅ Usually set | ✅ Usually set |
| user_id | ⚠️ May be NULL (anonymous) | ⚠️ May be NULL | ⚠️ May be NULL |
| brand | ⚠️ May be NULL | ⚠️ May be NULL | ⚠️ May be NULL |
| category_code | ⚠️ May be NULL | ⚠️ May be NULL | ⚠️ May be NULL |

---

## Best Practices

1. **Use specific query types** for focused analysis
2. **Combine queries** for comprehensive insights
3. **Request financial reports** for revenue/category/brand data
4. **Use summary reports** for quick updates
5. **Include email recipients** for automated distribution
6. **Monitor conversion funnels** for optimization opportunities
7. **Track time series** for trend analysis

### NULL Handling Best Practices

**✅ GOOD: Filter NULL values before grouping**
```sql
SELECT brand, COUNT(*) as purchases
FROM public.ecommerce
WHERE brand IS NOT NULL  -- Prevents NULL in results
  AND event_type = 'purchase'
GROUP BY brand;
```

**❌ BAD: NULL values create empty groups**
```sql
SELECT brand, COUNT(*) as purchases
FROM public.ecommerce
WHERE event_type = 'purchase'
GROUP BY brand;  -- Includes NULL brand rows!
```

**Always use NULLIF for division**
```sql
-- ✅ GOOD: Prevents divide-by-zero
ROUND(SUM(price) / NULLIF(COUNT(DISTINCT user_id), 0), 2)

-- ❌ BAD: Can cause errors
ROUND(SUM(price) / COUNT(DISTINCT user_id), 2)
```

### FACT TABLE Query Optimization

- Leverage automatic sparse indexing (no manual indexes needed!)
- Use time-based filters to enable partition pruning
- Create aggregating indexes for frequently-run dashboard queries
- Filter NULL fields early to reduce result set size
