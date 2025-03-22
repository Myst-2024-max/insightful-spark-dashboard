
import React from 'react';
import { DollarSign, Target, BarChart4, Users, Briefcase } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';

const SalesExecutiveDashboard = () => {
  const analyticsData = [
    {
      id: '1',
      title: 'Achieved Revenue',
      value: 125000,
      percentChange: 8.5,
      trend: 'up' as const,
      icon: DollarSign,
    },
    {
      id: '2',
      title: 'Leads Assigned',
      value: 145,
      percentChange: 12.4,
      trend: 'up' as const,
      icon: Users,
    },
    {
      id: '3',
      title: 'Conversion Ratio',
      value: 28.4,
      percentChange: 3.2,
      trend: 'up' as const,
      icon: BarChart4,
    },
    {
      id: '4',
      title: 'Incentive Target',
      value: 150000,
      percentChange: 0,
      trend: 'neutral' as const,
      icon: Target,
    },
    {
      id: '5',
      title: 'Sales Unit',
      value: 'Team A',
      percentChange: 0,
      trend: 'neutral' as const,
      icon: Briefcase,
    },
  ];
  
  const incentiveData = [
    { name: 'Achieved', value: 83 },
    { name: 'Remaining', value: 17 },
  ];
  
  const conversionTrendData = [
    { name: 'Week 1', Conversion: 24 },
    { name: 'Week 2', Conversion: 26 },
    { name: 'Week 3', Conversion: 29 },
    { name: 'Week 4', Conversion: 27 },
    { name: 'Week 5', Conversion: 32 },
    { name: 'Week 6', Conversion: 31 },
    { name: 'Week 7', Conversion: 34 },
    { name: 'Week 8', Conversion: 35 },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {analyticsData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Incentive Achievement" 
          subtitle="Percentage of target achieved"
          data={incentiveData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#E6EFFF']}
        />
        
        <ChartCard 
          title="Conversion Ratio Trend" 
          subtitle="Weekly conversion ratio"
          data={conversionTrendData}
          type="line"
          dataKey="name"
          categories={['Conversion']}
          colors={['#0159FF']}
        />
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
