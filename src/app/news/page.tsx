
'use client';

import { aiNews } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Newspaper, Calendar } from 'lucide-react';
import { BackButton } from '@/components/back-button';
import { Button } from '@/components/ui/button';

export default function NewsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      
      <div className="flex items-center gap-4 mb-12">
        <Newspaper className="w-10 h-10 text-primary" />
        <div>
          <h1 className="text-4xl font-bold font-headline">AI Industry News</h1>
          <p className="text-muted-foreground">Stay updated with the latest trends and breakthroughs.</p>
        </div>
      </div>

      <div className="space-y-8">
        {aiNews.map((news) => (
          <Card key={news.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <Badge variant="outline" className="mb-2">{news.source}</Badge>
                  <CardTitle className="text-2xl font-headline leading-tight">{news.title}</CardTitle>
                </div>
                <div className="text-muted-foreground flex items-center gap-1 text-sm shrink-0">
                  <Calendar className="w-4 h-4" />
                  {new Date(news.date).toLocaleDateString()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6 leading-relaxed">{news.summary}</p>
              <Button asChild variant="outline">
                <a href={news.url} target="_blank" rel="noopener noreferrer">
                  Read Full Article <ExternalLink className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
