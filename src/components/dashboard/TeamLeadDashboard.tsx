
import React, { useState, useEffect } from 'react';
import { Users, Target, DollarSign, TrendingUp, Zap } from 'lucide-react';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SalesExecutivePerformance } from '@/lib/types';
import TeamLeadTargetForm from '@/components/dashboard/TeamLeadTargetForm';
import ExecutivePerformanceView from '@/components/dashboard/ExecutivePerformanceView';
import ExecutivesList from '@/components/dashboard/ExecutivesList';
import { useAuth } from '@/components/auth/AuthContext';
import { fetchTeamPerformance, updateExecutiveTarget } from '@/utils/teamUtils';
import { useToast } from '@/hooks/use-toast';
import TeamMembersList from '@/components/TeamMembersList';
import { supabase } from '@/integrations/supabase/client';

const TeamLeadDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedExecutive, setSelectedExecutive] = useState<string | null>(null);
  const [salesExecutives, setSalesExecutives] = useState<{ id: string; name: string }[]>([]);
  const [executivePerformance, setExecutivePerformance] = useState<SalesExecutivePerformance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    if (user?.id) {
      fetchTeamData();
      
      // Set up real-time subscriptions for team data changes
      const channel = supabase
        .channel('team-lead-dashboard')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'haca_users',
            filter: `team_lead_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Team member changes detected:', payload);
            fetchTeamData();
          }
        )
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sales_data'
          },
          (payload) => {
            console.log('Sales data changes detected:', payload);
            fetchTeamData();
          }
        )
        .subscribe();
      
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);
  
  const fetchTeamData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const performanceData = await fetchTeamPerformance(user.id);
      
      if (performanceData && performanceData.length > 0) {
        // Set performance data
        setExecutivePerformance(performanceData);
        
        // Extract basic sales executive info for the list
        const executives = performanceData.map(exec => ({
          id: exec.id,
          name: exec.name
        }));
        
        setSalesExecutives(executives);
        
        // If we have executives but none selected, select the first one
        if (executives.length > 0 && !selectedExecutive) {
          setSelectedExecutive(executives[0].id);
        }
      } else {
        setSalesExecutives([]);
        setExecutivePerformance([]);
      }
    } catch (error) {
      console.error("Error fetching team data:", error);
      toast({
        title: "Error",
        description: "Could not load team data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const analyticsData = [
    {
      id: '1',
      title: 'Lead Count',
      value: 324,
      percentChange: 12.5,
      trend: 'up' as const,
      icon: Users,
    },
    {
      id: '2',
      title: 'Spend-Revenue Ratio',
      value: 16.8,
      percentChange: -2.3,
      trend: 'down' as const,
      icon: TrendingUp,
    },
    {
      id: '3',
      title: 'Fresh Admissions',
      value: 118000,
      percentChange: 8.7,
      trend: 'up' as const,
      icon: Zap,
    },
    {
      id: '4',
      title: 'ARPPU',
      value: 45000,
      percentChange: 5.2,
      trend: 'up' as const,
      icon: DollarSign,
    },
  ];
  
  // Create chart data based on real team performance
  const getTargetDiffData = () => {
    return executivePerformance.map(exec => ({
      name: exec.name.split(' ')[0], // Just first name to keep chart readable
      target: exec.targetValue / 1000, // Convert to thousands for better display
      achieved: exec.achievedValue / 1000
    }));
  };
  
  const cplTrendData = [
    { name: 'Jan', CPL: 920 },
    { name: 'Feb', CPL: 880 },
    { name: 'Mar', CPL: 850 },
    { name: 'Apr', CPL: 830 },
    { name: 'May', CPL: 810 },
    { name: 'Jun', CPL: 790 },
  ];
  
  const conversionRatioData = [
    { name: 'Jan', ratio: 28 },
    { name: 'Feb', ratio: 29 },
    { name: 'Mar', ratio: 31 },
    { name: 'Apr', ratio: 32 },
    { name: 'May', ratio: 34 },
    { name: 'Jun', ratio: 35 },
  ];

  const handleFormSubmit = async (data: any) => {
    console.log("Form data submitted:", data);
    
    try {
      // Update the executive's target
      if (data.salesExecutive && data.leadTarget) {
        const targetValue = parseInt(data.incentiveTarget) || 100000;
        
        // Update the target in the database
        const result = await updateExecutiveTarget(data.salesExecutive, targetValue);
        
        if (result.success) {
          toast({
            title: "Target Updated",
            description: "Sales executive target has been updated successfully.",
          });
          
          // Refresh data to show updated targets
          fetchTeamData();
        } else {
          throw new Error("Failed to update target");
        }
      }
      
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating target:", error);
      toast({
        title: "Update Failed",
        description: "Could not update the sales executive target.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateTargets = (executiveId: string) => {
    // Find the executive data to pre-fill the form
    const exec = executivePerformance.find(e => e.id === executiveId);
    if (exec) {
      // Switch to dashboard view and open the form
      setActiveView('dashboard');
      setIsFormOpen(true);
      // Pre-fill form data would be handled here in a real implementation
    }
  };

  return (
    <div className="space-y-8">
      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="dashboard">Team Dashboard</TabsTrigger>
          <TabsTrigger value="executives">Sales Executives</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analyticsData.map(data => (
              <DataCard key={data.id} data={data} />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <TeamLeadTargetForm 
              isFormOpen={isFormOpen}
              setIsFormOpen={setIsFormOpen}
              salesExecutives={salesExecutives}
              onSubmit={handleFormSubmit}
            />
            
            {executivePerformance.length > 0 ? (
              <ChartCard 
                title="Target vs Achieved" 
                subtitle="Lead targets versus achieved by executive"
                data={getTargetDiffData()}
                type="bar"
                dataKey="name"
                categories={['target', 'achieved']}
                colors={['#0159FF', '#66A3FF']}
              />
            ) : (
              <div className="border rounded-lg p-6 flex items-center justify-center">
                <p className="text-gray-500">No executives assigned to your team yet</p>
              </div>
            )}
          </div>
          
          {/* Real-time team members list */}
          {user && user.id && (
            <div className="mt-6">
              <TeamMembersList 
                teamLeadId={user.id} 
                onEditTarget={(memberId, name, currentTarget) => {
                  // Implementation for editing targets
                  console.log(`Edit target for ${name}: ${currentTarget}`);
                  setIsFormOpen(true);
                }}
              />
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <ChartCard 
              title="CPL Trend" 
              subtitle="Cost per lead monthly trend"
              data={cplTrendData}
              type="line"
              dataKey="name"
              categories={['CPL']}
              colors={['#0159FF']}
            />
            
            <ChartCard 
              title="Conversion Ratio" 
              subtitle="Monthly conversion ratio trend"
              data={conversionRatioData}
              type="area"
              dataKey="name"
              categories={['ratio']}
              colors={['#0159FF']}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="executives" className="mt-6">
          {isLoading ? (
            <div className="text-center py-4">Loading team members...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1">
                <ExecutivesList 
                  salesExecutives={salesExecutives}
                  selectedExecutive={selectedExecutive}
                  onSelectExecutive={setSelectedExecutive}
                />
              </div>
              
              <div className="lg:col-span-2">
                <ExecutivePerformanceView 
                  selectedExecutive={selectedExecutive}
                  executivePerformance={executivePerformance}
                  onUpdateTargets={handleUpdateTargets}
                />
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadDashboard;
