
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { simulateAllUpdates } from '@/utils/simulateDataUpdates';

const SimulateUpdatesButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSimulateUpdates = async () => {
    if (!user?.department) {
      toast({
        title: "Error",
        description: "No department found to simulate updates for.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Notify the user that the simulation is starting
      toast({
        title: "Simulating Updates",
        description: `Starting to simulate updates for ${user.department} department.`,
      });
      
      const result = await simulateAllUpdates(user.department);
      
      if (result.success) {
        toast({
          title: "Updates Simulated",
          description: `Data updates for ${user.department} have been simulated successfully.`,
        });
      } else {
        throw new Error("Failed to simulate updates");
      }
    } catch (error) {
      console.error("Error simulating updates:", error);
      toast({
        title: "Update Simulation Failed",
        description: "An error occurred while trying to simulate updates.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSimulateUpdates} 
      disabled={isLoading}
      variant="outline"
      className="flex gap-2 items-center"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Simulating...' : 'Simulate Updates'}
    </Button>
  );
};

export default SimulateUpdatesButton;
