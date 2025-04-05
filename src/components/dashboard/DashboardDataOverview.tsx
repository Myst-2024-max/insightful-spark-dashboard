
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, BarChart3, PieChart, TrendingUp, RefreshCw } from 'lucide-react';

interface DashboardDataOverviewProps {
  department?: string;
}

const DashboardDataOverview: React.FC<DashboardDataOverviewProps> = ({ department }) => {
  const [metricsCount, setMetricsCount] = useState<number>(0);
  const [chartsCount, setChartsCount] = useState<number>(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchDataStats = async () => {
    setIsLoading(true);
    try {
      // Get metrics count
      const { count: metricsTotal, error: metricsError } = await supabase
        .from('dashboard_metrics')
        .select('*', { count: 'exact', head: true });
      
      if (metricsError) throw metricsError;
      setMetricsCount(metricsTotal || 0);

      // Get charts count
      const { count: chartsTotal, error: chartsError } = await supabase
        .from('dashboard_charts')
        .select('*', { count: 'exact', head: true });
      
      if (chartsError) throw chartsError;
      setChartsCount(chartsTotal || 0);

      // Get available departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('dashboard_metrics')
        .select('department')
        .not('department', 'is', null)
        .distinct();
      
      if (departmentsError) throw departmentsError;
      const uniqueDepartments = departmentsData
        .map(item => item.department)
        .filter((dept): dept is string => dept !== null);
      
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching data stats:', error);
      toast.error('Failed to fetch dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataStats();
  }, []);

  const handleRefreshData = () => {
    fetchDataStats();
    toast.success('Dashboard statistics refreshed');
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Data Overview</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefreshData}
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Metrics</p>
                  <p className="text-2xl font-semibold">{metricsCount}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
              
              <div className="bg-green-50 p-4 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Charts</p>
                  <p className="text-2xl font-semibold">{chartsCount}</p>
                </div>
                <PieChart className="h-8 w-8 text-green-500" />
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Departments</p>
                  <p className="text-2xl font-semibold">{departments.length}</p>
                </div>
                <Database className="h-8 w-8 text-purple-500" />
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Sample data has been loaded successfully into your dashboard. Use the "Simulate Updates" 
              button to see real-time data changes in action.
            </p>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Available Departments</h3>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge key={dept} variant={dept === department ? "default" : "outline"}>
                    {dept}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                The dashboard displays data based on your user role and department. 
                Master Admin can see all departments.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardDataOverview;
