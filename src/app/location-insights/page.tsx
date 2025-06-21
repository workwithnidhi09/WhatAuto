
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { salesData, productList } from '@/data/mock-data';
import type { LocationBasedInsightsOutput } from '@/ai/flows/location-based-insights';
import { generateLocationInsightsAction } from '@/lib/actions';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const formSchema = z.object({
  salesData: z.string().min(1, 'Sales data is required.'),
  productOfInterest: z.string().min(1, 'Product of interest is required.'),
});

export default function LocationInsightsPage() {
  const [result, setResult] = useState<LocationBasedInsightsOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salesData: JSON.stringify(salesData, null, 2),
      productOfInterest: 'Organic Bananas',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setResult(null);

    const response = await generateLocationInsightsAction(values);

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
        title="Location-Based Insights"
        description="Identify geographic areas with higher demand for specific products."
      />
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analyze Demand</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="productOfInterest"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Product of Interest</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {productList.map((product) => (
                            <SelectItem key={product} value={product}>
                              {product}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="salesData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sales Data (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={10} placeholder="Enter your sales data in JSON format." />
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
                <p>Analyzing locations...</p>
              </div>
            </Card>
          )}

          {result && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div>
                    <h3 className="font-semibold mb-2">Overall Summary</h3>
                    <p className="text-sm text-muted-foreground">{result.overallSummary}</p>
                </div>
                 <div>
                    <h3 className="font-semibold mb-2">Demand by Location</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Location</TableHead>
                                <TableHead>Demand</TableHead>
                                <TableHead>Reasoning</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {result.geographicAreas.map(area => (
                                <TableRow key={area.location}>
                                    <TableCell className="font-medium">{area.location}</TableCell>
                                    <TableCell>{area.demandLevel}</TableCell>
                                    <TableCell className="text-sm text-muted-foreground">{area.reasoning}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
