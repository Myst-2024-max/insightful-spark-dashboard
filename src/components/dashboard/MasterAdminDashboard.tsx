
import React, { useState, useEffect } from 'react';
import { PlusCircle, Users, DollarSign, BarChart4, Zap, TrendingUp } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getIconForMetric } from '@/utils/dashboardUtils';

const MasterAdminDashboard = () => {
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState([]);
  const [revenueBySchoolData, setRevenueBySchoolData] = useState([]);
  const [admissionsTrendData, setAdmissionsTrendData] = useState([]);
  const [keyMetricsData, setKeyMetricsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch metrics data for the main analytics cards
        const { data: metricsData, error: metricsError } = await supabase
          .from('dashboard_metrics')
          .select('*')
          .eq('department', 'CODING'); // Default to CODING for master admin overview

        if (metricsError) throw metricsError;

        if (metricsData) {
          const analytics = metricsData.filter(metric => 
            ['Total Revenue', 'Lead Count', 'Conversion Ratio', 'Spend-Revenue Ratio'].includes(metric.metric_name)
          ).map((metric, index) => ({
            id: index.toString(),
            title: metric.metric_name,
            value: metric.metric_value,
            percentChange: metric.percent_change || 0,
            trend: metric.trend || 'neutral',
            icon: getIconForMetric(metric.metric_name)
          }));
          
          setAnalyticsData(analytics);

          const keyMetrics = metricsData.filter(metric => 
            ['Fresh Admissions', 'ARPPU', 'CPL'].includes(metric.metric_name)
          ).map((metric, index) => ({
            id: (index + 5).toString(),
            title: metric.metric_name,
            value: metric.metric_value,
            percentChange: metric.percent_change || 0,
            trend: metric.trend || 'neutral',
            icon: getIconForMetric(metric.metric_name)
          }));
          
          setKeyMetricsData(keyMetrics);
        }

        // Fetch chart data
        const { data: chartsData, error: chartsError } = await supabase
          .from('dashboard_charts')
          .select('*')
          .eq('department', 'CODING');

        if (chartsError) throw chartsError;

        if (chartsData) {
          chartsData.forEach(chart => {
            let chartData = [];
            try {
              chartData = typeof chart.chart_data === 'string'
                ? JSON.parse(chart.chart_data)
                : chart.chart_data || [];
            } catch (e) {
              console.error('Error parsing chart data:', e);
              chartData = [];
            }
              
            switch (chart.chart_name) {
              case 'Revenue by School':
                setRevenueBySchoolData(Array.isArray(chartData) ? chartData : []);
                break;
              case 'Admissions Trend':
                setAdmissionsTrendData(Array.isArray(chartData) ? chartData : []);
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
        
        // Set default empty arrays to prevent rendering issues
        setAnalyticsData([]);
        setRevenueBySchoolData([]);
        setAdmissionsTrendData([]);
        setKeyMetricsData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscriptions for all departments since master admin can see all
    const channel = supabase
      .channel('dashboard-changes-master')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_metrics'
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
          table: 'dashboard_charts'
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
  }, [toast]);

  const handleAddNewSchool = async () => {
    // In a real app, this would navigate to a form or open a modal
    toast({
      title: "Feature Coming Soon",
      description: "Adding new schools will be available in the next update.",
    });
  };

  const handleAddNewProgram = async () => {
    toast({
      title: "Feature Coming Soon",
      description: "Adding new programs will be available in the next update.",
    });
  };

  const handleAddNewUser = async () => {
    // In a real app, we would navigate to the user management page
    window.location.href = '/user-management';
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
        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Add New</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start" variant="outline" onClick={handleAddNewSchool}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New School
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={handleAddNewProgram}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Program
            </Button>
            <Button className="w-full justify-start" variant="outline" onClick={handleAddNewUser}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <ChartCard 
            title="Revenue by School" 
            subtitle="Distribution of revenue across schools"
            data={revenueBySchoolData}
            type="pie"
            dataKey="value"
            colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Fresh Admissions Trend" 
            subtitle="Monthly admissions by school"
            data={admissionsTrendData}
            type="bar"
            dataKey="name"
            categories={['CODING', 'DESIGN', 'MARKETING', 'FINANCE']}
            colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
          />
        </div>
        
        <div className="space-y-6">
          {keyMetricsData.map(data => (
            <DataCard key={data.id} data={data} />
          ))}
        </div>
      </div>
      
      <CustomCard>
        <h2 className="text-xl font-semibold mb-4">All Department Dashboards</h2>
        <p className="text-gray-600 mb-4">
          Access and manage all department dashboards from here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = '/sales-dashboard'}>
            Sales Dashboard
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = '/growth-dashboard'}>
            Growth Dashboard
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = '/accounts-dashboard'}>
            Accounts Dashboard
          </Button>
          <Button variant="outline" className="justify-start" onClick={() => window.location.href = '/team-lead-dashboard'}>
            Team Lead Dashboard
          </Button>
        </div>
      </CustomCard>
    </div>
  );
};

export default MasterAdminDashboard;
