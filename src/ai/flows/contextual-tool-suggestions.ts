
'use server';
/**
 * @fileOverview NovaAI Contextual Awareness Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ContextualToolSuggestionsInputSchema = z.object({
  content: z.string().describe('The content the user is currently viewing.'),
});
export type ContextualToolSuggestionsInput = z.infer<typeof ContextualToolSuggestionsInputSchema>;

const ContextualToolSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.string().describe('A list of suggested AI tools based on context.')
  ).describe('The AI tool suggestions.'),
});
export type ContextualToolSuggestionsOutput = z.infer<typeof ContextualToolSuggestionsOutputSchema>;

export async function contextualToolSuggestions(input: ContextualToolSuggestionsInput): Promise<ContextualToolSuggestionsOutput> {
  return contextualToolSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contextualToolSuggestionsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: ContextualToolSuggestionsInputSchema},
  output: {schema: ContextualToolSuggestionsOutputSchema},
  prompt: `You are the "NovaAI Context Engine". 
  
Suggest relevant tools from our directory that complement what the user is currently looking at.

Content Context: 
{{{content}}}

Suggestions (NovaAI Names):`,
});

const contextualToolSuggestionsFlow = ai.defineFlow(
  {
    name: 'contextualToolSuggestionsFlow',
    inputSchema: ContextualToolSuggestionsInputSchema,
    outputSchema: ContextualToolSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
