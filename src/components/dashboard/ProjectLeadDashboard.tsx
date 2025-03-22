
import React, { useState } from 'react';
import { Target, Users, DollarSign, TrendingUp, BarChart4, Zap } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/auth/AuthContext';

const ProjectLeadDashboard = () => {
  const { user } = useAuth();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      monthlyTarget: '',
      paidUserTarget: '',
      leadCount: ''
    },
  });

  const analyticsData = [
    {
      id: '1',
      title: 'Total Leads Needed',
      value: 350,
      percentChange: 5.2,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Conversion Ratio',
      value: 32.5,
      percentChange: 3.8,
      trend: 'up' as const,
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Spend-Revenue Ratio',
      value: 18.4,
      percentChange: -2.1,
      trend: 'down' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'Fresh Admissions',
      value: 85000,
      percentChange: 7.5,
      trend: 'up' as const,
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
  ];
  
  const secondMetrics = [
    {
      id: '5',
      title: 'Second EMI',
      value: 62000,
      percentChange: 6.3,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '6',
      title: 'ARPPU',
      value: 38500,
      percentChange: 4.2,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '7',
      title: 'CPL',
      value: 780,
      percentChange: -3.5,
      trend: 'down' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
  ];
  
  const targetAchievedData = [
    { name: 'Achieved', value: 72 },
    { name: 'Remaining', value: 28 },
  ];
  
  const monthlyPerformanceData = [
    { name: 'Jan', target: 35, achieved: 32 },
    { name: 'Feb', target: 40, achieved: 38 },
    { name: 'Mar', target: 45, achieved: 41 },
    { name: 'Apr', target: 50, achieved: 47 },
    { name: 'May', target: 55, achieved: 52 },
    { name: 'Jun', target: 60, achieved: 43 },
  ];
  
  const conversionByChannelData = [
    { name: 'Website', rate: 28 },
    { name: 'Social Media', rate: 35 },
    { name: 'Email', rate: 22 },
    { name: 'Referral', rate: 42 },
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
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Set Targets for {user?.department} School</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {!isFormOpen ? (
              <Button onClick={() => setIsFormOpen(true)}>Set New Target</Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="monthlyTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Monthly Revenue Target (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="120000" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="paidUserTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Paid User Target</FormLabel>
                        <FormControl>
                          <Input placeholder="45" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="leadCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lead Count Target</FormLabel>
                        <FormControl>
                          <Input placeholder="350" {...field} />
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
        
        <div className="lg:col-span-2">
          <ChartCard 
            title="Monthly Performance" 
            subtitle="Monthly target versus achieved"
            data={monthlyPerformanceData}
            type="bar"
            dataKey="name"
            categories={['target', 'achieved']}
            colors={['#0159FF', '#66A3FF']}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          {secondMetrics.map(data => (
            <DataCard key={data.id} data={data} />
          ))}
        </div>
        
        <ChartCard 
          title="Target Achievement" 
          subtitle="Overall target achievement percentage"
          data={targetAchievedData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#E6EFFF']}
          className="lg:col-span-1"
        />
        
        <ChartCard 
          title="Conversion by Channel" 
          subtitle="Conversion rate by marketing channel"
          data={conversionByChannelData}
          type="bar"
          dataKey="name"
          categories={['rate']}
          colors={['#0159FF']}
          className="lg:col-span-1"
        />
      </div>
    </div>
  );
};

export default ProjectLeadDashboard;
