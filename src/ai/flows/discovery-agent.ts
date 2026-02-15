
'use server';

/**
 * @fileOverview An AI Discovery Agent that extracts structured AI tool data from scraped web text.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const DiscoveryOutputSchema = z.object({
  foundTools: z.array(z.object({
    name: z.string().describe('Exact name of the AI tool.'),
    description: z.string().describe('A catchy one-sentence description of what it does.'),
    category: z.string().describe('The ID of the category it belongs to.'),
    link: z.string().describe('The URL to the tool website.'),
    reason: z.string().describe('One sentence on why this tool is relevant or trending.'),
  })).describe('List of verified AI tools found in the text.'),
});

export type DiscoveryOutput = z.infer<typeof DiscoveryOutputSchema>;

const discoveryPrompt = ai.definePrompt({
  name: 'discoveryPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: z.object({ rawText: z.string() }) },
  output: { schema: DiscoveryOutputSchema },
  prompt: `You are a high-level AI Industry Researcher. 
  
  TASK: Analyze the following text extracted from a tech news or discovery site. 
  1. Identify actual, specific AI tools, apps, or platforms mentioned.
  2. Ignore general news articles that don't name a tool.
  3. Map each found tool to the most appropriate category.
  4. Create a punchy description and extract its official website link if possible.
  5. Only include tools that are explicitly AI-powered.

  RAW DATA:
  """
  {{{rawText}}}
  """
  `,
});

export const runDiscovery = ai.defineFlow(
  {
    name: 'runDiscovery',
    inputSchema: z.object({ rawText: z.string() }),
    outputSchema: DiscoveryOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await discoveryPrompt(input);
      return output!;
    } catch (e) {
      console.error("AI Discovery Flow failed:", e);
      return { foundTools: [] };
    }
  }
);
