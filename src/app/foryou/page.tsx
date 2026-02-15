
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useBookmarks } from '@/hooks/use-bookmarks';
import { tools } from '@/lib/data';
import type { Tool } from '@/lib/types';
import { ToolCard } from '@/components/tool-card';
import { personalizedRecommendations, PersonalizedRecommendationsOutput } from '@/ai/flows/personalized-recommendations';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, User } from 'lucide-react';
import Link from 'next/link';
import { BackButton } from '@/components/back-button';

function RecommendButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} size="lg">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Get My Recommendations
    </Button>
  );
}

type RecommendationState = PersonalizedRecommendationsOutput | { error: string } | null;

async function handleRecommendAction(
  previousState: any,
  formData: FormData
): Promise<RecommendationState> {
  const bookmarkedToolsData = formData.get('bookmarkedTools');
  if (typeof bookmarkedToolsData !== 'string') {
    return { error: 'Invalid bookmarked tool data.' };
  }
  try {
    const bookmarkedTools: Tool[] = JSON.parse(bookmarkedToolsData);
    const allTools = tools;
    return await personalizedRecommendations({ bookmarkedTools, allTools });
  } catch (e: any) {
    return { error: 'Failed to generate recommendations: ' + e.message };
  }
}

export default function ForYouPage() {
  const { bookmarks } = useBookmarks();
  const [state, formAction] = useActionState(handleRecommendAction, null);

  const bookmarkedTools = tools.filter(tool => bookmarks.includes(tool.id));
  
  const recommendedTools = state && 'recommendations' in state
    ? state.recommendations
        .map(rec => tools.find(t => t.id === rec.toolId))
        .filter((t): t is Tool => !!t)
    : [];

  if (bookmarkedTools.length === 0) {
    return (
        <div className="container mx-auto px-4 py-8 text-center">
            <BackButton />
            <User className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold font-headline">Personalized For You</h1>
            <p className="text-lg text-muted-foreground mt-2 mb-6">Bookmark some tools to get personalized recommendations.</p>
             <Button asChild>
                <Link href="/categories">Explore Tools</Link>
            </Button>
        </div>
    )
  }


  return (
    <div className="container mx-auto px-4 py-8">
        <BackButton />
      <section className="text-center mb-12">
        <User className="w-12 h-12 text-primary mx-auto mb-4" />
        <h1 className="text-4xl font-bold font-headline">Personalized For You</h1>
        <p className="text-lg text-muted-foreground mt-2">
            Based on your bookmarks, here are some other tools you might like.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold font-headline mb-4">Your Bookmarked Tools</h2>
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bookmarkedTools.map(tool => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
      </section>

      <div className="text-center my-8">
        <form action={formAction}>
            <input type="hidden" name="bookmarkedTools" value={JSON.stringify(bookmarkedTools)} />
            <RecommendButton disabled={bookmarkedTools.length === 0} />
        </form>
      </div>

       {state && (
            <div className="mt-8">
                <h2 className="text-2xl font-bold font-headline mb-4">Here are your recommendations:</h2>
                {state && 'error' in state && (
                    <Alert variant="destructive" className="mb-6">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{state.error}</AlertDescription>
                    </Alert>
                )}

                {recommendedTools.length > 0 ? (
                  <div className="space-y-4">
                    {state && 'recommendations' in state && state.recommendations.map((rec, index) => {
                        const tool = recommendedTools.find(t => t.id === rec.toolId);
                        if (!tool) return null;
                        return (
                            <Alert key={index}>
                                <Sparkles className="h-4 w-4" />
                                <AlertTitle>You might like <Link href={`/tools/${tool.id}`} className="font-bold underline hover:text-primary">{tool.name}</Link></AlertTitle>
                                <AlertDescription>{rec.reason}</AlertDescription>
                                <div className="mt-4">
                                   <ToolCard tool={tool} />
                                </div>
                            </Alert>
                        )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {state && !('error' in state) ? "The AI couldn't find any matching tools for your request." : ""}
                  </p>
                )}
            </div>
        )}
    </div>
  );
}
