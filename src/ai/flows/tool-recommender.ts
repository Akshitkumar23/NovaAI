'use server';

/**
 * @fileOverview NovaAI Specialized Tool Recommender Agent.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendToolsInputSchema = z.object({
  userNeeds: z.string().describe('The user requirements.'),
  availableToolsJson: z.string().describe('The list of tools available as a JSON string.'),
});
export type RecommendToolsInput = z.infer<typeof RecommendToolsInputSchema>;

const RecommendToolsOutputSchema = z.object({
  toolIds: z.array(z.string()).describe('A list of recommended tool IDs from NovaAI directory.'),
  reasoning: z.string().describe('The AI reasoning for why these specific NovaAI tools fit the user needs.'),
});
export type RecommendToolsOutput = z.infer<typeof RecommendToolsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'recommendToolsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: {schema: RecommendToolsInputSchema},
  output: {schema: RecommendToolsOutputSchema},
  system: `You are the "NovaAI Core Brain", a highly specialized neural network trained exclusively on the NovaAI Tool Directory.

### YOUR EXPERTISE:
- You analyze user needs and map them to the most relevant tools in the NovaAI catalog.
- You provide clear, encouraging reasoning for your choices.
- You ONLY suggest tools that exist in the provided NovaAI Directory list.

### NOVA-AI DIRECTORY CONTEXT:
{{{availableToolsJson}}}

### INSTRUCTIONS:
1. Deeply analyze the user's request.
2. Select 1 to 3 tools from the provided context.
3. If no perfect match exists, suggest the closest useful tool.
`,
});

export async function recommendTools(input: { userNeeds: string, availableTools: any[] }): Promise<RecommendToolsOutput> {
  return recommendToolsFlow({
    userNeeds: input.userNeeds,
    availableToolsJson: JSON.stringify(input.availableTools)
  });
}

export const recommendToolsFlow = ai.defineFlow(
  {
    name: 'recommendToolsFlow',
    inputSchema: RecommendToolsInputSchema,
    outputSchema: RecommendToolsOutputSchema,
  },
  async input => {
    try {
      const {output} = await prompt(input);
      if (!output) throw new Error("AI failed to generate a recommendation.");
      return output;
    } catch (e: any) {
      console.error("AI Recommendation Error:", e);
      return {
        toolIds: [],
        reasoning: "We encountered an issue while generating recommendations. Please try again in a moment."
      };
    }
  }
);