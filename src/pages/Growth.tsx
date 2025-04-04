
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import GrowthTeamDashboard from '@/components/dashboard/GrowthTeamDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

const Growth = () => {
  const { user, checkUserPermission } = useAuth();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulating loading state
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Loading Growth dashboard...</div>;
  }
  
  if (!checkUserPermission([UserRole.MASTER_ADMIN, UserRole.GROWTH_TEAM])) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center text-gray-600">
              You do not have permission to access this page. Only Growth Team and Master Admin users can view the Growth dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Growth Dashboard</h1>
      <p className="text-gray-600 mb-8">
        Manage and monitor your growth metrics across various channels and campaigns.
      </p>
      
      <GrowthTeamDashboard />
    </div>
  );
};

export default Growth;
