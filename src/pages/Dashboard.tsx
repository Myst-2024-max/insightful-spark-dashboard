
import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import MasterAdminDashboard from '@/components/dashboard/MasterAdminDashboard';
import SalesExecutiveDashboard from '@/components/dashboard/SalesExecutiveDashboard';
import AccountsTeamDashboard from '@/components/dashboard/AccountsTeamDashboard';
import GrowthTeamDashboard from '@/components/dashboard/GrowthTeamDashboard';
import TeamLeadDashboard from '@/components/dashboard/TeamLeadDashboard';
import ProjectLeadDashboard from '@/components/dashboard/ProjectLeadDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
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
  
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold">{getDashboardTitle()}</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.name}. 
          {user?.department && (
            <span className="font-medium text-primary"> {getDepartmentName()}</span>
          )}
        </p>
      </header>
      
      {renderDashboard()}
    </div>
  );
};

export default Dashboard;
