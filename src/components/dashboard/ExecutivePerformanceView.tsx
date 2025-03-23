
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCircle, Target, DollarSign, Award } from 'lucide-react';
import DataCard from '@/components/dashboard/DataCard';
import { SalesExecutivePerformance } from '@/lib/types';

interface ExecutivePerformanceViewProps {
  selectedExecutive: string | null;
  executivePerformance: SalesExecutivePerformance[];
  onUpdateTargets: (executiveId: string) => void;
}

const ExecutivePerformanceView = ({ 
  selectedExecutive, 
  executivePerformance,
  onUpdateTargets
}: ExecutivePerformanceViewProps) => {

  // Get performance for a specific executive
  const getExecutivePerformance = (execId: string) => {
    return executivePerformance.find(exec => exec.id === execId) || null;
  };

  if (!selectedExecutive) {
    return (
      <div className="flex items-center justify-center h-full p-12 border rounded-lg border-dashed">
        <div className="text-center">
          <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium">No Executive Selected</h3>
          <p className="mt-1 text-sm text-gray-500">
            Select a sales executive from the list to view their performance
          </p>
        </div>
      </div>
    );
  }

  const performance = getExecutivePerformance(selectedExecutive);
  
  if (!performance) {
    return <div>No performance data available</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {performance.name}'s Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DataCard 
              data={{
                title: "Target Value",
                value: performance.targetValue,
                percentChange: 0,
                trend: "neutral",
                icon: Target
              }} 
            />
            <DataCard 
              data={{
                title: "Achieved Value",
                value: performance.achievedValue,
                percentChange: performance.achievementPercentage - 100,
                trend: performance.trend,
                icon: DollarSign
              }} 
            />
            <DataCard 
              data={{
                title: "Achievement",
                value: `${performance.achievementPercentage}%`,
                percentChange: performance.achievementPercentage - 100,
                trend: performance.trend,
                icon: Award
              }} 
            />
          </div>
          
          <div className="mt-6">
            <Button onClick={() => onUpdateTargets(selectedExecutive)}>
              Update {performance.name}'s Targets
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExecutivePerformanceView;
