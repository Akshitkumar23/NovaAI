
'use client';

import { recommendTools, RecommendToolsOutput } from '@/ai/flows/tool-recommender';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { tools } from '@/lib/data';
import { ToolCard } from '@/components/tool-card';
import { BackButton } from '@/components/back-button';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Get Recommendations
    </Button>
  );
}

async function handleRecommendAction(
  previousState: any,
  formData: FormData
): Promise<RecommendToolsOutput | { error: string } | null> {
  const userNeeds = formData.get('userNeeds');
  if (typeof userNeeds !== 'string' || userNeeds.trim().length === 0) {
    return null;
  }
  
  try {
    const availableTools = tools.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
    }));

    return await recommendTools({ userNeeds, availableTools });
  } catch (e: any) {
    return { error: 'Failed to get recommendations: ' + e.message };
  }
}

export default function RecommendPage() {
  const [state, formAction] = useActionState(handleRecommendAction, null);

  const recommendedTools = state && 'toolIds' in state
    ? tools.filter(t => state.toolIds.includes(t.id))
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <BackButton />
      <section>
        <div className="text-center mb-8">
            <Sparkles className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-bold font-headline">AI Tool Recommender</h1>
            <p className="text-lg text-muted-foreground mt-2">Describe your needs, and our AI will suggest the best tools for the job.</p>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Describe Your Project</CardTitle>
                <CardDescription>
                    Be as specific as possible. What do you want to achieve? What features are important to you?
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form action={formAction}>
                    <div className="grid w-full gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="userNeeds">Your requirements</Label>
                            <Textarea id="userNeeds" name="userNeeds" placeholder="e.g., 'I need a tool to generate blog post ideas and write first drafts on technology topics. It should have SEO features.'" required rows={5}/>
                        </div>
                        <SubmitButton />
                    </div>
                </form>
            </CardContent>
        </Card>

        {state && 'error' in state && (
          <Alert variant="destructive" className="mt-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}

        {state && 'toolIds' in state && (
            <div className="mt-8 animate-in fade-in slide-in-from-bottom-4">
                <h2 className="text-2xl font-bold font-headline mb-4">Here are your recommendations:</h2>
                {state.reasoning && (
                  <Alert className="mb-8">
                      <Sparkles className="h-4 w-4" />
                      <AlertTitle>AI Reasoning</AlertTitle>
                      <AlertDescription>{state.reasoning}</AlertDescription>
                  </Alert>
                )}

                {recommendedTools.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recommendedTools.map(tool => (
                          <ToolCard key={tool.id} tool={tool} />
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">The AI couldn't find any matching tools in our directory for your request.</p>
                  </div>
                )}
            </div>
        )}
      </section>
    </div>
  );
}
