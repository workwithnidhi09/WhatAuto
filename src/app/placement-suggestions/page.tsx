
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
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
import { salesData, storeLayout, caseStudies } from '@/data/mock-data';
import type { ProductPlacementSuggestionsOutput } from '@/ai/flows/product-placement-suggestions';
import { generatePlacementSuggestionsAction } from '@/lib/actions';

const formSchema = z.object({
  salesData: z.string().min(1, 'Sales data is required.'),
  storeLayout: z.string().min(1, 'Store layout is required.'),
  caseStudies: z.string().min(1, 'Case studies are required.'),
});

export default function PlacementSuggestionsPage() {
  const [result, setResult] = useState<ProductPlacementSuggestionsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesData: JSON.stringify(salesData, null, 2),
      storeLayout: JSON.stringify(storeLayout, null, 2),
      caseStudies: caseStudies,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await generatePlacementSuggestionsAction(values);

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
        title="Product Placement Suggestions"
        description="Arrange products in-store to maximize cross-selling opportunities."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Placement</CardTitle>
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
                        <Textarea {...field} rows={8} placeholder="Enter your sales data." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="storeLayout"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Layout (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} placeholder="Describe your store layout." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="caseStudies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Case Studies</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} placeholder="Provide relevant case studies." />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Generate Suggestions
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
                <p>Thinking about placements...</p>
              </div>
            </Card>
          )}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Placement Suggestions</CardTitle>
                <CardDescription>
                  Based on your data and successful strategies.
                </CardDescription>
              </CardHeader>
              <CardContent className="prose prose-sm dark:prose-invert max-w-none">
                {result.suggestions.split('\n').map((line, index) => {
                    if (line.startsWith('*')) {
                        return <p key={index} className="!my-2">{line.replace('*', '• ')}</p>;
                    }
                    if (line.trim() === '') {
                        return <br key={index} />;
                    }
                    return <h4 key={index} className="!mt-4 !mb-2">{line}</h4>
                })}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
