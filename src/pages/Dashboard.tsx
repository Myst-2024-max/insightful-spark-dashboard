
import React from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Users, DollarSign, TrendingUp, Award } from 'lucide-react';

const Dashboard = () => {
  const { user, checkUserPermission } = useAuth();
  
  // Sample analytics data
  const analyticsData = [
    {
      id: '1',
      title: 'Total Students',
      value: 1248,
      percentChange: 12.5,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Revenue',
      value: 284500,
      percentChange: 8.2,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Growth Rate',
      value: 18.6,
      percentChange: 4.1,
      trend: 'up' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'Completion Rate',
      value: 92.3,
      percentChange: -1.4,
      trend: 'down' as const,
      icon: <Award className="h-5 w-5 text-primary" />,
    },
  ];
  
  // Sample chart data
  const monthlyRevenueData = [
    { name: 'Jan', value: 42000 },
    { name: 'Feb', value: 38000 },
    { name: 'Mar', value: 45000 },
    { name: 'Apr', value: 51000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 48000 },
    { name: 'Jul', value: 52000 },
    { name: 'Aug', value: 57000 },
    { name: 'Sep', value: 63000 },
    { name: 'Oct', value: 59000 },
    { name: 'Nov', value: 68000 },
    { name: 'Dec', value: 72000 },
  ];
  
  const enrollmentData = [
    { name: 'Jan', Coding: 120, Design: 85, Marketing: 65, Finance: 45 },
    { name: 'Feb', Coding: 132, Design: 78, Marketing: 72, Finance: 53 },
    { name: 'Mar', Coding: 145, Design: 92, Marketing: 81, Finance: 61 },
    { name: 'Apr', Coding: 158, Design: 102, Marketing: 87, Finance: 65 },
    { name: 'May', Coding: 172, Design: 110, Marketing: 93, Finance: 71 },
    { name: 'Jun', Coding: 168, Design: 105, Marketing: 95, Finance: 74 },
  ];
  
  const schoolDistributionData = [
    { name: 'Coding School', value: 42 },
    { name: 'Design School', value: 28 },
    { name: 'Marketing School', value: 18 },
    { name: 'Finance School', value: 12 },
  ];
  
  const performanceData = [
    { name: 'Week 1', Actual: 82, Target: 85 },
    { name: 'Week 2', Actual: 86, Target: 85 },
    { name: 'Week 3', Actual: 84, Target: 85 },
    { name: 'Week 4', Actual: 87, Target: 85 },
    { name: 'Week 5', Actual: 89, Target: 90 },
    { name: 'Week 6', Actual: 92, Target: 90 },
    { name: 'Week 7', Actual: 93, Target: 90 },
    { name: 'Week 8', Actual: 95, Target: 90 },
  ];
  
  // Get dashboard title based on user role
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
  
  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h1 className="text-3xl font-bold">{getDashboardTitle()}</h1>
        <p className="text-gray-500 mt-2">
          Welcome back, {user?.name}. Here's what's happening today.
        </p>
      </header>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Monthly Revenue" 
          subtitle="Revenue trends over the past year"
          data={monthlyRevenueData}
          type="area"
          dataKey="value"
        />
        
        <ChartCard 
          title="School Enrollment Distribution" 
          subtitle="Current student distribution by school"
          data={schoolDistributionData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="School Enrollment Trends" 
          subtitle="Monthly enrollment by school"
          data={enrollmentData}
          type="bar"
          dataKey="name"
          categories={['Coding', 'Design', 'Marketing', 'Finance']}
          colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
        />
        
        <ChartCard 
          title="Performance vs Target" 
          subtitle="Weekly performance compared to targets"
          data={performanceData}
          type="line"
          dataKey="name"
          categories={['Actual', 'Target']}
          colors={['#0159FF', '#FF5733']}
        />
      </div>
      
      {/* Role-specific content */}
      {checkUserPermission(UserRole.MASTER_ADMIN) && (
        <CustomCard>
          <h2 className="text-xl font-semibold mb-4">Administrative Tools</h2>
          <p className="text-gray-600 mb-4">
            These tools are only available to administrators with the highest level of access.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="font-medium">User Management</h3>
              <p className="text-sm text-gray-500 mt-1">Add, remove or modify user accounts and permissions</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="font-medium">System Settings</h3>
              <p className="text-sm text-gray-500 mt-1">Configure global system settings and preferences</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h3 className="font-medium">Audit Logs</h3>
              <p className="text-sm text-gray-500 mt-1">Review system activity and security logs</p>
            </div>
          </div>
        </CustomCard>
      )}
    </div>
  );
};

export default Dashboard;
