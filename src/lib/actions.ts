
'use server';

import { z } from 'zod';
import { getProductInsights, type ProductInsightsOutput } from '@/ai/flows/product-insights';
import { getProductPlacementSuggestions, type ProductPlacementSuggestionsOutput } from '@/ai/flows/product-placement-suggestions';
import { getLocationBasedInsights, type LocationBasedInsightsOutput } from '@/ai/flows/location-based-insights';
import { offerOptimization, type OfferOptimizationOutput } from '@/ai/flows/offer-optimization';


export const generateProductInsightsAction = async (values: { salesData: string }): Promise<ProductInsightsOutput | { error: string }> => {
  try {
    return await getProductInsights({ salesData: values.salesData });
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
};


export const generatePlacementSuggestionsAction = async (values: { salesData: string; storeLayout: string; caseStudies: string; }): Promise<ProductPlacementSuggestionsOutput | { error: string }> => {
    try {
        return await getProductPlacementSuggestions(values);
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
};

export const generateLocationInsightsAction = async (values: { salesData: string; productOfInterest: string; }): Promise<LocationBasedInsightsOutput | { error: string }> => {
    try {
        return await getLocationBasedInsights(values);
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
};

export const generateOfferOptimizationAction = async (values: { productSalesData: string; frequentlyPurchasedTogether: string; }): Promise<OfferOptimizationOutput | { error: string }> => {
    try {
        return await offerOptimization(values);
    } catch (e: any) {
        return { error: e.message || 'An unexpected error occurred.' };
    }
}
