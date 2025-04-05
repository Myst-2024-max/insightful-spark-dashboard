
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { simulateAllUpdates } from '@/utils/simulateDataUpdates';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';

const SimulateUpdatesButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();
  
  const handleSimulateUpdates = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let department = user.department || 'CODING';
      
      // Master admin can simulate updates for all departments
      if (user.role === UserRole.MASTER_ADMIN) {
        // Simulate for multiple departments
        const departments = ['CODING', 'DESIGN', 'MARKETING'];
        
        toast.success('Simulating updates for all departments...', {
          duration: 2000,
        });
        
        for (const dept of departments) {
          await simulateAllUpdates(dept);
          // Add a small delay to make notifications more visible
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        toast.success('Updates completed for all departments!');
      } else {
        // For other roles, just simulate updates for their department
        await simulateAllUpdates(department);
        toast.success(`Updates completed for ${department} department!`);
      }
    } catch (error) {
      console.error('Error simulating updates:', error);
      toast.error('Failed to simulate updates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="default" 
      className="flex items-center gap-2"
      onClick={handleSimulateUpdates}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Updating...' : 'Simulate Updates'}
    </Button>
  );
};

export default SimulateUpdatesButton;
