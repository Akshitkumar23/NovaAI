
'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { categories, tools as staticTools } from '@/lib/data';
import { ToolCard } from '@/components/tool-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { notFound } from 'next/navigation';
import { useMemo, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/back-button';
import type { Tool } from '@/lib/types';

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [allTools, setAllTools] = useState<Tool[]>(staticTools);
  
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const noCodeFilter = searchParams.get('nocode') === 'true';

  const category = useMemo(() => categories.find(c => c.id === slug), [slug]);

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
        features: ['AI Discovered', 'Auto-added'],
        reviews: [],
        collections: [],
        noCode: true
      }));
      setAllTools([...staticTools, ...discovered]);
    }
  }, []);

  const filteredTools = useMemo(() => {
    if (!category) return [];
    return allTools.filter(tool => {
      const inCategory = tool.category === category.id;
      const matchesNoCode = !noCodeFilter || tool.noCode;
      return inCategory && matchesNoCode;
    });
  }, [category, noCodeFilter, allTools]);

  if (!category) {
    notFound();
  }

  const handleFilterChange = (checked: boolean) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (checked) {
      current.set('nocode', 'true');
    } else {
      current.delete('nocode');
    }
    const search = current.toString();
    const query = search ? `?${search}` : '';
    router.push(`/categories/${slug}${query}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <section>
        <div className="flex items-center gap-4 mb-4">
            <category.icon className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">{category.name}</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">{category.description}</p>
        
        <div className="flex items-center space-x-2 mb-8">
          <Checkbox 
            id="no-code-filter" 
            checked={noCodeFilter} 
            onCheckedChange={handleFilterChange}
          />
          <Label htmlFor="no-code-filter" className="text-base">Show "No-Code" tools only</Label>
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">No Tools Found</h2>
            <p className="text-muted-foreground">No tools match the current filter in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
