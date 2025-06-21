
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
import { salesData, frequentlyPurchasedTogether } from '@/data/mock-data';
import type { OfferOptimizationOutput } from '@/ai/flows/offer-optimization';
import { generateOfferOptimizationAction } from '@/lib/actions';
import { Badge } from '@/components/ui/badge';

const formSchema = z.object({
  productSalesData: z.string().min(1, 'Sales data is required.'),
  frequentlyPurchasedTogether: z.string().min(1, 'Frequently purchased together data is required.'),
});

export default function OfferOptimizationPage() {
  const [result, setResult] = useState<OfferOptimizationOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productSalesData: JSON.stringify(salesData, null, 2),
      frequentlyPurchasedTogether: JSON.stringify(frequentlyPurchasedTogether, null, 2),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await generateOfferOptimizationAction(values);
    
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
        title="Offer Optimization"
        description="Generate bundle and combo suggestions to boost sales."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Offers</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="productSalesData"
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
                  name="frequentlyPurchasedTogether"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequently Purchased Together (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} placeholder="Enter frequently co-purchased items." />
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
                <p>Generating offers...</p>
              </div>
            </Card>
          )}
          {result && (
            <div className='space-y-8'>
              <Card>
                <CardHeader>
                    <CardTitle>Bundle Suggestions</CardTitle>
                    <CardDescription>Value packages to encourage larger purchases.</CardDescription>
                </CardHeader>
                <CardContent className='space-y-4'>
                    {result.bundleSuggestions.map((bundle, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                            <div className='flex justify-between items-start'>
                                <h4 className='font-semibold'>{bundle.bundleName}</h4>
                                <Badge variant="secondary">Est. {bundle.estimatedSalesIncrease} Sales Lift</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{bundle.reasoning}</p>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p className="text-xs font-medium">Products:</p>
                                    <div className='flex gap-2 flex-wrap mt-1'>
                                        {bundle.products.map(p => <Badge key={p} variant="outline">{p}</Badge>)}
                                    </div>
                                </div>
                                <p className="text-lg font-bold text-primary">${bundle.suggestedPrice.toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
              </Card>
               <Card>
                <CardHeader>
                    <CardTitle>Combo Suggestions</CardTitle>
                    <CardDescription>Discounted combinations to drive sales of specific items.</CardDescription>
                </CardHeader>
                 <CardContent className='space-y-4'>
                    {result.comboSuggestions.map((combo, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-2">
                            <div className='flex justify-between items-start'>
                                <h4 className='font-semibold'>{combo.comboName}</h4>
                                <Badge variant="secondary">Est. {combo.estimatedSalesIncrease} Sales Lift</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{combo.reasoning}</p>
                            <div className='flex justify-between items-end'>
                                <div>
                                    <p className="text-xs font-medium">Products:</p>
                                    <div className='flex gap-2 flex-wrap mt-1'>
                                        {combo.products.map(p => <Badge key={p} variant="outline">{p}</Badge>)}
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">Conditions: {combo.conditions}</p>
                                </div>
                                <p className="text-lg font-bold text-primary">{combo.discountPercentage}% OFF</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
