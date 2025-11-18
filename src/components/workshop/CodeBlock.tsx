"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';

export function CodeBlock({ code, language = 'tsx', onTry }: { code: string; language?: string; onTry?: () => void }) {
  const [copied, setCopied] = useState(false);
  async function onCopy() {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <div className="rounded-lg border border-gray-200 overflow-hidden my-8 shadow-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-300 font-mono">{language}</span>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onCopy} className="text-sm">
            {copied ? '✓ Copied' : 'Copy'}
          </Button>
          {onTry && (
            <Button size="sm" onClick={onTry} className="text-sm">Try it</Button>
          )}
        </div>
      </div>
      <SyntaxHighlighter 
        language={language} 
        style={oneDark} 
        customStyle={{ 
          margin: 0, 
          padding: '1.5rem',
          fontSize: '0.9rem',
          lineHeight: '1.6'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}


