
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';

interface WelcomeBannerProps {
  onDismiss: () => void;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onDismiss }) => {
  const { user } = useAuth();
  
  const getRoleSpecificMessage = () => {
    if (!user) return '';
    
    switch (user.role) {
      case UserRole.MASTER_ADMIN:
        return "As a Master Admin, you have full access to all sections of the platform. You can manage users, view all departments, and access comprehensive analytics.";
      case UserRole.SALES_EXECUTIVE:
        return "Track your sales performance, manage leads, and monitor your conversion rates all in one place.";
      case UserRole.ACCOUNTS_TEAM:
        return "Review financial data, track payments, and manage student accounts from this centralized dashboard.";
      case UserRole.GROWTH_TEAM:
        return "Monitor marketing campaigns, track lead acquisition costs, and analyze growth metrics to optimize your strategies.";
      case UserRole.TEAM_LEAD:
        return "Track your team's performance, set targets, and view comprehensive analytics to help guide your team to success.";
      case UserRole.PROJECT_LEAD:
        return "Monitor your department's performance, track key metrics, and make data-driven decisions to achieve your goals.";
      default:
        return "Welcome to your personalized dashboard. Here you'll find all the data and tools you need.";
    }
  };
  
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-none mb-8 relative overflow-hidden animate-fade-in">
      <button 
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600" 
        onClick={onDismiss}
        aria-label="Dismiss welcome message"
      >
        ✕
      </button>
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="bg-white p-3 rounded-full">
            <div className="bg-blue-500 rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-white text-xl font-bold">
                {user?.name?.substring(0, 1) || 'U'}
              </span>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold mb-2">
              Welcome back, {user?.name || 'User'}!
            </h2>
            <p className="text-gray-600 max-w-2xl">
              {getRoleSpecificMessage()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeBanner;
