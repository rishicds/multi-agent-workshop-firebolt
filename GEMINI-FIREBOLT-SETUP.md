# Connect Gemini (MCP Client) to Your Firebolt Workspace

## Overview

This guide will help you set up a complete natural language to SQL pipeline:

**User asks question in natural language** → **Gemini converts to SQL** → **Firebolt executes query** → **Results return** → **User can send results via Gmail using Gemini**

## Quick Reference

| What You Need | Where to Get It | Required? |
|--------------|----------------|-----------|
| Gemini API Key | [Google AI Studio](https://aistudio.google.com) | ✅ Yes |
| Node.js 18+ | [nodejs.org](https://nodejs.org) | ✅ Yes |
| Project Code | Clone from GitHub | ✅ Yes |
| Firebolt Credentials | [firebolt.io](https://firebolt.io) | ⚠️ Optional (uses mock in dev) |
| Gmail OAuth2 | [Google Cloud Console](https://console.cloud.google.com) | ⚠️ Optional (sandbox in dev) |

### Automated Setup (Windows)

Run this PowerShell script for automated setup:

```powershell
.\setup.ps1
```

### Manual Setup

Follow the steps below for manual configuration.

---

## Step 1: Create a Gemini API Key

### 1.1 Navigate to Google AI Studio

Go to: [https://aistudio.google.com](https://aistudio.google.com)

### 1.2 Generate API Key

1. Click on **API keys** in the left sidebar
2. Click **Create API Key**
3. Select **"Create API key in new project"** or choose an existing project
4. Copy the generated API key
5. **Important:** Store this key securely - you'll add it to your environment variables

### 1.3 Select Model

For this workshop, we recommend:
- **Gemini 2.0 Flash** (fastest, best for real-time demos)
- **Gemini 1.5 Flash** (fallback option, also fast and efficient)

> **Note:** The free tier includes 15 requests per minute (RPM). Our code includes rate limiting to stay within these bounds.

---

## Step 2: Install the MCP + Firebolt + Gmail Dependencies

### 2.1 Prerequisites

Before starting, ensure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** or **pnpm** package manager
- **Git** for cloning the repository

### 2.2 Clone the Project

```bash
# Clone the repository
git clone https://github.com/DevRelSquad/multi-agent-workshop-firebolt.git

# Navigate into the project directory
cd multi-agent-workshop-firebolt
```

### 2.3 Install Dependencies

This project uses npm. Install all required packages:

```bash
npm install
```

The following key dependencies are already configured in `package.json`:

- **@google/generative-ai** - Official Google Gemini SDK
- **next** - Next.js framework (includes React)
- **lucide-react** - Icon library
- **@radix-ui/react-tabs** - UI components
- **react-syntax-highlighter** - Code display
- **next-mdx-remote** - MDX content rendering

### 2.4 Additional Dependencies (Optional)

If you plan to implement real Firebolt MCP server connection or Gmail API:

```bash
# For Firebolt SDK (if using real Firebolt connection)
npm install firebolt-sdk

# For Gmail API (if implementing OAuth2)
npm install googleapis google-auth-library

# For MCP protocol (if implementing real MCP transport)
npm install @modelcontextprotocol/sdk
```

> **Note:** The workshop uses mock implementations by default, so these are optional unless you're building production features.

---

## Step 3: Configure Environment Variables

### 3.1 Create Environment File

Create a `.env.local` file in the project root:

```bash
# On Windows PowerShell
New-Item -Path .env.local -ItemType File

# Or manually create the file
```

### 3.2 Add Required Variables

Add the following to your `.env.local` file:

```env
# ============================================
# Required: Gemini API Configuration
# ============================================
GEMINI_API_KEY=your_gemini_api_key_here

# ============================================
# Application Configuration
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# ============================================
# Optional: Firebolt Configuration (for production)
# ============================================
# Enable Firebolt (set to 'true' to use real Firebolt instead of mock data)
# FIREBOLT_ENABLED=false

# FIREBOLT_CLIENT_ID=your_firebolt_client_id
# FIREBOLT_CLIENT_SECRET=your_firebolt_client_secret
# FIREBOLT_ACCOUNT=your_firebolt_account_name
# FIREBOLT_DATABASE=your_database_name

# Firebolt Schema (default: 'public')
# This is the schema where your tables are located
# FIREBOLT_SCHEMA=public

# ============================================
# Optional: Gmail API (for production email sending)
# ============================================
# GMAIL_CLIENT_ID=your_gmail_oauth_client_id
# GMAIL_CLIENT_SECRET=your_gmail_oauth_client_secret
# GMAIL_REFRESH_TOKEN=your_refresh_token
```

### 3.3 Replace Placeholder Values

1. Replace `your_gemini_api_key_here` with the API key from Step 1
2. Keep other values as-is for development mode
3. (Optional) Add real Firebolt/Gmail credentials if you have them

---

## Step 4: Run the Application

### 4.1 Start Development Server

```bash
npm run dev
```

You should see output like:

```
▲ Next.js 14.0.0
- Local:        http://localhost:3000
- Ready in 2.5s
```

### 4.2 Access the Application

Open your browser and navigate to:

- **Main Demo:** [http://localhost:3000](http://localhost:3000)
- **Workshop:** [http://localhost:3000/workshop](http://localhost:3000/workshop)
- **Firebolt Setup:** [http://localhost:3000/firebolt](http://localhost:3000/firebolt)

---

## Step 5: Verify the Setup

### 5.1 Test the Orchestrator Agent

1. Go to the main page at `http://localhost:3000`
2. Scroll to the **"Orchestrator Agent"** section
3. Click **"Try Multi-Step Flow"**
4. You should see:
   - Intent classification
   - Sub-agent routing
   - Response generation

### 5.2 Test the Analytics Agent

1. In the **"Analytics Agent"** section
2. Click **"Run Customer Growth Query"**
3. Verify you see:
   - SQL query generation
   - Mock query results (month, new_customers, growth_pct)
   - AI-generated insights

### 5.3 Test the Report Agent

1. In the **"Report Agent"** section
2. Click **"Generate & Preview Report"**
3. Check for:
   - Report generation with Gemini
   - Formatted markdown output
   - (Sandbox) Email send confirmation

---

## Step 6: Understanding the Architecture

### 6.1 How Natural Language → SQL Works

```
┌─────────────┐
│ User Query  │  "Show me customer growth trends"
└──────┬──────┘
       │
       v
┌─────────────────┐
│ Gemini Service  │  Converts to SQL using AI
└──────┬──────────┘
       │
       v
┌──────────────────┐
│ Generated SQL    │  SELECT DATE_TRUNC('month', signup_date) AS month,
└──────┬───────────┘        COUNT(*) AS new_customers ...
       │
       v
┌──────────────────┐
│ Firebolt MCP     │  Executes query (or mock in dev)
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Query Results    │  Returns structured data
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Gemini Analysis  │  Generates insights from results
└──────┬───────────┘
       │
       v
┌──────────────────┐
│ Gmail (Optional) │  Sends formatted report
└──────────────────┘
```

### 6.2 Key Files

| File | Purpose |
|------|---------|
| `src/lib/services/gemini.ts` | Gemini API client with rate limiting |
| `src/lib/services/firebolt-mcp.ts` | Firebolt MCP client (mock + real) |
| `src/lib/services/gmail.ts` | Gmail API client (sandbox mode) |
| `src/lib/agents/orchestrator.ts` | Multi-agent orchestration logic |
| `src/lib/agents/analytics.ts` | SQL generation and query execution |
| `src/lib/agents/report.ts` | Report generation and email sending |

### 6.3 Environment Modes

- **Development (default):** Uses mock Firebolt data and sandbox Gmail
- **Production:** Can connect to real Firebolt MCP server and Gmail API

---

## Step 7: Workshop TODOs

The project includes 20% intentionally incomplete code for hands-on learning.

### 7.1 Navigate to Workshop

Visit: [http://localhost:3000/workshop](http://localhost:3000/workshop)

### 7.2 Complete the Steps

1. **Setup** (`/workshop/01-setup`) - Environment configuration
2. **Analytics** (`/workshop/02-analytics`) - SQL generation and optimization
3. **Orchestration Theory** (`/workshop/03-orchestration-theory`) - Understanding multi-step workflows
4. **Orchestrator** (`/workshop/04-orchestrator`) - Multi-step agent flow
5. **Report** (`/workshop/05-report`) - Report templates and email
6. **Integration** (`/workshop/06-integration`) - End-to-end testing

### 7.3 Find TODOs in Code

Search for `TODO:` comments in:
- `src/lib/agents/orchestrator.ts`
- `src/lib/agents/analytics.ts`
- `src/lib/agents/report.ts`

Each TODO includes:
- **TODO:** What to implement
- **HINT:** Implementation guidance
- **TEST:** How to verify your solution

---

## Step 8: Production Deployment (Optional)

### 8.1 Connecting Real Firebolt MCP Server

To use a real Firebolt instance:

1. **Get Firebolt Credentials:**
   - Sign up at [https://firebolt.io](https://firebolt.io)
   - Create a service account
   - Note your: Client ID, Client Secret, Account Name, Database

2. **Update `.env.local`:**
   ```env
   FIREBOLT_ENABLED=true
   FIREBOLT_CLIENT_ID=your_actual_client_id
   FIREBOLT_CLIENT_SECRET=your_actual_client_secret
   FIREBOLT_ACCOUNT=your_account_name
   FIREBOLT_DATABASE=your_database_name
   FIREBOLT_SCHEMA=public
   FIREBOLT_ENGINE=your_engine_name
   ```
   
   **Important Notes:**
   - `FIREBOLT_ENABLED` must be set to `true` to use real Firebolt
   - `FIREBOLT_SCHEMA` defaults to `public` if not specified
   - `FIREBOLT_ENGINE` is **required** for querying data tables
   - **Must use a USER engine**, not the system engine
   - In Firebolt, tables are referenced as `<schema>.<table>`
   - Make sure the schema exists in your database before querying
   - Find your engine name in the Firebolt UI under "Engines"

3. **Implement Real MCP Transport:**
   
   Edit `src/lib/services/firebolt-mcp.ts`:
   ```typescript
   async execute(sql: string): Promise<QueryResult> {
     if (this.mock) {
       return this.mockExecute(sql);
     }
     
     // Real implementation with firebolt-sdk
     const { Firebolt } = require('firebolt-sdk');
     const firebolt = new Firebolt({
       clientId: this.config.clientId,
       clientSecret: this.config.clientSecret
     });
     
     const connection = await firebolt.connect({
       database: this.config.database,
       account: this.config.account
     });
     
     const result = await connection.execute(sql);
     return {
       columns: result.meta.map((m: any) => m.name),
       rows: result.data
     };
   }
   ```

### 8.2 Connecting Real Gmail API

To send real emails:

1. **Enable Gmail API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Gmail API
   - Create OAuth2 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/callback`

2. **Get OAuth2 Tokens:**
   - Use OAuth2 Playground or create a token generation script
   - Store refresh token securely

3. **Update `.env.local`:**
   ```env
   GMAIL_CLIENT_ID=your_oauth_client_id
   GMAIL_CLIENT_SECRET=your_oauth_client_secret
   GMAIL_REFRESH_TOKEN=your_refresh_token
   ```

4. **Implement Real Gmail Send:**
   
   Edit `src/lib/services/gmail.ts`:
   ```typescript
   import { google } from 'googleapis';
   
   async send(payload: EmailPayload): Promise<boolean> {
     if (this.sandbox) {
       logger.info('Gmail sandbox send', payload);
       return true;
     }
     
     const oauth2Client = new google.auth.OAuth2(
       process.env.GMAIL_CLIENT_ID,
       process.env.GMAIL_CLIENT_SECRET,
       'http://localhost:3000/api/auth/callback'
     );
     
     oauth2Client.setCredentials({
       refresh_token: process.env.GMAIL_REFRESH_TOKEN
     });
     
     const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
     
     const message = [
       `To: ${payload.recipient}`,
       `Subject: ${payload.subject}`,
       '',
       payload.body
     ].join('\n');
     
     const encodedMessage = Buffer.from(message)
       .toString('base64')
       .replace(/\+/g, '-')
       .replace(/\//g, '_')
       .replace(/=+$/, '');
     
     await gmail.users.messages.send({
       userId: 'me',
       requestBody: {
         raw: encodedMessage
       }
     });
     
     return true;
   }
   ```

---

## Troubleshooting

### Issue: "The system engine doesn't support queries against table"

**Solution:**
- Firebolt has two types of engines: System and User
- **System engine**: Only for metadata operations (SHOW, DESCRIBE, etc.)
- **User engine**: Required for querying actual data tables
- You need to specify a USER engine in your configuration
- **How to find your engine name:**
  1. Log into Firebolt UI at [https://firebolt.io](https://firebolt.io)
  2. Navigate to "Engines" in the left sidebar
  3. Look for a running engine (or create one if needed)
  4. Copy the engine name (e.g., `my_engine`, `analytics_engine`)
- Add to your `.env.local`:
  ```env
  FIREBOLT_ENGINE=your_engine_name
  ```
- **If you don't have a user engine**, create one:
  1. In Firebolt UI, go to "Engines"
  2. Click "Create Engine"
  3. Name it (e.g., `analytics_engine`)
  4. Select appropriate size (start with smallest for testing)
  5. Start the engine
  6. Use the engine name in your `.env.local`

### Issue: "Schema 'ecommercedb' does not exist or not authorized"

**Solution:**
- This error occurs when the schema name is incorrect
- In Firebolt, tables are referenced as `<schema>.<table>`, not `<database>.<table>`
- Check your schema name in the Firebolt UI or run: `SHOW SCHEMAS;`
- Common schema names: `public`, `main`, or custom schema names
- Update your `.env.local` with the correct schema:
  ```env
  FIREBOLT_SCHEMA=public
  ```
- If you don't have a schema, create one:
  ```sql
  CREATE SCHEMA IF NOT EXISTS public;
  ```
- Make sure your service account has access to the schema

### Issue: "GEMINI_API_KEY is not defined"

**Solution:** 
- Ensure `.env.local` exists in project root
- Verify `GEMINI_API_KEY=` line has no spaces around `=`
- Restart the dev server after adding env vars

### Issue: Rate limit errors (429)

**Solution:**
- The free tier has 15 RPM limit
- Code includes automatic rate limiting
- Wait 60 seconds between high-volume tests
- Consider upgrading to paid tier in Google AI Studio

### Issue: Mock data instead of real queries

**Solution:**
- This is expected in development mode
- Set `NODE_ENV=production` to attempt real connections
- Ensure Firebolt credentials are configured
- Check `this.mock` flag in `firebolt-mcp.ts`

### Issue: Port 3000 already in use

**Solution:**
```bash
# Kill the process using port 3000
npx kill-port 3000

# Or use a different port
npm run dev -- -p 3001
```

---

## Additional Resources

- **Gemini API Docs:** [https://ai.google.dev/docs](https://ai.google.dev/docs)
- **Firebolt Documentation:** [https://docs.firebolt.io](https://docs.firebolt.io)
- **Gmail API Guide:** [https://developers.google.com/gmail/api](https://developers.google.com/gmail/api)
- **MCP Protocol Spec:** [https://modelcontextprotocol.io](https://modelcontextprotocol.io)
- **Next.js Docs:** [https://nextjs.org/docs](https://nextjs.org/docs)

---

## Next Steps

1. ✅ Complete the workshop at `/workshop`
2. ✅ Implement the TODOs in agent files
3. ✅ Test each agent independently
4. ✅ Try the full multi-step orchestration
5. ✅ (Optional) Connect to real Firebolt and Gmail
6. ✅ Deploy to production (see `DEPLOYMENT.md`)

Happy building! 🚀
