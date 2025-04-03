import React, { useState, useEffect } from 'react';
import { Target, Users, DollarSign, TrendingUp, BarChart4, Zap, Calendar } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/components/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AnalyticsData } from '@/lib/types';
import { getIconForMetric } from '@/utils/dashboardUtils';
import DateFilter from '@/components/dashboard/DateFilter';

interface ProjectLeadDashboardProps {
  department?: string;
}

const ProjectLeadDashboard: React.FC<ProjectLeadDashboardProps> = ({ department }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [secondMetrics, setSecondMetrics] = useState<AnalyticsData[]>([]);
  const [targetAchievedData, setTargetAchievedData] = useState<any[]>([]);
  const [monthlyPerformanceData, setMonthlyPerformanceData] = useState<any[]>([]);
  const [conversionByChannelData, setConversionByChannelData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeDepartment, setActiveDepartment] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState({ 
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1), // First day of current month
    to: new Date()  // Today
  });

  useEffect(() => {
    if (department) {
      setActiveDepartment(department);
    } else if (user?.department) {
      setActiveDepartment(user.department);
    }
  }, [department, user?.department]);

  const form = useForm({
    defaultValues: {
      monthlyTarget: '',
      paidUserTarget: '',
      leadCount: ''
    },
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      if (!activeDepartment) return;

      setIsLoading(true);
      
      try {
        console.log(`Fetching metrics for department: ${activeDepartment}`);
        
        const fromDate = dateRange.from.toISOString().split('T')[0];
        const toDate = dateRange.to.toISOString().split('T')[0];
        
        const { data: metricsData, error: metricsError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .eq('department', activeDepartment);

        if (metricsError) {
          console.error("Error fetching metrics:", metricsError);
          throw metricsError;
        }

        console.log("Fetched metrics data:", metricsData);

        const metricsMap = new Map();

        if (metricsData && metricsData.length > 0) {
          const mainMetricsOrder = ['ARPPU', 'Spend-Revenue Ratio', 'Fresh Admissions', 'Total Leads Needed', 'Conversion Ratio'];
          const secondaryMetricsNames = ['Second EMI', 'CPL'];
          
          metricsData.forEach(metric => {
            metricsMap.set(metric.metric_name, metric);
          });

          const primaryMetrics = Array.from(metricsMap.values())
            .filter(metric => mainMetricsOrder.includes(metric.metric_name))
            .sort((a, b) => {
              return mainMetricsOrder.indexOf(a.metric_name) - mainMetricsOrder.indexOf(b.metric_name);
            })
            .map((metric, index) => {
              return {
                id: index.toString(),
                title: metric.metric_name,
                value: metric.metric_value,
                percentChange: metric.percent_change || 0,
                trend: (metric.trend as 'up' | 'down' | 'neutral') || 'neutral',
                icon: getIconForMetric(metric.metric_name)
              };
            });
          
          setAnalyticsData(primaryMetrics);

          const secondary = Array.from(metricsMap.values())
            .filter(metric => secondaryMetricsNames.includes(metric.metric_name))
            .map((metric, index) => {
              return {
                id: (index + primaryMetrics.length).toString(),
                title: metric.metric_name,
                value: metric.metric_value,
                percentChange: metric.percent_change || 0,
                trend: (metric.trend as 'up' | 'down' | 'neutral') || 'neutral',
                icon: getIconForMetric(metric.metric_name)
              };
            });
          
          setSecondMetrics(secondary);
        } else {
          console.log(`No metrics data found for department: ${activeDepartment}`);
          setAnalyticsData([]);
          setSecondMetrics([]);
        }

        const { data: chartsData, error: chartsError } = await supabase
          .from('dashboard_charts')
          .select('*')
          .eq('department', activeDepartment);

        if (chartsError) {
          console.error("Error fetching charts:", chartsError);
          throw chartsError;
        }

        console.log("Fetched charts data:", chartsData);

        if (chartsData && chartsData.length > 0) {
          chartsData.forEach(chart => {
            const chartData = typeof chart.chart_data === 'string'
              ? JSON.parse(chart.chart_data)
              : chart.chart_data;
              
            switch (chart.chart_name) {
              case 'Target Achievement':
                setTargetAchievedData(chartData);
                break;
              case 'Monthly Performance':
                setMonthlyPerformanceData(chartData);
                break;
              case 'Conversion by Channel':
                setConversionByChannelData(chartData);
                break;
              default:
                break;
            }
          });
        } else {
          console.log(`No charts data found for department: ${activeDepartment}`);
          setTargetAchievedData([]);
          setMonthlyPerformanceData([]);
          setConversionByChannelData([]);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not load dashboard data. Please try again.",
          variant: "destructive",
        });
        setAnalyticsData([]);
        setSecondMetrics([]);
        setTargetAchievedData([]);
        setMonthlyPerformanceData([]);
        setConversionByChannelData([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (activeDepartment) {
      fetchMetrics();

      const channel = supabase
        .channel('dashboard-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'dashboard_metrics',
            filter: `department=eq.${activeDepartment}`
          },
          (payload) => {
            console.log('Metrics changed:', payload);
            fetchMetrics();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'dashboard_charts',
            filter: `department=eq.${activeDepartment}`
          },
          (payload) => {
            console.log('Charts changed:', payload);
            fetchMetrics();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [activeDepartment, toast, dateRange]);

  const onSubmit = async (data: { monthlyTarget: string, paidUserTarget: string, leadCount: string }) => {
    if (!activeDepartment) return;
    
    try {
      const updatedTargets = {
        monthlyTarget: parseFloat(data.monthlyTarget),
        paidUserTarget: parseInt(data.paidUserTarget),
        leadCount: parseInt(data.leadCount)
      };
      
      const { error } = await supabase
        .from('dashboard_metrics')
        .update({ metric_value: updatedTargets.leadCount })
        .eq('department', activeDepartment)
        .eq('metric_name', 'Total Leads Needed');

      if (error) throw error;

      toast({
        title: "Targets updated",
        description: "Your new targets have been saved successfully.",
      });
      
      setIsFormOpen(false);
    } catch (error) {
      console.error('Error updating targets:', error);
      toast({
        title: "Error updating targets",
        description: "Could not save your targets. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading dashboard data...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">{activeDepartment} School Dashboard</h2>
        <DateFilter 
          dateRange={dateRange} 
          onDateChange={setDateRange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.length > 0 ? (
          analyticsData.map(data => (
            <DataCard key={data.id} data={data} />
          ))
        ) : (
          <div className="col-span-4 text-center py-6 bg-gray-50 border rounded-md">
            <p className="text-gray-500">No analytics data available for {activeDepartment} department.</p>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-1">
          <CardHeader className="px-0 pt-0">
            <CardTitle>Set Targets for {activeDepartment} School</CardTitle>
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
          {monthlyPerformanceData.length > 0 ? (
            <ChartCard 
              title="Monthly Performance" 
              subtitle="Monthly target versus achieved"
              data={monthlyPerformanceData}
              type="bar"
              dataKey="name"
              categories={['target', 'achieved']}
              colors={['#0159FF', '#66A3FF']}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <p className="text-gray-500">No monthly performance data available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-1">
          {secondMetrics.length > 0 ? (
            secondMetrics.map(data => (
              <DataCard key={data.id} data={data} />
            ))
          ) : (
            <Card className="p-6">
              <p className="text-gray-500 text-center">No secondary metrics available.</p>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {targetAchievedData.length > 0 ? (
            <ChartCard 
              title="Target Achievement" 
              subtitle="Overall target achievement percentage"
              data={targetAchievedData}
              type="pie"
              dataKey="value"
              colors={['#0159FF', '#E6EFFF']}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <p className="text-gray-500">No target achievement data available.</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="lg:col-span-1">
          {conversionByChannelData.length > 0 ? (
            <ChartCard 
              title="Conversion by Channel" 
              subtitle="Conversion rate by marketing channel"
              data={conversionByChannelData}
              type="bar"
              dataKey="name"
              categories={['rate']}
              colors={['#0159FF']}
            />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent>
                <p className="text-gray-500">No channel conversion data available.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectLeadDashboard;
