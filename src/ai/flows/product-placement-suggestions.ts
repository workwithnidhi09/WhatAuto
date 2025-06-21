'use server';

/**
 * @fileOverview A product placement suggestion AI agent.
 *
 * - getProductPlacementSuggestions - A function that handles the product placement suggestion process.
 * - ProductPlacementSuggestionsInput - The input type for the getProductPlacementSuggestions function.
 * - ProductPlacementSuggestionsOutput - The return type for the getProductPlacementSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProductPlacementSuggestionsInputSchema = z.object({
  salesData: z
    .string()
    .describe(
      'Sales data of the retailer, including product-wise sales, category-wise sales, and location-wise sales.'
    ),
  storeLayout: z
    .string()
    .describe('The current layout of the store, including the location of each product category.'),
  caseStudies: z
    .string()
    .describe('Successful case studies from similar retailers regarding product placement.'),
});
export type ProductPlacementSuggestionsInput = z.infer<
  typeof ProductPlacementSuggestionsInputSchema
>;

const ProductPlacementSuggestionsOutputSchema = z.object({
  suggestions: z
    .string()
    .describe(
      'A list of product placement suggestions, including the recommended location for each product category and the rationale behind the suggestion.'
    ),
});
export type ProductPlacementSuggestionsOutput = z.infer<
  typeof ProductPlacementSuggestionsOutputSchema
>;

export async function getProductPlacementSuggestions(
  input: ProductPlacementSuggestionsInput
): Promise<ProductPlacementSuggestionsOutput> {
  return productPlacementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'productPlacementSuggestionsPrompt',
  input: {schema: ProductPlacementSuggestionsInputSchema},
  output: {schema: ProductPlacementSuggestionsOutputSchema},
  prompt: `You are an expert retail consultant specializing in product placement.

You will use the retailer's sales data, store layout, and successful case studies from similar retailers to generate a list of product placement suggestions.

Sales Data: {{{salesData}}}
Store Layout: {{{storeLayout}}}
Case Studies: {{{caseStudies}}}

Consider the following when making your suggestions:

* Maximize cross-selling opportunities
* Increase overall sales
* Optimize inventory
* Improve product placement

Output the suggestions in a clear and concise manner, including the recommended location for each product category and the rationale behind the suggestion.
`,
});

const productPlacementSuggestionsFlow = ai.defineFlow(
  {
    name: 'productPlacementSuggestionsFlow',
    inputSchema: ProductPlacementSuggestionsInputSchema,
    outputSchema: ProductPlacementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
