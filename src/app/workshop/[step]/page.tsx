import fs from 'fs';
import path from 'path';
import { MDXRemote } from 'next-mdx-remote/rsc';
import matter from 'gray-matter';
import { CodeBlock } from '@/components/workshop/CodeBlock';
import { Hint } from '@/components/workshop/Hint';
import { Exercise } from '@/components/workshop/Exercise';
import { Checkpoint } from '@/components/workshop/Checkpoint';
import { TestButton } from '@/components/workshop/TestButton';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Clock, Target, BookOpen } from 'lucide-react';

function getStepFile(slug: string) {
  const file = path.join(process.cwd(), 'src', 'content', 'workshop-steps', `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const fileContent = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(fileContent);
  
  // Extract checkpoints from the content
  const checkpointMatch = content.match(/<Checkpoint\s+items=\{(\[[^\]]+\])\}\s*\/>/);
  let checkpoints: string[] = [];
  if (checkpointMatch) {
    try {
      // Clean up the string and parse it
      const checkpointString = checkpointMatch[1]
        .replace(/"/g, '"')
        .replace(/"/g, '"')
        .replace(/'/g, "'");
      checkpoints = eval(checkpointString);
    } catch (e) {
      console.error('Error parsing checkpoints:', e);
    }
  }
  
  return { frontmatter: data, content, checkpoints };
}

const components = {
  CodeBlock,
  Hint,
  Exercise,
  Checkpoint,
  TestButton,
};

const steps = [
  { slug: '01-setup', title: 'Setup' },
  { slug: '02-analytics', title: 'Analytics' },
  { slug: '03-orchestration-theory', title: 'Orchestration Theory' },
  { slug: '04-orchestrator', title: 'Orchestrator' },
  { slug: '05-report', title: 'Report' },
  { slug: '06-integration', title: 'Integration' },
];

export default async function StepPage({ params }: { params: { step: string } }) {
  const stepData = getStepFile(params.step);
  const idx = steps.findIndex((s) => s.slug === params.step);
  const next = idx >= 0 && idx < steps.length - 1 ? steps[idx + 1] : null;
  const prev = idx > 0 ? steps[idx - 1] : null;
  
  return (
    <div className="flex h-full" style={{ fontFamily: 'Satoshi, system-ui, -apple-system, sans-serif' }}>
      <main className="flex-1 overflow-auto p-10 blog-content max-w-4xl mx-auto leading-relaxed">
        {!stepData ? (
          <p className="text-lg">Step not found. Go back to the workshop overview.</p>
        ) : (
          <>
            {/* Frontmatter Header */}
            <div className="mb-12 border-b border-gray-200 pb-8">
              <div className="mb-6">
                <h1 className="text-5xl font-semibold mb-4 tracking-tight leading-tight">{stepData.frontmatter.title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{stepData.frontmatter.description}</p>
              </div>
              
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <span className="text-base font-medium">{stepData.frontmatter.duration}</span>
                </div>
                <Badge variant={stepData.frontmatter.difficulty === 'beginner' ? 'default' : stepData.frontmatter.difficulty === 'intermediate' ? 'secondary' : 'warning'}>
                  {stepData.frontmatter.difficulty}
                </Badge>
              </div>
              
              {stepData.frontmatter.objectives && (
                <div className="space-y-3 bg-gray-50 p-5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-gray-600" />
                    <span className="text-base font-semibold">Learning Objectives:</span>
                  </div>
                  <ul className="text-base space-y-2.5 ml-7 leading-relaxed">
                    {stepData.frontmatter.objectives.map((objective: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-gray-400 font-medium">•</span>
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* MDX Content */}
            <div className="prose prose-lg max-w-none">
              <MDXRemote source={stepData.content} components={components} />
            </div>
          </>
        )}
        <div className="mt-16 pt-8 border-t border-gray-200 flex items-center justify-between">
          <div>
            {prev && (
              <Link 
                className="inline-block px-7 py-3.5 bg-gray-200 hover:bg-gray-300 text-black rounded-lg font-medium transition-colors shadow-sm" 
                href={`/workshop/${prev.slug}`} 
                aria-label={`Previous: ${prev.title}`}
              >
                ← {prev.title}
              </Link>
            )}
          </div>
          <div>
            {next && (
              <Link 
                className="inline-block px-7 py-3.5 bg-[#7AD2A2] hover:bg-[#69c190] text-[#1e1f22] rounded-lg font-medium transition-colors shadow-sm" 
                href={`/workshop/${next.slug}`} 
                aria-label={`Next: ${next.title}`}
              >
                Next: {next.title} →
              </Link>
            )}
          </div>
        </div>
      </main>
      
      <aside className="w-80 border-l p-6 hidden xl:block bg-gray-50">
        <div className="space-y-4 sticky top-6">
          <h3 className="font-semibold text-lg tracking-tight">Checkpoints</h3>
          {stepData && stepData.checkpoints.length > 0 ? (
            <ul className="list-disc pl-5 text-base space-y-2.5 leading-relaxed text-gray-700">
              {stepData.checkpoints.map((checkpoint: string, idx: number) => (
                <li key={idx} className="pl-1">{checkpoint.replace(/^✅\s*/, '')}</li>
              ))}
            </ul>
          ) : (
            <ul className="list-disc pl-5 text-base space-y-2.5 leading-relaxed text-gray-700">
              <li className="pl-1">Complete the exercises</li>
              <li className="pl-1">Review the concepts</li>
            </ul>
          )}
        </div>
      </aside>
    </div>
  );
}


