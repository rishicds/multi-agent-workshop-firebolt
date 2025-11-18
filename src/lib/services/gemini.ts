import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRateLimiter, withRetry } from '@/lib/utils/error-handler';
import { logger } from '@/lib/utils/logger';

// Get rate limit from env or default to 15 RPM (freemium tier)
const RPM_LIMIT = parseInt(process.env.GEMINI_RPM_LIMIT || '15', 10);
const limiter = createRateLimiter(RPM_LIMIT);

export type GeminiModel = 'gemini-2.0-flash' | 'gemini-2.5-flash';

export class GeminiService {
  private client: GoogleGenerativeAI;
  private rpmLimit: number;

  constructor(private apiKey: string) {
    if (!apiKey || apiKey === 'your_api_key_here') {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    this.client = new GoogleGenerativeAI(apiKey);
    this.rpmLimit = RPM_LIMIT;
    logger.info(`GeminiService initialized with ${this.rpmLimit} RPM limit`);
  }

  async generate(model: GeminiModel, prompt: string): Promise<string> {
    await limiter.removeToken();
    return withRetry(async () => {
      const gen = this.client.getGenerativeModel({ model });
      const res = await gen.generateContent(prompt);
      const text = res.response.text();
      return text;
    }, {
      onRetry: (attempt, error) => {
        logger.warn(`Gemini retry #${attempt}: ${String(error)}`);
      },
    });
  }

  /**
   * Shows an upgrade prompt message in UI contexts when we detect possible rate limiting.
   */
  static getUpgradeNote(): string {
    const currentLimit = parseInt(process.env.GEMINI_RPM_LIMIT || '15', 10);
    return `You may be hitting rate limits (${currentLimit} RPM). Consider upgrading your key in Google AI Studio for higher limits.`;
  }
}


