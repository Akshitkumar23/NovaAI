
'use server';

/**
 * @fileOverview NovaAI Review Analyst Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReviewSummaryInputSchema = z.object({
  reviews: z.array(z.string()).describe('An array of user reviews for a specific tool.').min(1, { message: "At least one review is required."}),
});
export type GenerateReviewSummaryInput = z.infer<typeof GenerateReviewSummaryInputSchema>;

const GenerateReviewSummaryOutputSchema = z.object({
  summary: z.string().optional().describe('A concise summary of the user reviews.'),
  error: z.string().optional().describe('An error message.'),
});
export type GenerateReviewSummaryOutput = z.infer<typeof GenerateReviewSummaryOutputSchema>;

export async function generateReviewSummary(input: GenerateReviewSummaryInput): Promise<GenerateReviewSummaryOutput> {
  return generateReviewSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReviewSummaryPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: GenerateReviewSummaryInputSchema},
  output: {schema: GenerateReviewSummaryOutputSchema},
  prompt: `You are the "NovaAI Sentiment Expert". 
  
Summarize the following reviews for a tool in our directory. Focus on consensus: What do users love? What do they hate? 

Reviews:
{{#each reviews}}
- {{{this}}}
{{/each}}

Make it professional, punchy, and helpful for a prospective user of NovaAI.
`,
});

const generateReviewSummaryFlow = ai.defineFlow(
  {
    name: 'generateReviewSummaryFlow',
    inputSchema: GenerateReviewSummaryInputSchema,
    outputSchema: GenerateReviewSummaryOutputSchema,
  },
  async input => {
    try {
        const {output} = await prompt(input);
        return output!;
    } catch (e: any) {
        return { error: 'Failed to generate summary: ' + e.message };
    }
  }
);
