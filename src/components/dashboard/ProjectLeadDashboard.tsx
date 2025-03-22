
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const ProjectLeadDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [secondMetrics, setSecondMetrics] = useState([]);
  const [targetAchievedData, setTargetAchievedData] = useState([]);
  const [monthlyPerformanceData, setMonthlyPerformanceData] = useState([]);
  const [conversionByChannelData, setConversionByChannelData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      monthlyTarget: '',
      paidUserTarget: '',
      leadCount: ''
    },
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      if (!user?.department) return;

      try {
        // Fetch analytics data
        const { data: metricsData, error: metricsError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .eq('department', user.department);

        if (metricsError) throw metricsError;

        // Map metrics to the format needed for DataCard
        if (metricsData) {
          const analytics = metricsData.filter(metric => 
            ['Total Leads Needed', 'Conversion Ratio', 'Spend-Revenue Ratio', 'Fresh Admissions'].includes(metric.metric_name)
          ).map((metric, index) => ({
            id: index.toString(),
            title: metric.metric_name,
            value: metric.metric_value,
            percentChange: metric.percent_change,
            trend: metric.trend,
            icon: getIconForMetric(metric.metric_name)
          }));
          
          setAnalyticsData(analytics);

          const secondary = metricsData.filter(metric => 
            ['Second EMI', 'ARPPU', 'CPL'].includes(metric.metric_name)
          ).map((metric, index) => ({
            id: (index + 5).toString(),
            title: metric.metric_name,
            value: metric.metric_value,
            percentChange: metric.percent_change,
            trend: metric.trend,
            icon: getIconForMetric(metric.metric_name)
          }));
          
          setSecondMetrics(secondary);
        }

        // Fetch chart data
        const { data: chartsData, error: chartsError } = await supabase
          .from('dashboard_charts')
          .select('*')
          .eq('department', user.department);

        if (chartsError) throw chartsError;

        if (chartsData) {
          chartsData.forEach(chart => {
            const chartData = JSON.parse(chart.chart_data);
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
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error fetching data",
          description: "Could not load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();

    // Set up real-time subscriptions
    const channel = supabase
      .channel('dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_metrics',
          filter: `department=eq.${user?.department}`
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
          filter: `department=eq.${user?.department}`
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
  }, [user?.department, toast]);

  const getIconForMetric = (metricName) => {
    switch (metricName) {
      case 'Total Leads Needed':
        return <Users className="h-5 w-5 text-primary" />;
      case 'Conversion Ratio':
        return <BarChart4 className="h-5 w-5 text-primary" />;
      case 'Spend-Revenue Ratio':
        return <TrendingUp className="h-5 w-5 text-primary" />;
      case 'Fresh Admissions':
        return <Zap className="h-5 w-5 text-primary" />;
      case 'Second EMI':
      case 'ARPPU':
      case 'CPL':
        return <DollarSign className="h-5 w-5 text-primary" />;
      default:
        return <Target className="h-5 w-5 text-primary" />;
    }
  };

  const onSubmit = async (data) => {
    try {
      // Update targets in Supabase
      const updatedTargets = {
        monthlyTarget: parseFloat(data.monthlyTarget),
        paidUserTarget: parseInt(data.paidUserTarget),
        leadCount: parseInt(data.leadCount)
      };
      
      // Save to Supabase (in a real app, you'd save to a specific targets table)
      const { error } = await supabase
        .from('dashboard_metrics')
        .update({ metric_value: updatedTargets.leadCount })
        .eq('department', user?.department)
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
