
import React, { useState } from 'react';
import { DollarSign, Target, BarChart4, Users, Briefcase, Database, Zap } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SalesExecutiveDashboard = () => {
  const [timeFilter, setTimeFilter] = useState('all');

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
    {
      id: '6',
      title: 'Cumulative Revenue',
      value: 450000,
      percentChange: 15.2,
      trend: 'up' as const,
      icon: Database,
    },
    {
      id: '7',
      title: 'Fresh Revenue',
      value: 75000,
      percentChange: 5.8,
      trend: 'up' as const,
      icon: Zap,
    },
  ];
  
  // Filter data based on time period
  const getFilteredData = () => {
    // In a real implementation, this would filter data based on the selected time period
    // For this example, we'll just return the original data
    return analyticsData;
  };
  
  const filteredData = getFilteredData();
  
  // Incentive achievement data with percentage labels
  const incentiveData = [
    { name: 'Achieved (83%)', value: 83, percentage: '83%' },
    { name: 'Remaining (17%)', value: 17, percentage: '17%' },
  ];
  
  // Custom rendering function for pie chart labels
  const renderCustomizedLabel = (props) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent, index } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={13}
        fontWeight="bold"
      >
        {incentiveData[index].percentage}
      </text>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sales Executive Dashboard</h2>
        <div className="w-48">
          <Select 
            value={timeFilter} 
            onValueChange={setTimeFilter}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <ChartCard 
          title="Incentive Achievement" 
          subtitle="Percentage of target achieved"
          data={incentiveData}
          type="pie"
          dataKey="value"
          colors={['#0159FF', '#E6EFFF']}
          labelFormatter={renderCustomizedLabel}
        />
      </div>
    </div>
  );
};

export default SalesExecutiveDashboard;
