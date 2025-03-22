
import React, { useState } from 'react';
import { Users, Target, DollarSign, TrendingUp, Zap } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const TeamLeadDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      salesExecutive: '',
      leadTarget: '',
      incentiveTarget: ''
    },
  });

  const analyticsData = [
    {
      id: '1',
      title: 'Lead Count',
      value: 324,
      percentChange: 12.5,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Spend-Revenue Ratio',
      value: 16.8,
      percentChange: -2.3,
      trend: 'down' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Fresh Admissions',
      value: 118000,
      percentChange: 8.7,
      trend: 'up' as const,
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'ARPPU',
      value: 45000,
      percentChange: 5.2,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
  ];
  
  const targetDiffData = [
    { name: 'Exec 1', target: 45, achieved: 38 },
    { name: 'Exec 2', target: 40, achieved: 42 },
    { name: 'Exec 3', target: 50, achieved: 47 },
    { name: 'Exec 4', target: 35, achieved: 32 },
    { name: 'Exec 5', target: 45, achieved: 41 },
  ];
  
  const cplTrendData = [
    { name: 'Jan', CPL: 920 },
    { name: 'Feb', CPL: 880 },
    { name: 'Mar', CPL: 850 },
    { name: 'Apr', CPL: 830 },
    { name: 'May', CPL: 810 },
    { name: 'Jun', CPL: 790 },
  ];
  
  const conversionRatioData = [
    { name: 'Jan', ratio: 28 },
    { name: 'Feb', ratio: 29 },
    { name: 'Mar', ratio: 31 },
    { name: 'Apr', ratio: 32 },
    { name: 'May', ratio: 34 },
    { name: 'Jun', ratio: 35 },
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
            <CardTitle>Set Targets</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {!isFormOpen ? (
              <Button onClick={() => setIsFormOpen(true)}>Set New Target</Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="salesExecutive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sales Executive</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select executive" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="exec1">Executive 1</SelectItem>
                            <SelectItem value="exec2">Executive 2</SelectItem>
                            <SelectItem value="exec3">Executive 3</SelectItem>
                            <SelectItem value="exec4">Executive 4</SelectItem>
                            <SelectItem value="exec5">Executive 5</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leadTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Target</FormLabel>
                        <FormControl>
                          <Input placeholder="45" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="incentiveTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Incentive Target (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="120000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-2">
                    <Button type="submit">Save Target</Button>
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
          title="Target vs Achieved" 
          subtitle="Lead targets versus achieved by executive"
          data={targetDiffData}
          type="bar"
          dataKey="name"
          categories={['target', 'achieved']}
          colors={['#0159FF', '#66A3FF']}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="CPL Trend" 
          subtitle="Cost per lead monthly trend"
          data={cplTrendData}
          type="line"
          dataKey="name"
          categories={['CPL']}
          colors={['#0159FF']}
        />
        
        <ChartCard 
          title="Conversion Ratio" 
          subtitle="Monthly conversion ratio trend"
          data={conversionRatioData}
          type="area"
          dataKey="name"
          categories={['ratio']}
          colors={['#0159FF']}
        />
      </div>
    </div>
  );
};

export default TeamLeadDashboard;
