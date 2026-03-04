'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating AI-powered summaries of fashion trends.
 *
 * - summarizeTrendInsights - A function that takes a list of fashion trends and returns an AI-generated summary.
 * - SummarizeTrendInsightsInput - The input type for the summarizeTrendInsights function.
 * - SummarizeTrendInsightsOutput - The return type for the summarizeTrendInsights function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const TrendSchema = z.object({
  name: z.string().describe('The name of the fashion trend.'),
  category: z.string().describe('The category of the fashion trend (e.g., Apparel, Accessories).'),
  status: z.string().describe('The current status of the trend (e.g., Emerging, Growing, Mainstream, Declining).'),
  description: z.string().describe('A brief description of the trend.'),
  growthRate: z.number().describe('The growth rate of the trend as a percentage.'),
  marketShare: z.number().describe('The market share of the trend as a percentage.'),
  associatedCollections: z.array(z.string()).optional().describe('Optional list of associated collections or brands.'),
});

const SummarizeTrendInsightsInputSchema = z.object({
  trends: z.array(TrendSchema).min(1).describe('An array of fashion trend objects to summarize.'),
});
export type SummarizeTrendInsightsInput = z.infer<typeof SummarizeTrendInsightsInputSchema>;

const SummarizeTrendInsightsOutputSchema = z.string().describe('An AI-generated summary of the selected fashion trends, covering key characteristics, current status, and potential market implications.');
export type SummarizeTrendInsightsOutput = z.infer<typeof SummarizeTrendInsightsOutputSchema>;

const prompt = ai.definePrompt({
  name: 'summarizeTrendInsightsPrompt',
  input: { schema: SummarizeTrendInsightsInputSchema },
  output: { schema: SummarizeTrendInsightsOutputSchema },
  prompt: `You are an expert fashion analyst. Your task is to provide a concise, insightful summary of the provided fashion trends. Focus on their key characteristics, current status, and potential market implications.

Here are the fashion trends to analyze:

{{#each trends}}
  Trend Name: {{{name}}}
  Category: {{{category}}}
  Status: {{{status}}}
  Description: {{{description}}}
  Growth Rate: {{{growthRate}}}%
  Market Share: {{{marketShare}}}%
  {{#if associatedCollections}}
  Associated Collections/Brands: {{#each associatedCollections}}{{{this}}}{{^@last}}, {{/@last}}{{/each}}
  {{/if}}

{{/each}}

Based on the above information, provide a comprehensive summary of these trends, highlighting their significance and impact on the fashion market.
`,
});

const summarizeTrendInsightsFlow = ai.defineFlow(
  {
    name: 'summarizeTrendInsightsFlow',
    inputSchema: SummarizeTrendInsightsInputSchema,
    outputSchema: SummarizeTrendInsightsOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function summarizeTrendInsights(input: SummarizeTrendInsightsInput): Promise<SummarizeTrendInsightsOutput> {
  return summarizeTrendInsightsFlow(input);
}
