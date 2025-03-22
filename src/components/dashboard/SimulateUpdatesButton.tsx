
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { simulateAllUpdates } from '@/utils/simulateDataUpdates';
import { useAuth } from '@/components/auth/AuthContext';
import { UserRole } from '@/lib/types';
import { RefreshCw } from 'lucide-react';

const SimulateUpdatesButton = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);

  // Only Master Admin and Accounts Team can simulate updates for any department
  const canSimulateAll = user?.role === UserRole.MASTER_ADMIN || user?.role === UserRole.ACCOUNTS_TEAM;

  const handleSimulate = async () => {
    if (!user?.department) {
      toast({
        title: "Error",
        description: "User department information is missing.",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
    try {
      if (canSimulateAll) {
        // For Master Admin, simulate updates for all departments
        const departments = ['CODING', 'DESIGN', 'MARKETING', 'FINANCE'];
        for (const dept of departments) {
          await simulateAllUpdates(dept);
        }
        toast({
          title: "Data Updated",
          description: "Simulated real-time updates for all departments.",
        });
      } else {
        // For other roles, only simulate updates for their department
        await simulateAllUpdates(user.department);
        toast({
          title: "Data Updated",
          description: `Simulated real-time updates for ${user.department} department.`,
        });
      }
    } catch (error) {
      console.error('Error simulating updates:', error);
      toast({
        title: "Error",
        description: "Failed to simulate updates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleSimulate} 
      disabled={isSimulating}
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isSimulating ? 'animate-spin' : ''}`} />
      Simulate Updates
    </Button>
  );
};

export default SimulateUpdatesButton;
