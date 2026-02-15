
'use client';

import { Suspense, useEffect, useState, useMemo } from 'react';
import { tools as staticTools } from '@/lib/data';
import { ToolCard } from '@/components/tool-card';
import { Search as SearchIcon, Sparkles } from 'lucide-react';
import { naturalLanguageSearch } from '@/ai/flows/natural-language-search';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BackButton } from '@/components/back-button';
import { useSearchParams } from 'next/navigation';
import type { Tool } from '@/lib/types';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [allTools, setAllTools] = useState<Tool[]>(staticTools);
  const [aiResults, setAiResults] = useState<{ interpretation: string, toolIds: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('toolnext_automated_tools');
    if (saved) {
      const discovered = JSON.parse(saved).map((t: any) => ({
        id: `auto-${t.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: t.name,
        description: t.description,
        longDescription: t.reason || t.description,
        category: t.category,
        logo: `https://placehold.co/128x128/orange/white?text=${encodeURIComponent(t.name)}`,
        link: t.link || '#',
        screenshots: [`https://placehold.co/1200x800/333/white?text=${encodeURIComponent(t.name)}+Screenshot`],
        launchDate: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isTrending: true,
        pricing: { model: 'Free Trial', details: 'Check website' },
        features: ['AI Discovered'],
        reviews: [],
        collections: [],
        noCode: true
      }));
      setAllTools([...staticTools, ...discovered]);
    }
  }, []);

  useEffect(() => {
    if (searchQuery) {
      handleAISearch();
    }
  }, [searchQuery, allTools]);

  async function handleAISearch() {
    setLoading(true);
    try {
      const aiResponse = await naturalLanguageSearch(searchQuery);
      
      let combinedIds = new Set<string>();

      // Filter local tools based on AI keywords
      if (aiResponse.keywords) {
        allTools.forEach(tool => {
          const match = aiResponse.keywords.some(k => 
            tool.name.toLowerCase().includes(k.toLowerCase()) || 
            tool.description.toLowerCase().includes(k.toLowerCase())
          );
          if (match) combinedIds.add(tool.id);
        });
      }

      // Add tools from AI categories
      if (aiResponse.categoryIds) {
        allTools.filter(t => aiResponse.categoryIds.includes(t.category)).forEach(t => combinedIds.add(t.id));
      }

      setAiResults({
        interpretation: aiResponse.searchInterpretation,
        toolIds: Array.from(combinedIds)
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const filteredTools = useMemo(() => {
    if (!aiResults) return [];
    return allTools.filter(t => aiResults.toolIds.includes(t.id));
  }, [aiResults, allTools]);

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <header className="flex items-center gap-4 mb-8">
        <SearchIcon className="w-8 h-8 text-primary" />
        {searchQuery ? (
          <h1 className="text-4xl font-bold font-headline">
            Results for &quot;{searchQuery}&quot;
          </h1>
        ) : (
          <h1 className="text-4xl font-bold font-headline">Search for AI Tools</h1>
        )}
      </header>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : searchQuery ? (
        <section>
          {aiResults && (
            <Alert className="mb-8">
              <Sparkles className="h-4 w-4" />
              <AlertTitle className="font-headline text-lg">AI Search Results</AlertTitle>
              <AlertDescription>{aiResults.interpretation}</AlertDescription>
            </Alert>
          )}
          
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-2xl font-semibold mb-2">No Tools Found</h2>
              <p className="text-muted-foreground">Try a different query or explore categories.</p>
            </div>
          )}
        </section>
      ) : (
         <div className="text-center py-16">
            <p className="text-muted-foreground">Use the search bar in the header to find AI tools.</p>
          </div>
      )}
    </div>
  );
}
