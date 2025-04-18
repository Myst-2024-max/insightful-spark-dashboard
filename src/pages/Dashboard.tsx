
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import MasterAdminDashboard from '@/components/dashboard/MasterAdminDashboard';
import SalesExecutiveDashboard from '@/components/dashboard/SalesExecutiveDashboard';
import AccountsTeamDashboard from '@/components/dashboard/AccountsTeamDashboard';
import GrowthTeamDashboard from '@/components/dashboard/GrowthTeamDashboard';
import TeamLeadDashboard from '@/components/dashboard/TeamLeadDashboard';
import ProjectLeadDashboard from '@/components/dashboard/ProjectLeadDashboard';
import { useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import SimulateUpdatesButton from '@/components/dashboard/SimulateUpdatesButton';
import DashboardDataOverview from '@/components/dashboard/DashboardDataOverview';
import { supabase } from '@/integrations/supabase/client';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date()
  });
  
  useEffect(() => {
    // Check if welcome banner should be shown (could be stored in localStorage)
    const welcomeDismissed = localStorage.getItem('welcomeBannerDismissed');
    if (welcomeDismissed === 'true') {
      setShowWelcome(false);
    }
    
    // Simulate loading dashboard data
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleDismissWelcome = () => {
    setShowWelcome(false);
    localStorage.setItem('welcomeBannerDismissed', 'true');
  };
  
  useEffect(() => {
    if (user?.role === UserRole.PROJECT_LEAD && user?.department) {
      navigate(`/projects/${user.department.toLowerCase()}`);
    }
  }, [user, navigate]);
  
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'projects') {
      const department = pathParts[2].toUpperCase();
      
      if (!user) return;
      
      if (user.role === UserRole.MASTER_ADMIN || user.role === UserRole.ACCOUNTS_TEAM) {
        toast({
          title: `Viewing ${department} Dashboard`,
          description: `You are now viewing the ${department} School dashboard`,
        });
      } 
      else if (user.department !== department) {
        toast({
          title: "Access Restricted",
          description: `You can only view dashboards for your department: ${user.department}`,
          variant: "destructive",
        });
        navigate('/dashboard');
      }
    }
  }, [location.pathname, user, toast, navigate]);
  
  useEffect(() => {
    if (!user) return;
    
    const channels = [];
    
    const metricsChannel = supabase
      .channel('dashboard-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_metrics'
        },
        (payload: any) => {
          console.log('Dashboard metrics changed:', payload);
          setLastUpdate(new Date());
          
          if (payload.new && typeof payload.new === 'object' && 'metric_name' in payload.new) {
            toast({
              title: "Dashboard Updated",
              description: `${payload.new.metric_name} metric has been updated in real-time.`,
            });
          }
        }
      )
      .subscribe();
    
    channels.push(metricsChannel);
    
    const chartsChannel = supabase
      .channel('dashboard-charts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_charts'
        },
        (payload: any) => {
          console.log('Dashboard charts changed:', payload);
          setLastUpdate(new Date());
          
          if (payload.new && typeof payload.new === 'object' && 'chart_name' in payload.new) {
            toast({
              title: "Chart Updated",
              description: `${payload.new.chart_name} chart has been updated in real-time.`,
            });
          }
        }
      )
      .subscribe();
    
    channels.push(chartsChannel);
    
    if (user.role === UserRole.MASTER_ADMIN || user.role === UserRole.ACCOUNTS_TEAM) {
      const accountsChannel = supabase
        .channel('accounts-data-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'accounts_data'
          },
          (payload) => {
            console.log('Accounts data changed:', payload);
            setLastUpdate(new Date());
            
            toast({
              title: "Accounts Data Updated",
              description: "New accounts data has been recorded in real-time.",
            });
          }
        )
        .subscribe();
      
      channels.push(accountsChannel);
    }
    
    if (user.role === UserRole.TEAM_LEAD || user.role === UserRole.MASTER_ADMIN) {
      const salesChannel = supabase
        .channel('sales-data-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sales_data'
          },
          (payload) => {
            console.log('Sales data changed:', payload);
            setLastUpdate(new Date());
            
            toast({
              title: "Sales Data Updated",
              description: "New sales data has been recorded in real-time.",
            });
          }
        )
        .subscribe();
      
      channels.push(salesChannel);
    }
    
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, toast]);
  
  const handleDateRangeChange = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };
  
  const getDashboardTitle = () => {
    if (!user) return 'Dashboard';
    
    switch (user.role) {
      case UserRole.MASTER_ADMIN:
        return 'Master Dashboard';
      case UserRole.SALES_EXECUTIVE:
        return 'Sales Executive Dashboard';
      case UserRole.ACCOUNTS_TEAM:
        return 'Accounts Dashboard';
      case UserRole.GROWTH_TEAM:
        return 'Growth Dashboard';
      case UserRole.TEAM_LEAD:
        return 'Team Lead Dashboard';
      case UserRole.PROJECT_LEAD:
        return `Project Lead Dashboard${user.department ? ` - ${user.department}` : ''}`;
      default:
        return 'Dashboard';
    }
  };
  
  const getDepartmentName = () => {
    if (!user?.department) return '';
    return `${user.department} School`;
  };
  
  const retryLoading = () => {
    setIsLoading(true);
    setHasError(false);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };
  
  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case UserRole.MASTER_ADMIN:
        return <MasterAdminDashboard />;
      case UserRole.SALES_EXECUTIVE:
        return <SalesExecutiveDashboard />;
      case UserRole.ACCOUNTS_TEAM:
        return <AccountsTeamDashboard />;
      case UserRole.GROWTH_TEAM:
        return <GrowthTeamDashboard />;
      case UserRole.TEAM_LEAD:
        return <TeamLeadDashboard />;
      case UserRole.PROJECT_LEAD:
        return <ProjectLeadDashboard dateRange={dateRange} onDateChange={handleDateRangeChange} />;
      default:
        return <div>Dashboard not available for your role.</div>;
    }
  };
  
  if (user?.role === UserRole.PROJECT_LEAD && user?.department) {
    return <Navigate to={`/projects/${user.department.toLowerCase()}`} replace />;
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      {showWelcome && <WelcomeBanner onDismiss={handleDismissWelcome} />}
      
      <header className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{getDashboardTitle()}</h1>
          <p className="text-gray-500 mt-2">
            Welcome back, {user?.name}. 
            {user?.department && (
              <span className="font-medium text-primary"> {getDepartmentName()}</span>
            )}
          </p>
          {lastUpdate && (
            <p className="text-xs text-gray-400 mt-1">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          <SimulateUpdatesButton />
        </div>
      </header>
      
      {isLoading ? (
        <div className="space-y-8">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-[100px] w-full rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-[300px] w-full rounded-lg" />
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      ) : hasError ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error loading dashboard</AlertTitle>
          <AlertDescription>
            There was a problem loading your dashboard data.
            <Button variant="outline" size="sm" className="ml-2 mt-2" onClick={retryLoading}>
              <RefreshCw className="mr-2 h-4 w-4" /> Retry
            </Button>
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <DashboardDataOverview department={user?.department} />
          {renderDashboard()}
        </>
      )}
    </div>
  );
};

export default Dashboard;
