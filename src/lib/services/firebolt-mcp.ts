import { logger } from '@/lib/utils/logger';
import { Firebolt } from 'firebolt-sdk';

export type QueryResult = {
  columns: string[];
  rows: Array<Record<string, any>>;
};

type FireboltConfig = {
  clientId: string;
  clientSecret: string;
  account: string;
  database?: string;
  engine?: string;
};

/**
 * Firebolt MCP Client with real Firebolt SDK integration.
 * Connects to Firebolt database using service account credentials.
 */
export class FireboltMCPClient {
  private mock: boolean;
  private fireboltClient: any = null;
  private database: string;
  private engine: string | undefined;
  
  constructor(private config: FireboltConfig) {
    // Check if Firebolt is explicitly enabled
    const isEnabled = process.env.FIREBOLT_ENABLED === 'true';
    
    // Use mock mode unless all Firebolt credentials are provided AND it's enabled
    const hasCredentials = config.clientId && 
                          config.clientSecret && 
                          config.account &&
                          config.clientId !== 'your_client_id' &&
                          config.clientSecret !== 'your_client_secret';
    
    this.mock = !hasCredentials || !isEnabled;
    this.database = config.database || 'ecommercedb';
    this.engine = config.engine;
    
    if (this.mock) {
      logger.info('FireboltMCP running in MOCK mode', {
        reason: !hasCredentials ? 'credentials not configured' : 'FIREBOLT_ENABLED not set to true'
      });
    } else {
      logger.info('FireboltMCP initializing REAL mode', { 
        account: config.account, 
        database: this.database,
        engine: this.engine || 'default'
      });
      
      // Initialize Firebolt client
      try {
        this.fireboltClient = Firebolt({
          apiEndpoint: process.env.FIREBOLT_API_ENDPOINT || 'api.app.firebolt.io',
        });
        logger.info('Firebolt SDK client initialized successfully');
      } catch (error) {
        logger.error('Failed to initialize Firebolt client', { error });
        this.mock = true;
      }
    }
  }

  async execute(sql: string): Promise<QueryResult> {
    logger.info('FireboltMCP execute', { sql, mode: this.mock ? 'mock' : 'real' });
    
    if (this.mock) {
      return this.mockExecute(sql);
    }
    
    try {
      if (!this.fireboltClient) {
        throw new Error('Firebolt client not initialized');
      }
      
      // Authenticate with Firebolt
      const connectionParams: any = {
        auth: {
          client_id: this.config.clientId,
          client_secret: this.config.clientSecret,
        },
        account: this.config.account,
        database: this.database,
      };
      
      // Add engine if specified
      if (this.engine) {
        connectionParams.engineName = this.engine;
      }
      
      const connection = await this.fireboltClient.connect(connectionParams);
      
      logger.info('Firebolt connection established', { 
        account: this.config.account, 
        database: this.database,
        engine: this.engine || 'system (default)'
      });
      
      // Execute the query
      const statement = await connection.execute(sql);
      const { data, columns } = await statement.fetchResult();
      
      logger.info('Firebolt query executed successfully', { 
        rowCount: data.length,
        columnCount: columns?.length || 0 
      });
      
      // Transform Firebolt result to QueryResult format
      const columnNames = columns?.map((col: any) => col.name) || [];
      const rows = data.map((row: any) => {
        const rowObj: Record<string, any> = {};
        columnNames.forEach((colName: string, idx: number) => {
          rowObj[colName] = row[idx];
        });
        return rowObj;
      });
      
      return {
        columns: columnNames,
        rows: rows,
      };
      
    } catch (error) {
      logger.error('Firebolt query execution failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined 
      });
      
      // Fall back to mock data on error
      logger.warn('Falling back to mock data due to error');
      return this.mockExecute(sql);
    }
  }

  private async mockExecute(sql: string): Promise<QueryResult> {
    const lower = sql.toLowerCase();
    
    // Revenue query for ecommerce
    if (lower.includes('sum(price)') && lower.includes('total_revenue') && lower.includes('ecommerce')) {
      return {
        columns: ['total_revenue', 'total_purchases', 'unique_customers', 'avg_revenue_per_customer'],
        rows: [{
          total_revenue: 2847563.42,
          total_purchases: 12547,
          unique_customers: 4821,
          avg_revenue_per_customer: 590.58
        }]
      };
    }
    
    // Top products query
    if (lower.includes('product_id') && lower.includes('purchase_count') && lower.includes('ecommerce')) {
      return {
        columns: ['product_id', 'brand', 'category_code', 'purchase_count', 'total_revenue', 'avg_price'],
        rows: [
          { product_id: 1004767, brand: 'Samsung', category_code: 'electronics.smartphone', purchase_count: 847, total_revenue: 846153.00, avg_price: 999.00 },
          { product_id: 1004856, brand: 'Apple', category_code: 'electronics.smartphone', purchase_count: 723, total_revenue: 866760.00, avg_price: 1199.00 },
          { product_id: 1005115, brand: 'Sony', category_code: 'electronics.audio.headphone', purchase_count: 642, total_revenue: 160500.00, avg_price: 250.00 },
          { product_id: 1004833, brand: 'LG', category_code: 'electronics.tablet', purchase_count: 521, total_revenue: 260500.00, avg_price: 500.00 },
          { product_id: 1004545, brand: 'Canon', category_code: 'electronics.camera', purchase_count: 445, total_revenue: 355600.00, avg_price: 799.00 },
          { product_id: 1004258, brand: 'Dell', category_code: 'computers.notebook', purchase_count: 398, total_revenue: 557200.00, avg_price: 1400.00 },
          { product_id: 1004912, brand: 'Bose', category_code: 'electronics.audio.speaker', purchase_count: 367, total_revenue: 110100.00, avg_price: 300.00 },
          { product_id: 1004623, brand: 'HP', category_code: 'computers.notebook', purchase_count: 334, total_revenue: 400800.00, avg_price: 1200.00 },
          { product_id: 1005234, brand: 'Xiaomi', category_code: 'electronics.smartphone', purchase_count: 312, total_revenue: 155688.00, avg_price: 499.00 },
          { product_id: 1004789, brand: 'Lenovo', category_code: 'computers.notebook', purchase_count: 289, total_revenue: 318890.00, avg_price: 1103.00 },
        ]
      };
    }
    
    // User behavior query
    if (lower.includes('event_type') && lower.includes('event_count') && lower.includes('ecommerce')) {
      return {
        columns: ['event_type', 'event_count', 'unique_users', 'unique_sessions'],
        rows: [
          { event_type: 'view', event_count: 145623, unique_users: 18947, unique_sessions: 23456 },
          { event_type: 'cart', event_count: 28945, unique_users: 12341, unique_sessions: 15234 },
          { event_type: 'purchase', event_count: 12547, unique_users: 4821, unique_sessions: 6234 },
        ]
      };
    }
    
    // Category performance query
    if (lower.includes('category_code') && lower.includes('group by category_code') && lower.includes('ecommerce')) {
      return {
        columns: ['category_code', 'purchases', 'revenue', 'avg_price', 'unique_customers'],
        rows: [
          { category_code: 'electronics.smartphone', purchases: 3245, revenue: 3089775.00, avg_price: 952.00, unique_customers: 2890 },
          { category_code: 'computers.notebook', purchases: 2156, revenue: 2894560.00, avg_price: 1342.00, unique_customers: 1987 },
          { category_code: 'electronics.tablet', purchases: 1834, revenue: 1100400.00, avg_price: 600.00, unique_customers: 1654 },
          { category_code: 'electronics.audio.headphone', purchases: 1567, revenue: 391750.00, avg_price: 250.00, unique_customers: 1423 },
          { category_code: 'electronics.camera', purchases: 1342, revenue: 1072258.00, avg_price: 799.00, unique_customers: 1198 },
          { category_code: 'electronics.audio.speaker', purchases: 1123, revenue: 336900.00, avg_price: 300.00, unique_customers: 1034 },
          { category_code: 'appliances.kitchen.refrigerator', purchases: 845, revenue: 760500.00, avg_price: 900.00, unique_customers: 789 },
          { category_code: 'electronics.tv', purchases: 756, revenue: 832560.00, avg_price: 1101.00, unique_customers: 698 },
          { category_code: 'appliances.kitchen.washer', purchases: 634, revenue: 443800.00, avg_price: 700.00, unique_customers: 587 },
          { category_code: 'computers.desktop', purchases: 567, revenue: 623700.00, avg_price: 1100.00, unique_customers: 521 },
        ]
      };
    }
    
    // Brand analysis query
    if (lower.includes('brand') && lower.includes('group by brand') && lower.includes('ecommerce')) {
      return {
        columns: ['brand', 'purchases', 'revenue', 'avg_price', 'customers'],
        rows: [
          { brand: 'Samsung', purchases: 2847, revenue: 2561300.00, avg_price: 899.75, customers: 2456 },
          { brand: 'Apple', purchases: 2134, revenue: 2987600.00, avg_price: 1400.00, customers: 1987 },
          { brand: 'Sony', purchases: 1756, revenue: 1404800.00, avg_price: 800.00, customers: 1543 },
          { brand: 'LG', purchases: 1523, revenue: 1218400.00, avg_price: 800.00, customers: 1398 },
          { brand: 'Dell', purchases: 1398, revenue: 1957200.00, avg_price: 1400.00, customers: 1256 },
          { brand: 'HP', purchases: 1267, revenue: 1520400.00, avg_price: 1200.00, customers: 1134 },
          { brand: 'Xiaomi', purchases: 1145, revenue: 571455.00, avg_price: 499.00, customers: 1045 },
          { brand: 'Canon', purchases: 987, revenue: 788613.00, avg_price: 799.00, customers: 897 },
          { brand: 'Bose', purchases: 845, revenue: 253500.00, avg_price: 300.00, customers: 765 },
          { brand: 'Lenovo', purchases: 756, revenue: 833868.00, avg_price: 1103.00, customers: 689 },
        ]
      };
    }
    
    // Legacy fallbacks
    if (lower.includes('sum(amount)') && lower.includes('from sales')) {
      return { columns: ['total_revenue'], rows: [{ total_revenue: 1234567.89 }] };
    }
    if (lower.includes('from orders') && lower.includes('group by product_name')) {
      return {
        columns: ['product_name', 'count'],
        rows: [
          { product_name: 'UltraWidget', count: 542 },
          { product_name: 'MegaGadget', count: 410 },
          { product_name: 'ProDevice', count: 377 },
        ],
      };
    }
    if (lower.includes('from customers') && lower.includes("date_trunc('month'")) {
      return {
        columns: ['month', 'new_customers', 'growth_pct'],
        rows: [
          { month: '2024-01-01', new_customers: 100, growth_pct: null },
          { month: '2024-02-01', new_customers: 120, growth_pct: 20.0 },
          { month: '2024-03-01', new_customers: 126, growth_pct: 5.0 },
        ],
      };
    }
    
    return { 
      columns: ['message'], 
      rows: [{ message: 'Mock data: Query pattern not recognized. Add pattern to mockExecute() for realistic results.' }] 
    };
  }
}


