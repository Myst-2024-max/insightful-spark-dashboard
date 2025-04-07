
import React from 'react';
import { Card } from '@/components/ui/card';
import DateRangeSelector from './DateRangeSelector';
import { DateRange } from 'react-day-picker';
import { Calendar, ArrowUpDown, X, CalendarRange } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

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

  // Format date for display
  const formatDateDisplay = (date: Date | undefined): string => {
    if (!date) return "";
    return format(date, 'MMM d, yyyy');
  };

  return (
    <Card className="p-2 shadow-sm bg-white dark:bg-gray-950 mb-4 border-primary/10 hover:border-primary/30 transition-colors">
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 text-primary/80" /> 
            <span className="hidden md:inline">Date Range:</span>
            {dateRange.from ? (
              dateRange.to ? (
                <Badge variant="outline" className="font-normal flex items-center gap-1">
                  <span className="text-primary">{formatDateDisplay(dateRange.from)}</span>
                  <span className="px-1">—</span>
                  <span className="text-primary">{formatDateDisplay(dateRange.to)}</span>
                </Badge>
              ) : (
                <Badge variant="outline" className="font-normal">
                  {formatDateDisplay(dateRange.from)}
                </Badge>
              )
            ) : (
              <span className="italic">Select date range</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-gray-500 hover:text-primary hover:bg-primary/10"
              onClick={resetDateRange}
            >
              Reset
            </Button>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                {isOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <CalendarRange className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </div>
        <CollapsibleContent className="pt-4 transition-all duration-300">
          <DateRangeSelector dateRange={dateRange} onDateChange={onDateChange} />
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default DateFilter;
