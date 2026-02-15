'use client';

import { useBookmarks } from '@/hooks/use-bookmarks';
import { tools } from '@/lib/data';
import { ToolCard } from '@/components/tool-card';
import { Bookmark } from 'lucide-react';
import { BackButton } from '@/components/back-button';

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const bookmarkedTools = tools.filter(tool => bookmarks.includes(tool.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      <section>
        <div className="flex items-center gap-4 mb-8">
            <Bookmark className="w-8 h-8 text-primary" />
            <h1 className="text-4xl font-bold font-headline">My Bookmarks</h1>
        </div>
        
        {bookmarkedTools.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookmarkedTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-2xl font-semibold mb-2">No Bookmarks Yet</h2>
            <p className="text-muted-foreground">Click the bookmark icon on any tool to save it here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
