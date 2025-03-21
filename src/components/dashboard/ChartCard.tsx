
import React from 'react';
import { cn } from '@/lib/utils';
import CustomCard from '@/components/ui/CustomCard';
import { 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  AreaChart, 
  Area,
  PieChart, 
  Pie, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  data: any[];
  type?: 'line' | 'bar' | 'area' | 'pie';
  dataKey: string;
  categories?: string[];
  colors?: string[];
  className?: string;
  height?: number;
}

const ChartCard: React.FC<ChartCardProps> = ({ 
  title, 
  subtitle,
  data, 
  type = 'line', 
  dataKey, 
  categories = ['value'],
  colors = ['rgb(1, 90, 255)'],
  className,
  height = 300
}) => {
  // Default color palette
  const defaultColors = [
    'rgb(1, 90, 255)',     // Primary blue
    'rgb(0, 73, 207)',     // Darker blue
    'rgb(0, 55, 155)',     // Even darker blue
    'rgb(102, 163, 255)',  // Lighter blue
    'rgb(153, 194, 255)'   // Even lighter blue
  ];
  
  // Use provided colors or fall back to defaults
  const chartColors = colors.length > 0 ? colors : defaultColors;
  
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              {categories.map((category, index) => (
                <Line 
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={chartColors[index % chartColors.length]}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 0, fill: chartColors[index % chartColors.length] }}
                  activeDot={{ r: 5, stroke: 'white', strokeWidth: 2 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );
        
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              {categories.map((category, index) => (
                <Bar 
                  key={category}
                  dataKey={category}
                  fill={chartColors[index % chartColors.length]}
                  radius={[4, 4, 0, 0]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );
        
      case 'area':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
              {categories.map((category, index) => (
                <Area 
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={chartColors[index % chartColors.length]}
                  fill={`${chartColors[index % chartColors.length]}20`}
                  strokeWidth={2}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );
        
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey={dataKey}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={chartColors[index % chartColors.length]} 
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  border: 'none'
                }}
                itemStyle={{ padding: '2px 0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <CustomCard className={cn("", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {renderChart()}
    </CustomCard>
  );
};

export default ChartCard;
