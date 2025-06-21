//location-based-insights.ts
'use server';

/**
 * @fileOverview Provides location-based sales insights to optimize inventory and target audiences.
 *
 * - getLocationBasedInsights - A function that analyzes sales data to identify geographic areas with high product demand.
 * - LocationBasedInsightsInput - The input type for the getLocationBasedInsights function.
 * - LocationBasedInsightsOutput - The return type for the getLocationBasedInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LocationBasedInsightsInputSchema = z.object({
  salesData: z.string().describe('Sales data including product, quantity, and geographic location.'),
  productOfInterest: z.string().describe('The specific product for which location-based insights are needed.'),
});
export type LocationBasedInsightsInput = z.infer<typeof LocationBasedInsightsInputSchema>;

const LocationBasedInsightsOutputSchema = z.object({
  geographicAreas: z.array(
    z.object({
      location: z.string().describe('The geographic location.'),
      demandLevel: z.string().describe('The level of demand (High, Medium, Low).'),
      reasoning: z.string().describe('Explanation of why this location has the given demand level.'),
    })
  ).describe('List of geographic areas with demand levels for the specified product.'),
  overallSummary: z.string().describe('An overall summary of location-based insights.'),
});
export type LocationBasedInsightsOutput = z.infer<typeof LocationBasedInsightsOutputSchema>;

export async function getLocationBasedInsights(input: LocationBasedInsightsInput): Promise<LocationBasedInsightsOutput> {
  return locationBasedInsightsFlow(input);
}

const locationBasedInsightsPrompt = ai.definePrompt({
  name: 'locationBasedInsightsPrompt',
  input: {schema: LocationBasedInsightsInputSchema},
  output: {schema: LocationBasedInsightsOutputSchema},
  prompt: `Given the following sales data: {{{salesData}}}, and focusing on the product: {{{productOfInterest}}}, identify geographic areas with high, medium, and low demand.

      Provide a list of geographic areas with their demand levels and reasoning. Also, provide an overall summary of the insights.

      Format the output as a JSON object. Make sure the geographicAreas is an array of objects, where each object has location, demandLevel, and reasoning fields.
`,
});

const locationBasedInsightsFlow = ai.defineFlow(
  {
    name: 'locationBasedInsightsFlow',
    inputSchema: LocationBasedInsightsInputSchema,
    outputSchema: LocationBasedInsightsOutputSchema,
  },
  async input => {
    const {output} = await locationBasedInsightsPrompt(input);
    return output!;
  }
);
