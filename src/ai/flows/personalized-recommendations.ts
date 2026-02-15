'use server';

/**
 * @fileOverview NovaAI Personalized User Agent.
 * Optimized with robust error handling and pre-processed inputs.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PersonalizedRecommendationsInputSchema = z.object({
  bookmarkedToolsJson: z.string().describe('A JSON string of AI tools the user has bookmarked.'),
  availableToolsJson: z.string().describe('A JSON string of all available AI tools the user has NOT bookmarked.'),
});

const RecommendationSchema = z.object({
  toolId: z.string().describe("The ID of the recommended tool."),
  reason: z.string().describe("A short, personalized reason why this tool is being recommended based on the user's bookmarks."),
});

const PersonalizedRecommendationsOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of personalized tool recommendations.'),
});
export type PersonalizedRecommendationsOutput = z.infer<typeof PersonalizedRecommendationsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'personalizedRecommendationsPrompt',
  model: 'googleai/gemini-1.5-flash',
  input: { schema: PersonalizedRecommendationsInputSchema },
  output: { schema: PersonalizedRecommendationsOutputSchema },
  system: `You are the "NovaAI Personal Concierge", a custom-tuned AI assistant for discovery. 

### GOAL:
Analyze the user's taste based on their bookmarks and suggest what they should try next from the NovaAI catalog.

### USER PROFILE (Bookmarks):
{{{bookmarkedToolsJson}}}

### AVAILABLE NOVA-AI CATALOG:
{{{availableToolsJson}}}

### MISSION:
- Identify patterns in bookmarks.
- Suggest 3 tools they haven't bookmarked yet.
- Be encouraging, professional, and insightful.
`,
});

export async function personalizedRecommendations(input: { bookmarkedTools: any[], allTools: any[] }): Promise<PersonalizedRecommendationsOutput> {
  const bookmarkedIds = new Set(input.bookmarkedTools.map(t => t.id));
  const availableTools = input.allTools.filter(t => !bookmarkedIds.has(t.id));

  return personalizedRecommendationsFlow({
    bookmarkedTools: input.bookmarkedTools,
    availableTools: availableTools
  });
}

export const personalizedRecommendationsFlow = ai.defineFlow(
  {
    name: 'personalizedRecommendationsFlow',
    inputSchema: z.object({ bookmarkedTools: z.array(z.any()), availableTools: z.array(z.any()) }),
    outputSchema: PersonalizedRecommendationsOutputSchema,
  },
  async (input) => {
    try {
      const { output } = await prompt({
        bookmarkedToolsJson: JSON.stringify(input.bookmarkedTools),
        availableToolsJson: JSON.stringify(input.availableTools.slice(0, 20)),
      });
      return output!;
    } catch (e: any) {
      console.error("AI Personalized Recommendations Error:", e);
      return { recommendations: [] };
    }
  }
);