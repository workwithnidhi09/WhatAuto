
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Loader2 } from 'lucide-react';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { salesData } from '@/data/mock-data';
import type { ProductInsightsOutput } from '@/ai/flows/product-insights';
import { generateProductInsightsAction } from '@/lib/actions';

const formSchema = z.object({
  salesData: z.string().min(1, 'Sales data is required.'),
});

export default function ProductInsightsPage() {
  const [result, setResult] = useState<ProductInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesData: JSON.stringify(salesData, null, 2),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await generateProductInsightsAction(values);

    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: response.error,
      });
    } else {
      setResult(response);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="ML-Powered Product Insights"
        description="Detect hidden sales patterns and trends from your sales data."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Sales Data</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="salesData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={15}
                          placeholder="Enter your sales data in JSON format."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Insights
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {loading && (
             <Card className="flex h-full min-h-[500px] items-center justify-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p>Analyzing data...</p>
              </div>
            </Card>
          )}

          {result && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trends</CardTitle>
                  <CardDescription>
                    Key trends identified from the data provided.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result.salesTrends}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Frequently Purchased Together</CardTitle>
                  <CardDescription>
                    Products that customers often buy in the same transaction.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.frequentlyPurchasedTogether.map((pair, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span>{pair[0]}</span>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      <span>{pair[1]}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

               <Card>
                <CardHeader>
                  <CardTitle>Suggested Bundles</CardTitle>
                  <CardDescription>
                    Potential product bundles based on purchasing behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.suggestedBundles.map((pair, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <span>{pair[0]}</span>
                      <span className="text-muted-foreground">+</span>
                      <span>{pair[1]}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
