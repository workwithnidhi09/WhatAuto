'use server';

/**
 * @fileOverview Product insights flow that analyzes sales data to identify hidden patterns.
 *
 * - getProductInsights - A function that analyzes sales data and returns product insights.
 * - ProductInsightsInput - The input type for the getProductInsights function.
 * - ProductInsightsOutput - The return type for the getProductInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductInsightsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'Sales data in JSON format.  Each object should contain fields like product_id, product_name, category, quantity_sold, price, transaction_date.'
    ),
});
export type ProductInsightsInput = z.infer<typeof ProductInsightsInputSchema>;

const ProductInsightsOutputSchema = z.object({
  frequentlyPurchasedTogether: z
    .array(z.tuple([z.string(), z.string()]))
    .describe(
      'An array of product ID tuples that are frequently purchased together.'
    ),
  salesTrends: z
    .string()
    .describe(
      'Description of sales trends discovered from the sales data, such as seasonal trends or popular products.'
    ),
  suggestedBundles: z
    .array(z.tuple([z.string(), z.string()]))
    .describe(
      'Suggested product bundles based on purchase history, represented as an array of product ID tuples.'
    ),
});
export type ProductInsightsOutput = z.infer<typeof ProductInsightsOutputSchema>;

export async function getProductInsights(input: ProductInsightsInput): Promise<ProductInsightsOutput> {
  return productInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productInsightsPrompt',
  input: {schema: ProductInsightsInputSchema},
  output: {schema: ProductInsightsOutputSchema},
  prompt: `You are an expert retail sales data analyst.

Analyze the following sales data to identify hidden patterns, sales trends, and suggest product bundles.  Return the results in JSON format.

Sales Data: {{{salesData}}}

Output should include:
- frequentlyPurchasedTogether: An array of product ID tuples that are frequently purchased together. For example [ ["product_A", "product_B"], ["product_C", "product_D"] ].
- salesTrends: Description of sales trends discovered from the sales data, such as seasonal trends or popular products.
- suggestedBundles: Suggested product bundles based on purchase history, represented as an array of product ID tuples. For example: [ ["product_A", "product_B"], ["product_C", "product_D"] ].
`,
});

const productInsightsFlow = ai.defineFlow(
  {
    name: 'productInsightsFlow',
    inputSchema: ProductInsightsInputSchema,
    outputSchema: ProductInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
