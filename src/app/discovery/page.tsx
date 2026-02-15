
'use client';

import { useAutomation } from '@/hooks/use-automation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sparkles, Zap, Calendar, History, ExternalLink, ArrowRight } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DiscoveryPage() {
  const { isScanning, lastScan, discoveredTools } = useAutomation();

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <BackButton />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold font-headline flex items-center gap-2">
            <Zap className="text-primary w-10 h-10 fill-primary" />
            AI Automation Center
          </h1>
          <p className="text-muted-foreground mt-2">
            Autonomous scraper scheduled to find new AI tools daily at 7 PM.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-accent/50 p-4 rounded-xl border border-primary/20">
          <History className="w-5 h-5 text-primary" />
          <div>
            <p className="text-xs uppercase font-bold text-muted-foreground">Last Auto-Run</p>
            <p className="font-headline text-lg">{lastScan ? new Date(lastScan).toLocaleDateString(undefined, { day: 'numeric', month: 'long' }) : 'Never'}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {isScanning && (
          <Card className="bg-primary/5 border-primary/20 border-dashed py-12 animate-pulse">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
              <h3 className="text-xl font-semibold">Autonomous Scraper is Live</h3>
              <p className="text-muted-foreground max-w-sm">
                The AI agent is currently exploring Product Hunt, Futurepedia, and other sources to find today's hottest tools.
              </p>
            </CardContent>
          </Card>
        )}

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold font-headline flex items-center gap-2">
              Automated Discoveries <Badge variant="secondary" className="bg-primary/20 text-primary">{discoveredTools.length}</Badge>
            </h2>
          </div>

          {discoveredTools.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {discoveredTools.map((tool, idx) => (
                <Card key={idx} className="group hover:border-primary transition-all shadow-sm flex flex-col">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start gap-4">
                      <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                        {tool.name}
                      </CardTitle>
                      <Badge variant="outline" className="capitalize shrink-0">{tool.category.replace('-', ' ')}</Badge>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm mt-1">{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg mb-4 border border-border/50">
                      <span className="font-bold text-primary flex items-center gap-1 mb-1">
                        <Sparkles className="w-3 h-3" /> AI Classification Logic:
                      </span>
                      {tool.reason || "Matched to your directory structure automatically."}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={tool.link || '#'} target="_blank" rel="noopener noreferrer">
                          Visit Site <ExternalLink className="ml-2 w-3 h-3" />
                        </a>
                      </Button>
                      <Button size="sm" className="w-full" asChild>
                        <Link href={`/tools/${tool.id}`}>
                          View in App <ArrowRight className="ml-2 w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-24 border-2 border-dashed rounded-2xl bg-muted/20">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-20" />
              <h3 className="text-2xl font-semibold">Waiting for 7 PM</h3>
              <p className="text-muted-foreground max-w-xs mx-auto mt-2">
                The automation engine will automatically run once the clock hits 19:00 and a user visits the app.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
