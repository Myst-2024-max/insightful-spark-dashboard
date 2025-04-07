
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Database, BarChart3, PieChart, TrendingUp, RefreshCw, Building, Users, School } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface DashboardDataOverviewProps {
  department?: string;
}

const DashboardDataOverview: React.FC<DashboardDataOverviewProps> = ({ department }) => {
  const [metricsCount, setMetricsCount] = useState<number>(0);
  const [chartsCount, setChartsCount] = useState<number>(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schoolsCount, setSchoolsCount] = useState<number>(0);
  const [usersCount, setUsersCount] = useState<number>(0);

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

      // Get schools count
      const { count: schoolsTotal, error: schoolsError } = await supabase
        .from('schools')
        .select('*', { count: 'exact', head: true });
        
      if (schoolsError) throw schoolsError;
      setSchoolsCount(schoolsTotal || 0);
      
      // Get users count
      const { count: usersTotal, error: usersError } = await supabase
        .from('haca_users')
        .select('*', { count: 'exact', head: true });
        
      if (usersError) throw usersError;
      setUsersCount(usersTotal || 0);

      // Get available departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('dashboard_metrics')
        .select('department');
      
      if (departmentsError) throw departmentsError;
      
      // Extract unique departments
      const uniqueDepartments = Array.from(
        new Set(
          departmentsData
            .map(item => item.department)
            .filter((dept): dept is string => dept !== null)
        )
      );
      
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
    
    // Setup real-time subscription
    const channel = supabase
      .channel('dashboard-overview-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
        },
        (payload) => {
          console.log('Database change detected:', payload);
          fetchDataStats();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleRefreshData = () => {
    fetchDataStats();
    toast.success('Dashboard statistics refreshed');
  };

  const departmentBadgeVariant = (dept: string) => {
    return dept === department ? "default" : "outline";
  };

  const fadeInAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
              <Skeleton className="h-24 w-full rounded-md" />
            </div>
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-primary/10 hover:border-primary/20 transition-all duration-300">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Data Overview</CardTitle>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleRefreshData}
          disabled={isLoading}
          className="hover:bg-primary/10 hover:text-primary"
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
            <TabsTrigger value="schools">Schools</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <motion.div 
                className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-md flex items-center justify-between shadow-sm"
                variants={fadeInAnimation}
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Metrics</p>
                  <p className="text-2xl font-semibold">{metricsCount}</p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </motion.div>
              
              <motion.div 
                className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md flex items-center justify-between shadow-sm"
                variants={fadeInAnimation}
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Charts</p>
                  <p className="text-2xl font-semibold">{chartsCount}</p>
                </div>
                <PieChart className="h-8 w-8 text-green-500" />
              </motion.div>
              
              <motion.div 
                className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-md flex items-center justify-between shadow-sm"
                variants={fadeInAnimation}
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Departments</p>
                  <p className="text-2xl font-semibold">{departments.length}</p>
                </div>
                <Building className="h-8 w-8 text-purple-500" />
              </motion.div>
              
              <motion.div 
                className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md flex items-center justify-between shadow-sm"
                variants={fadeInAnimation}
              >
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Users</p>
                  <p className="text-2xl font-semibold">{usersCount}</p>
                </div>
                <Users className="h-8 w-8 text-amber-500" />
              </motion.div>
            </motion.div>
            
            <p className="text-sm text-gray-500 mt-4 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700">
              Real-time data updates are now enabled for your dashboard. Use the "Simulate Updates" 
              button to see real-time data changes in action across all connected dashboards.
            </p>
          </TabsContent>
          
          <TabsContent value="departments">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Available Departments</h3>
              <div className="flex flex-wrap gap-2">
                {departments.map((dept) => (
                  <Badge key={dept} variant={departmentBadgeVariant(dept)}>
                    {dept}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                Your dashboard displays data based on your user role and department. 
                Master Admin users can view and manage all departments.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="schools">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Available Schools</h3>
                <Badge variant="outline">{schoolsCount} total</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: Math.min(4, schoolsCount) }).map((_, i) => (
                  <div key={i} className="flex items-center p-2 bg-gray-50 dark:bg-gray-800/50 rounded-md">
                    <School className="h-5 w-5 mr-2 text-primary" />
                    <span className="text-sm font-medium">School {i + 1}</span>
                  </div>
                ))}
              </div>
              
              <Button variant="outline" className="w-full mt-2" size="sm">
                View All Schools
              </Button>
              
              <p className="text-sm text-gray-500 mt-2 bg-gray-50 dark:bg-gray-800/50 p-3 rounded-md border border-gray-100 dark:border-gray-700">
                Schools and programs have been synced to the database. Manage schools and their programs via the School Management page.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default DashboardDataOverview;
