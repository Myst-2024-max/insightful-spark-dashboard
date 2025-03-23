
import React, { useState, useEffect } from 'react';
import { Users, Target, DollarSign, TrendingUp, Zap, UserCircle, Award } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SalesExecutivePerformance } from '@/lib/types';

const TeamLeadDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedExecutive, setSelectedExecutive] = useState<string | null>(null);
  
  const form = useForm({
    defaultValues: {
      salesExecutive: '',
      leadTarget: '',
      incentiveTarget: ''
    },
  });

  // Mock data for sales executives under this team lead
  const salesExecutives = [
    { id: 'exec1', name: 'John Smith' },
    { id: 'exec2', name: 'Emily Johnson' },
    { id: 'exec3', name: 'Michael Brown' },
    { id: 'exec4', name: 'Sarah Williams' },
    { id: 'exec5', name: 'David Jones' },
  ];
  
  // Mock performance data for sales executives
  const executivePerformance: SalesExecutivePerformance[] = [
    {
      id: 'exec1',
      name: 'John Smith',
      targetValue: 120000,
      achievedValue: 135000,
      achievementPercentage: 112.5,
      trend: 'up',
    },
    {
      id: 'exec2',
      name: 'Emily Johnson',
      targetValue: 100000,
      achievedValue: 92000,
      achievementPercentage: 92.0,
      trend: 'down',
    },
    {
      id: 'exec3',
      name: 'Michael Brown',
      targetValue: 115000,
      achievedValue: 118500,
      achievementPercentage: 103.0,
      trend: 'up',
    },
    {
      id: 'exec4',
      name: 'Sarah Williams',
      targetValue: 90000,
      achievedValue: 78000,
      achievementPercentage: 86.7,
      trend: 'down',
    },
    {
      id: 'exec5',
      name: 'David Jones',
      targetValue: 110000,
      achievedValue: 110000,
      achievementPercentage: 100.0,
      trend: 'neutral',
    },
  ];

  const analyticsData = [
    {
      id: '1',
      title: 'Lead Count',
      value: 324,
      percentChange: 12.5,
      trend: 'up' as const,
      icon: Users,
    },
    {
      id: '2',
      title: 'Spend-Revenue Ratio',
      value: 16.8,
      percentChange: -2.3,
      trend: 'down' as const,
      icon: TrendingUp,
    },
    {
      id: '3',
      title: 'Fresh Admissions',
      value: 118000,
      percentChange: 8.7,
      trend: 'up' as const,
      icon: Zap,
    },
    {
      id: '4',
      title: 'ARPPU',
      value: 45000,
      percentChange: 5.2,
      trend: 'up' as const,
      icon: DollarSign,
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
  
  // Get performance for a specific executive
  const getExecutivePerformance = (execId: string) => {
    return executivePerformance.find(exec => exec.id === execId) || null;
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard">Team Dashboard</TabsTrigger>
          <TabsTrigger value="executives">Sales Executives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map(data => (
              <DataCard key={data.id} data={data} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
                                {salesExecutives.map(exec => (
                                  <SelectItem key={exec.id} value={exec.id}>{exec.name}</SelectItem>
                                ))}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
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
        </TabsContent>
        
        <TabsContent value="executives" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Executives</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {salesExecutives.map(exec => (
                      <Button 
                        key={exec.id} 
                        variant={selectedExecutive === exec.id ? "default" : "outline"} 
                        className="w-full justify-start"
                        onClick={() => setSelectedExecutive(exec.id)}
                      >
                        <UserCircle className="mr-2 h-4 w-4" />
                        {exec.name}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              {selectedExecutive ? (
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {getExecutivePerformance(selectedExecutive)?.name}'s Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {getExecutivePerformance(selectedExecutive) && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <DataCard 
                            data={{
                              title: "Target Value",
                              value: getExecutivePerformance(selectedExecutive)!.targetValue,
                              percentChange: 0,
                              trend: "neutral",
                              icon: Target
                            }} 
                          />
                          <DataCard 
                            data={{
                              title: "Achieved Value",
                              value: getExecutivePerformance(selectedExecutive)!.achievedValue,
                              percentChange: getExecutivePerformance(selectedExecutive)!.achievementPercentage - 100,
                              trend: getExecutivePerformance(selectedExecutive)!.trend,
                              icon: DollarSign
                            }} 
                          />
                          <DataCard 
                            data={{
                              title: "Achievement",
                              value: `${getExecutivePerformance(selectedExecutive)!.achievementPercentage}%`,
                              percentChange: getExecutivePerformance(selectedExecutive)!.achievementPercentage - 100,
                              trend: getExecutivePerformance(selectedExecutive)!.trend,
                              icon: Award
                            }} 
                          />
                        </div>
                        
                        <div className="mt-6">
                          <Button 
                            onClick={() => {
                              form.reset({
                                salesExecutive: selectedExecutive,
                                leadTarget: '',
                                incentiveTarget: ''
                              });
                              setIsFormOpen(true);
                              setActiveView('dashboard');
                            }}
                          >
                            Update {getExecutivePerformance(selectedExecutive)?.name}'s Targets
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center h-full p-12 border rounded-lg border-dashed">
                  <div className="text-center">
                    <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No Executive Selected</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a sales executive from the list to view their performance
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadDashboard;
