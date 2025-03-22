
import React, { useState } from 'react';
import { DollarSign, Target, BarChart4, Users } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const SalesExecutiveDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      incentiveTarget: '',
      achievedRevenue: '',
      leadsAssigned: '',
      salesUnit: ''
    },
  });

  const analyticsData = [
    {
      id: '1',
      title: 'Achieved Revenue',
      value: 125000,
      percentChange: 8.5,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Leads Assigned',
      value: 145,
      percentChange: 12.4,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Conversion Ratio',
      value: 28.4,
      percentChange: 3.2,
      trend: 'up' as const,
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'Incentive Target',
      value: 150000,
      percentChange: 0,
      trend: 'neutral' as const,
      icon: <Target className="h-5 w-5 text-primary" />,
    },
  ];
  
  const incentiveData = [
    { name: 'Achieved', value: 83 },
    { name: 'Remaining', value: 17 },
  ];
  
  const conversionTrendData = [
    { name: 'Week 1', Conversion: 24 },
    { name: 'Week 2', Conversion: 26 },
    { name: 'Week 3', Conversion: 29 },
    { name: 'Week 4', Conversion: 27 },
    { name: 'Week 5', Conversion: 32 },
    { name: 'Week 6', Conversion: 31 },
    { name: 'Week 7', Conversion: 34 },
    { name: 'Week 8', Conversion: 35 },
  ];

  const onSubmit = (data: any) => {
    console.log(data);
    setIsFormOpen(false);
    // Here you would normally update the data in your backend
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Input Sales Data</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {!isFormOpen ? (
              <Button onClick={() => setIsFormOpen(true)}>Add New Data</Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="incentiveTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incentive Target (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="150000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="achievedRevenue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Achieved Revenue (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="125000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leadsAssigned"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Leads Assigned</FormLabel>
                        <FormControl>
                          <Input placeholder="145" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salesUnit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Unit</FormLabel>
                        <FormControl>
                          <Input placeholder="Team A" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
        
        <ChartCard 
          title="Incentive Achievement" 
          subtitle="Percentage of target achieved"
          data={incentiveData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#E6EFFF']}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ChartCard 
          title="Conversion Ratio Trend" 
          subtitle="Weekly conversion ratio"
          data={conversionTrendData}
          type="line"
          dataKey="name"
          categories={['Conversion']}
          colors={['#0159FF']}
        />
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
