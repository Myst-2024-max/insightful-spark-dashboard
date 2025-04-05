
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { simulateAllUpdates } from '@/utils/simulateDataUpdates';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const SimulateUpdatesButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSimulateUpdates = async () => {
    if (!user) {
      toast.error('You must be logged in to simulate updates');
      navigate('/login');
      return;
    }
    
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
        
        toast.success('Updates completed for all departments!', {
          description: `${departments.length} departments updated successfully.`,
          duration: 4000,
        });
      } else {
        // For other roles, just simulate updates for their department
        toast.success(`Simulating updates for ${department} department...`, {
          duration: 1500,
        });
        
        await simulateAllUpdates(department);
        
        toast.success(`Updates completed for ${department} department!`, {
          description: 'Your dashboard data has been refreshed with new values.',
          duration: 4000,
        });
      }
    } catch (error) {
      console.error('Error simulating updates:', error);
      toast.error('Failed to simulate updates. Please try again.', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="default" 
      className="flex items-center gap-2 bg-primary hover:bg-primary/90"
      onClick={handleSimulateUpdates}
      disabled={isLoading}
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Updating...' : 'Simulate Updates'}
    </Button>
  );
};

export default SimulateUpdatesButton;
