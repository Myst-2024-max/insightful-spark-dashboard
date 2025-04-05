
import React from 'react';
import { Card } from '@/components/ui/card';
import DateRangeSelector from './DateRangeSelector';
import { DateRange } from 'react-day-picker';

interface DateFilterProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateRange, onDateChange }) => {
  return (
    <Card className="p-2 shadow-sm">
      <DateRangeSelector dateRange={dateRange} onDateChange={onDateChange} />
    </Card>
  );
};

export default DateFilter;
