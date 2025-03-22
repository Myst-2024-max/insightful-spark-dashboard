
import React from 'react';
import { PlusCircle, Users, DollarSign, BarChart4, Zap, TrendingUp } from 'lucide-react';
import CustomCard from '@/components/ui/CustomCard';
import DataCard from '@/components/dashboard/DataCard';
import ChartCard from '@/components/dashboard/ChartCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const MasterAdminDashboard = () => {
  const analyticsData = [
    {
      id: '1',
      title: 'Total Revenue',
      value: 568000,
      percentChange: 15.2,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '2',
      title: 'Lead Count',
      value: 4872,
      percentChange: 8.7,
      trend: 'up' as const,
      icon: <Users className="h-5 w-5 text-primary" />,
    },
    {
      id: '3',
      title: 'Conversion Ratio',
      value: 32.5,
      percentChange: 3.6,
      trend: 'up' as const,
      icon: <BarChart4 className="h-5 w-5 text-primary" />,
    },
    {
      id: '4',
      title: 'Spend-Revenue Ratio',
      value: 18.2,
      percentChange: -2.1,
      trend: 'down' as const,
      icon: <TrendingUp className="h-5 w-5 text-primary" />,
    },
  ];
  
  const revenueBySchoolData = [
    { name: 'CODING School', value: 215000 },
    { name: 'DESIGN School', value: 142000 },
    { name: 'MARKETING School', value: 122000 },
    { name: 'FINANCE School', value: 89000 },
  ];
  
  const admissionsTrendData = [
    { name: 'Jan', CODING: 42, DESIGN: 28, MARKETING: 21, FINANCE: 18 },
    { name: 'Feb', CODING: 38, DESIGN: 32, MARKETING: 24, FINANCE: 22 },
    { name: 'Mar', CODING: 45, DESIGN: 35, MARKETING: 29, FINANCE: 19 },
    { name: 'Apr', CODING: 51, DESIGN: 38, MARKETING: 31, FINANCE: 24 },
    { name: 'May', CODING: 55, DESIGN: 42, MARKETING: 33, FINANCE: 27 },
    { name: 'Jun', CODING: 49, DESIGN: 41, MARKETING: 35, FINANCE: 29 },
  ];
  
  const keyMetricsData = [
    {
      id: '5',
      title: 'Fresh Admissions',
      value: 286,
      percentChange: 12.4,
      trend: 'up' as const,
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
    {
      id: '6',
      title: 'ARPPU',
      value: 42500,
      percentChange: 5.8,
      trend: 'up' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    },
    {
      id: '7',
      title: 'CPL',
      value: 850,
      percentChange: -3.2,
      trend: 'down' as const,
      icon: <DollarSign className="h-5 w-5 text-primary" />,
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map(data => (
          <DataCard key={data.id} data={data} />
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 col-span-1">
          <h3 className="text-lg font-semibold mb-4">Add New</h3>
          <div className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New School
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Program
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </div>
        </Card>
        
        <div className="col-span-1 lg:col-span-2">
          <ChartCard 
            title="Revenue by School" 
            subtitle="Distribution of revenue across schools"
            data={revenueBySchoolData}
            type="pie"
            dataKey="value"
            colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard 
            title="Fresh Admissions Trend" 
            subtitle="Monthly admissions by school"
            data={admissionsTrendData}
            type="bar"
            dataKey="name"
            categories={['CODING', 'DESIGN', 'MARKETING', 'FINANCE']}
            colors={['#0159FF', '#3385FF', '#66A3FF', '#99C2FF']}
          />
        </div>
        
        <div className="space-y-6">
          {keyMetricsData.map(data => (
            <DataCard key={data.id} data={data} />
          ))}
        </div>
      </div>
      
      <CustomCard>
        <h2 className="text-xl font-semibold mb-4">All Department Dashboards</h2>
        <p className="text-gray-600 mb-4">
          Access and manage all department dashboards from here.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" className="justify-start">
            Sales Dashboard
          </Button>
          <Button variant="outline" className="justify-start">
            Growth Dashboard
          </Button>
          <Button variant="outline" className="justify-start">
            Accounts Dashboard
          </Button>
          <Button variant="outline" className="justify-start">
            Team Lead Dashboard
          </Button>
        </div>
      </CustomCard>
    </div>
  );
};

export default MasterAdminDashboard;
