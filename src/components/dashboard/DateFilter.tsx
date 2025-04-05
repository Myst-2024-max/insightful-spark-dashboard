
import React from 'react';
import { Card } from '@/components/ui/card';
import DateRangeSelector from './DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { Calendar, ArrowUpDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface DateFilterProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateRange, onDateChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Function to reset date range to current month
  const resetDateRange = () => {
    onDateChange({
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date()
    });
  };

  return (
    <Card className="p-2 shadow-sm bg-white dark:bg-gray-950 mb-6">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4" /> 
            <span>
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {dateRange.from.toLocaleDateString()} — {dateRange.to.toLocaleDateString()}
                  </>
                ) : (
                  dateRange.from.toLocaleDateString()
                )
              ) : (
                "Select date range"
              )}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-gray-500"
              onClick={resetDateRange}
            >
              Reset
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <ArrowUpDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="pt-4">
          <DateRangeSelector dateRange={dateRange} onDateChange={onDateChange} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DateFilter;
