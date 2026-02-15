
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Globe, ArrowLeft, Bot, Sparkles } from 'lucide-react';

export default function SubmitPage() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-2xl text-center">
      <div className="relative mb-8 flex justify-center">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
        <Bot className="w-24 h-24 text-primary relative z-10 animate-float" />
      </div>
      
      <h1 className="text-4xl font-bold font-headline mb-4 tracking-tight">Manual Submission Closed</h1>
      <p className="text-xl text-muted-foreground mb-12 font-light leading-relaxed">
        Our platform now uses an <strong>Autonomous AI Agent</strong> to discover and verify new tools in real-time. Manual submissions are no longer required.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Button asChild size="lg" className="rounded-xl h-14 text-lg">
            <Link href="/discovery">
                <Globe className="mr-2 h-5 w-5" /> View AI Discovery
            </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-xl h-14 text-lg glass-primary">
            <Link href="/">
                <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
            </Link>
        </Button>
      </div>

      <div className="mt-16 p-8 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm text-left">
        <h3 className="text-lg font-bold mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Why the change?
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
            To ensure the highest quality and most up-to-date directory, our AI scraper explores Product Hunt, Futurepedia, and developer forums every day at 7 PM. This keeps our data objective and lightning fast.
        </p>
      </div>
    </div>
  );
}
