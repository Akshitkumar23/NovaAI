
'use client';

import { useState, useActionState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { generateReviewSummary } from '@/ai/flows/ai-review-summarizer';
import type { Tool, Review } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ReviewSectionProps {
  tool: Tool;
}

function SubmitReviewButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      Submit Review
    </Button>
  );
}

function SummaryButton({ reviews }: { reviews: string[] }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending || reviews.length === 0}>
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
      Generate AI Summary
    </Button>
  );
}

async function handleSummaryAction(
  previousState: any,
  formData: FormData
) {
  const reviewsData = formData.get('reviews');
  if (typeof reviewsData === 'string') {
    try {
      const reviews = JSON.parse(reviewsData);
      return await generateReviewSummary({ reviews });
    } catch (e) {
      return { error: 'Failed to parse reviews.' };
    }
  }
  return { error: 'No review data provided.'};
}

export function ReviewSection({ tool }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(tool.reviews);
  const [newReviewText, setNewReviewText] = useState('');
  const [summaryState, summaryFormAction] = useActionState(handleSummaryAction, null);

  const reviewComments = reviews.map(r => r.comment);

  const handleReviewSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newReviewText.trim() === '') return;

    const newReview: Review = {
      author: 'Guest', // In a real app, this would be the logged-in user
      avatar: 'https://placehold.co/40x40.png',
      rating: 5, // A rating system could be added here
      comment: newReviewText,
      date: new Date().toISOString(),
    };

    setReviews([newReview, ...reviews]);
    setNewReviewText('');
  };

  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold font-headline">Community Reviews</h2>
        <form action={summaryFormAction}>
            <input type="hidden" name="reviews" value={JSON.stringify(reviewComments)} />
            <SummaryButton reviews={reviewComments} />
        </form>
      </div>

      {summaryState?.summary && (
        <Alert className="mb-6 bg-accent">
          <Sparkles className="h-4 w-4" />
          <AlertTitle>AI-Powered Summary</AlertTitle>
          <AlertDescription>{summaryState.summary}</AlertDescription>
        </Alert>
      )}

      {summaryState?.error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{summaryState.error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {reviews.length > 0 ? reviews.map((review, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row justify-between items-start">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={review.avatar} alt={review.author} data-ai-hint="person"/>
                  <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{review.author}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-primary fill-primary' : 'text-muted-foreground'}`} />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <p>{review.comment}</p>
            </CardContent>
          </Card>
        )) : <p className="text-muted-foreground">No reviews yet. Be the first to write one!</p>}
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Write a Review</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <Textarea 
                      placeholder={`Share your thoughts on ${tool.name}...`} 
                      rows={4}
                      value={newReviewText}
                      onChange={(e) => setNewReviewText(e.target.value)}
                      required
                    />
                    <SubmitReviewButton />
                </form>
            </CardContent>
        </Card>
      </div>
    </section>
  );
}
