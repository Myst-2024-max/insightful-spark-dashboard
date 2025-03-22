
import React, { useState } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';

const GrowthTeamDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const form = useForm({
    defaultValues: {
      spend: '',
      leadTarget: '',
      programName: ''
    },
  });

  const analyticsData = [
    {
      id: '1',
      title: 'Ad Spend',
      value: 85000,
      percentChange: 5.2,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Lead Target',
      value: 1200,
      percentChange: 10.0,
      trend: 'up' as const,
      icon: <Target className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Leads Generated',
      value: 945,
      percentChange: 8.7,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'CPL',
      value: 90,
      percentChange: -3.2,
      trend: 'down' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
  ];
  
  const targetAchievedData = [
    { name: 'Achieved', value: 79 },
    { name: 'Remaining', value: 21 },
  ];
  
  const spendByProgramData = [
    { name: 'Web Development', value: 28000 },
    { name: 'UI/UX Design', value: 22000 },
    { name: 'Digital Marketing', value: 19000 },
    { name: 'Financial Analysis', value: 16000 },
  ];
  
  const leadsBySourceData = [
    { name: 'Week 1', Facebook: 85, Instagram: 65, Google: 45 },
    { name: 'Week 2', Facebook: 92, Instagram: 72, Google: 51 },
    { name: 'Week 3', Facebook: 87, Instagram: 79, Google: 48 },
    { name: 'Week 4', Facebook: 95, Instagram: 85, Google: 55 },
    { name: 'Week 5', Facebook: 105, Instagram: 92, Google: 61 },
    { name: 'Week 6', Facebook: 112, Instagram: 95, Google: 58 },
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
            <CardTitle>Input Growth Data</CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            {!isFormOpen ? (
              <Button onClick={() => setIsFormOpen(true)}>Add New Data</Button>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="spend"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ad Spend (₹)</FormLabel>
                        <FormControl>
                          <Input placeholder="85000" {...field} />
                        </FormControl>
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
                          <Input placeholder="1200" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="programName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Program Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Web Development" {...field} />
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
          title="Target Achievement" 
          subtitle="Percentage of lead target achieved"
          data={targetAchievedData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#E6EFFF']}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Spend by Program" 
          subtitle="Distribution of ad spend across programs"
          data={spendByProgramData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
        />
        
        <ChartCard 
          title="Leads by Source" 
          subtitle="Weekly leads generated by platform"
          data={leadsBySourceData}
          type="line"
          dataKey="name"
          categories={['Facebook', 'Instagram', 'Google']}
          colors={['#0159FF', '#3385FF', '#66A3FF']}
        />
      </div>
    </div>
  );
};

export default GrowthTeamDashboard;
