
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Target } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/AuthContext';
import { getIconForMetric, updateMetric } from '@/utils/dashboardUtils';

const GrowthTeamDashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [analyticsData, setAnalyticsData] = useState([]);
  const [targetAchievedData, setTargetAchievedData] = useState([]);
  const [spendByProgramData, setSpendByProgramData] = useState([]);
  const [leadsBySourceData, setLeadsBySourceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm({
    defaultValues: {
      spend: '',
      leadTarget: '',
      programName: ''
    },
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      if (!user?.department) return;

      try {
        // Fetch metrics data
        const { data: metricsData, error: metricsError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .eq('department', user.department);

        if (metricsError) throw metricsError;

        if (metricsData) {
          const analytics = metricsData.filter(metric => 
            ['Ad Spend', 'Lead Target', 'Leads Generated', 'CPL'].includes(metric.metric_name)
          ).map((metric, index) => ({
            id: index.toString(),
            title: metric.metric_name,
            value: metric.metric_value,
            percentChange: metric.percent_change,
            trend: metric.trend,
            icon: getIconForMetric(metric.metric_name)
          }));
          
          setAnalyticsData(analytics);
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
              case 'Spend by Program':
                setSpendByProgramData(chartData);
                break;
              case 'Leads by Source':
                setLeadsBySourceData(chartData);
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

    fetchDashboardData();

    // Set up real-time subscriptions
    const channel = supabase
      .channel('growth-dashboard-changes')
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
          fetchDashboardData();
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
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.department, toast]);

  const onSubmit = async (data) => {
    if (!user?.department) {
      toast({
        title: "Error",
        description: "User department information is missing.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update ad spend
      if (data.spend) {
        const result = await updateMetric(user.department, 'Ad Spend', parseFloat(data.spend));
        if (!result.success) throw new Error("Failed to update Ad Spend");
      }
      
      // Update lead target
      if (data.leadTarget) {
        const result = await updateMetric(user.department, 'Lead Target', parseInt(data.leadTarget));
        if (!result.success) throw new Error("Failed to update Lead Target");
      }
      
      // In a real app, programName would be used to update a programs table
      if (data.programName) {
        toast({
          title: "Program Added",
          description: `${data.programName} has been added to your programs.`,
        });
      }

      form.reset();
      setIsFormOpen(false);
      
      toast({
        title: "Data Updated",
        description: "Growth data has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating growth data:', error);
      toast({
        title: "Error",
        description: "Failed to update growth data. Please try again.",
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
