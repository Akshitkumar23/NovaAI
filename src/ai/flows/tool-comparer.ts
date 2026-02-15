'use server';

/**
 * @fileOverview NovaAI Tool Analyst Agent for 'Versus' articles.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CompareToolsInputSchema = z.object({
  toolsJson: z.string().describe('A JSON string of AI tools to compare.'),
});
export type CompareToolsInput = z.infer<typeof CompareToolsInputSchema>;

const CompareToolsOutputSchema = z.object({
  summary: z.string().describe('A detailed comparison article.'),
});
export type CompareToolsOutput = z.infer<typeof CompareToolsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'compareToolsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: CompareToolsInputSchema},
  output: {schema: CompareToolsOutputSchema},
  prompt: `You are the "NovaAI Chief Analyst". 
  
Create a high-quality "Versus" comparison between the tools provided below. 

### TOOLS TO COMPARE:
{{{toolsJson}}}

### FORMATTING RULES (Markdown):
1. **NovaAI Executive Summary**: A quick overview.
2. **Feature Deep Dive**: Contrast their specific capabilities.
3. **Pricing Strategy**: Compare value for money.
4. **The Verdict**: Who wins for which use case?
`,
});

export async function compareTools(input: { tools: any[] }): Promise<CompareToolsOutput> {
  return compareToolsFlow(input);
}

export const compareToolsFlow = ai.defineFlow(
  {
    name: 'compareToolsFlow',
    inputSchema: z.object({ tools: z.array(z.any()) }),
    outputSchema: CompareToolsOutputSchema,
  },
  async input => {
    const {output} = await prompt({
        toolsJson: JSON.stringify(input.tools)
    });
    return output!;
  }
);