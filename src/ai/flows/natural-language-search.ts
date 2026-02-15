
'use server';

/**
 * @fileOverview NovaAI Intelligent Search Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const NaturalLanguageSearchInputSchema = z.object({
  query: z.string().describe("The user's search query in natural language."),
  categoriesJson: z.string().describe('The available tool categories as a JSON string.'),
});
export type NaturalLanguageSearchInput = z.infer<typeof NaturalLanguageSearchInputSchema>;

const NaturalLanguageSearchOutputSchema = z.object({
  searchInterpretation: z.string().describe("A brief explanation of how NovaAI interpreted the user's search query."),
  categoryIds: z.array(z.string()).describe("An array of category IDs that are most relevant to the user's query."),
  keywords: z.array(z.string()).describe("A list of keywords extracted from the query."),
});
export type NaturalLanguageSearchOutput = z.infer<typeof NaturalLanguageSearchOutputSchema>;

const prompt = ai.definePrompt({
  name: 'naturalLanguageSearchPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: NaturalLanguageSearchInputSchema},
  output: {schema: NaturalLanguageSearchOutputSchema},
  prompt: `You are the "NovaAI Search Engine Engine". 
  
Your job is to translate human speech into technical search filters for our directory.

### NOVA-AI CATEGORIES:
{{{categoriesJson}}}

### USER QUERY:
"{{{query}}}"

### GOAL:
1. Explain the search intention clearly.
2. Pick the exact Category IDs from the NovaAI list that match.
3. Extract keywords to help our internal search find the best match.
`,
});

export async function naturalLanguageSearch(query: string, categories: any[] = []): Promise<NaturalLanguageSearchOutput> {
  return naturalLanguageSearchFlow({ query, categoriesJson: JSON.stringify(categories) });
}

export const naturalLanguageSearchFlow = ai.defineFlow(
  {
    name: 'naturalLanguageSearchFlow',
    inputSchema: NaturalLanguageSearchInputSchema,
    outputSchema: NaturalLanguageSearchOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
