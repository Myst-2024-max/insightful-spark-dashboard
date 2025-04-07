
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, Sparkles } from 'lucide-react';
import { simulateAllUpdates } from '@/utils/simulateDataUpdates';
import { UserRole } from '@/lib/types';
import { useAuth } from '@/components/auth/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const SimulateUpdatesButton = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [lastUpdate, setLastUpdate] = React.useState<Date | null>(null);
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
        const departments = ['CODING', 'DESIGN', 'MARKETING', 'FINANCE'];
        
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
      
      setLastUpdate(new Date());
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="default" 
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-all duration-300 shadow-md hover:shadow-lg relative overflow-hidden"
                onClick={handleSimulateUpdates}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isLoading ? 'Updating...' : 'Simulate Updates'}
                
                {/* Add a pulsing effect when updates are available */}
                {!isLoading && lastUpdate && (
                  <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                )}
              </Button>
            </motion.div>
            
            {/* Show last update time */}
            {lastUpdate && (
              <Badge variant="outline" className="absolute -bottom-6 right-0 text-xs bg-white dark:bg-gray-800">
                Updated: {lastUpdate.toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{isLoading ? 'Generating new data...' : 'Generate random data updates'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SimulateUpdatesButton;
