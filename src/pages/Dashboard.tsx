
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
import { supabase } from '@/integrations/supabase/client';

const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  // Redirect project leads to their specific department page
  useEffect(() => {
    if (user?.role === UserRole.PROJECT_LEAD && user?.department) {
      navigate(`/projects/${user.department.toLowerCase()}`);
    }
  }, [user, navigate]);
  
  // Extract department from URL if present
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 2 && pathParts[1] === 'projects') {
      const department = pathParts[2].toUpperCase();
      
      if (!user) return;
      
      // If user is MASTER_ADMIN or ACCOUNTS_TEAM, they can view any department dashboard
      if (user.role === UserRole.MASTER_ADMIN || user.role === UserRole.ACCOUNTS_TEAM) {
        toast({
          title: `Viewing ${department} Dashboard`,
          description: `You are now viewing the ${department} School dashboard`,
        });
      } 
      // For other roles, check if they have permission to view this department
      else if (user.department !== department) {
        toast({
          title: "Access Restricted",
          description: `You can only view dashboards for your department: ${user.department}`,
          variant: "destructive",
        });
        // Redirect to main dashboard
        navigate('/dashboard');
      }
    }
  }, [location.pathname, user, toast, navigate]);
  
  // Set up real-time subscription to dashboard updates
  useEffect(() => {
    if (!user) return;
    
    const channels = [];
    
    // Subscribe to metrics changes
    const metricsChannel = supabase
      .channel('dashboard-metrics-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_metrics'
        },
        (payload) => {
          console.log('Dashboard metrics changed:', payload);
          setLastUpdate(new Date());
          
          // Notify user about real-time update
          toast({
            title: "Dashboard Updated",
            description: `${payload.new.metric_name} metric has been updated in real-time.`,
          });
        }
      )
      .subscribe();
    
    channels.push(metricsChannel);
    
    // Subscribe to charts changes
    const chartsChannel = supabase
      .channel('dashboard-charts-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dashboard_charts'
        },
        (payload) => {
          console.log('Dashboard charts changed:', payload);
          setLastUpdate(new Date());
          
          // Notify user about real-time update
          toast({
            title: "Chart Updated",
            description: `${payload.new.chart_name} chart has been updated in real-time.`,
          });
        }
      )
      .subscribe();
    
    channels.push(chartsChannel);
    
    // Subscribe to specific tables based on user role
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
            
            // Notify user about real-time update
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
            
            // Notify user about real-time update
            toast({
              title: "Sales Data Updated",
              description: "New sales data has been recorded in real-time.",
            });
          }
        )
        .subscribe();
      
      channels.push(salesChannel);
    }
    
    // Cleanup function to remove all channels on unmount
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [user, toast]);
  
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
  
  // Render the appropriate dashboard based on user role
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
        return <ProjectLeadDashboard />;
      default:
        return <div>Dashboard not available for your role.</div>;
    }
  };
  
  if (user?.role === UserRole.PROJECT_LEAD && user?.department) {
    return <Navigate to={`/projects/${user.department.toLowerCase()}`} replace />;
  }
  
  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex justify-between items-center">
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
        <SimulateUpdatesButton />
      </header>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
