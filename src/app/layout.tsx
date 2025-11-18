import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Multi-Agent AI Workshop',
  description: 'Production-ready multi-agent AI orchestration workshop with Next.js, Gemini, Firebolt MCP, and Gmail',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased" style={{ fontFamily: 'Coolvetica, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}


