
import React, { useState } from 'react';
import { Users, Target, DollarSign, TrendingUp, Zap } from 'lucide-react';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { SalesExecutivePerformance } from '@/lib/types';
import TeamLeadTargetForm from '@/components/dashboard/TeamLeadTargetForm';
import ExecutivePerformanceView from '@/components/dashboard/ExecutivePerformanceView';
import ExecutivesList from '@/components/dashboard/ExecutivesList';

const TeamLeadDashboard = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedExecutive, setSelectedExecutive] = useState<string | null>(null);
  
  // Mock data for sales executives under this team lead
  const salesExecutives = [
    { id: 'exec1', name: 'John Smith' },
    { id: 'exec2', name: 'Emily Johnson' },
    { id: 'exec3', name: 'Michael Brown' },
    { id: 'exec4', name: 'Sarah Williams' },
    { id: 'exec5', name: 'David Jones' },
  ];
  
  // Mock performance data for sales executives
  const executivePerformance: SalesExecutivePerformance[] = [
    {
      id: 'exec1',
      name: 'John Smith',
      targetValue: 120000,
      achievedValue: 135000,
      achievementPercentage: 112.5,
      trend: 'up',
    },
    {
      id: 'exec2',
      name: 'Emily Johnson',
      targetValue: 100000,
      achievedValue: 92000,
      achievementPercentage: 92.0,
      trend: 'down',
    },
    {
      id: 'exec3',
      name: 'Michael Brown',
      targetValue: 115000,
      achievedValue: 118500,
      achievementPercentage: 103.0,
      trend: 'up',
    },
    {
      id: 'exec4',
      name: 'Sarah Williams',
      targetValue: 90000,
      achievedValue: 78000,
      achievementPercentage: 86.7,
      trend: 'down',
    },
    {
      id: 'exec5',
      name: 'David Jones',
      targetValue: 110000,
      achievedValue: 110000,
      achievementPercentage: 100.0,
      trend: 'neutral',
    },
  ];

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
  
  const targetDiffData = [
    { name: 'Exec 1', target: 45, achieved: 38 },
    { name: 'Exec 2', target: 40, achieved: 42 },
    { name: 'Exec 3', target: 50, achieved: 47 },
    { name: 'Exec 4', target: 35, achieved: 32 },
    { name: 'Exec 5', target: 45, achieved: 41 },
  ];
  
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

  const handleFormSubmit = (data: any) => {
    console.log(data);
    setIsFormOpen(false);
    // Here you would normally update the data in your backend
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
            
            <ChartCard 
              title="Target vs Achieved" 
              subtitle="Lead targets versus achieved by executive"
              data={targetDiffData}
              type="bar"
              dataKey="name"
              categories={['target', 'achieved']}
              colors={['#0159FF', '#66A3FF']}
            />
          </div>
          
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TeamLeadDashboard;
