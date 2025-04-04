
import React from 'react';
import { cn } from '@/lib/utils';
import CustomCard from '@/components/ui/CustomCard';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, LucideIcon } from 'lucide-react';

interface DataCardProps {
  data: {
    title: string;
    value: number | string;
    percentChange: number;
    trend: 'up' | 'down' | 'neutral';
    icon: LucideIcon;
  };
  className?: string;
}

const DataCard: React.FC<DataCardProps> = ({ data, className }) => {
  const { title, value, percentChange, trend, icon: Icon } = data;
  
  const trendIcon = {
    up: <ArrowUpIcon className="h-4 w-4 text-green-500" />,
    down: <ArrowDownIcon className="h-4 w-4 text-red-500" />,
    neutral: <MinusIcon className="h-4 w-4 text-gray-400" />
  };
  
  const trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-400'
  };
  
  return (
    <CustomCard className={cn("p-6 h-full", className)}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </p>
          </div>
          <div className="mt-2 flex items-center">
            {trendIcon[trend]}
            <span className={cn("text-sm ml-1", trendColor[trend])}>
              {percentChange > 0 ? '+' : ''}{percentChange}%
            </span>
          </div>
        </div>
        {Icon && (
          <div className="p-2 bg-primary-50 rounded-lg">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        )}
      </div>
    </CustomCard>
  );
};

export default DataCard;
