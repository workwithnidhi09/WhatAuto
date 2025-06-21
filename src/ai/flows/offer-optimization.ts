'use server';

/**
 * @fileOverview Bundling and Offer Suggestions AI agent.
 *
 * - offerOptimization - A function that handles the offer optimization process.
 * - OfferOptimizationInput - The input type for the offerOptimization function.
 * - OfferOptimizationOutput - The return type for the offerOptimization function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OfferOptimizationInputSchema = z.object({
  productSalesData: z
    .string()
    .describe(
      'Sales data for various products, including product names, quantities sold, and transaction dates. Should be formatted as a JSON string.'
    ),
  frequentlyPurchasedTogether: z
    .string()
    .describe(
      'List of products that are frequently purchased together, formatted as a JSON string.'
    ),
});
export type OfferOptimizationInput = z.infer<typeof OfferOptimizationInputSchema>;

const OfferOptimizationOutputSchema = z.object({
  bundleSuggestions: z.array(
    z.object({
      bundleName: z.string().describe('A descriptive name for the bundle offer.'),
      products: z.array(z.string()).describe('List of products included in the bundle.'),
      suggestedPrice: z.number().describe('The suggested price for the bundle.'),
      estimatedSalesIncrease: z
        .string()
        .describe('The estimated percentage increase in sales from offering this bundle.'),
      reasoning: z
        .string()
        .describe(
          'Explanation of why this bundle is expected to perform well, based on co-purchasing patterns and sales data.'
        ),
    })
  ),
  comboSuggestions: z.array(
    z.object({
      comboName: z.string().describe('A descriptive name for the combo offer.'),
      products: z.array(z.string()).describe('List of products included in the combo.'),
      discountPercentage: z.number().describe('The percentage discount offered in this combo.'),
      conditions: z.string().describe('Any conditions that apply to the combo offer (e.g., minimum purchase quantity).'),
      estimatedSalesIncrease: z
        .string()
        .describe('The estimated percentage increase in sales from offering this combo.'),
      reasoning: z
        .string()
        .describe(
          'Explanation of why this combo is expected to perform well, based on co-purchasing patterns and sales data.'
        ),
    })
  ),
});
export type OfferOptimizationOutput = z.infer<typeof OfferOptimizationOutputSchema>;

export async function offerOptimization(input: OfferOptimizationInput): Promise<OfferOptimizationOutput> {
  return offerOptimizationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'offerOptimizationPrompt',
  input: {schema: OfferOptimizationInputSchema},
  output: {schema: OfferOptimizationOutputSchema},
  prompt: `You are a marketing expert specializing in creating bundle and combo offers for retail businesses.

  Based on the provided sales data and frequently purchased together products, generate a list of compelling bundle and combo suggestions to boost sales and increase customer satisfaction.

  Sales Data: {{{productSalesData}}}
  Frequently Purchased Together Products: {{{frequentlyPurchasedTogether}}}

  Consider factors such as product compatibility, purchase frequency, and potential discount percentages when creating the suggestions.

  Ensure that the reasoning behind each suggestion is clearly articulated, explaining why the bundle or combo is expected to perform well.

  Present at least 3 bundle suggestions and 3 combo suggestions. Focus on offers that provide clear value to customers and are likely to drive incremental sales.

  Bundles should contain products typically purchased together, and the suggested price should reflect a discount compared to purchasing the items individually. Combos might require a minimum purchase to be activated.
  `,
});

const offerOptimizationFlow = ai.defineFlow(
  {
    name: 'offerOptimizationFlow',
    inputSchema: OfferOptimizationInputSchema,
    outputSchema: OfferOptimizationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
