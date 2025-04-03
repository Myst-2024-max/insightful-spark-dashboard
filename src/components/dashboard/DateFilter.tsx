
import React from 'react';
import { Calendar, CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, subMonths } from "date-fns";

interface DateFilterProps {
  dateRange: DateRange;
  onDateChange: (range: DateRange) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateRange, onDateChange }) => {
  const handleQuickSelect = (period: string) => {
    const today = new Date();
    let from: Date;
    
    switch (period) {
      case 'week':
        from = new Date(today);
        from.setDate(today.getDate() - 7);
        break;
      case 'month':
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'quarter':
        from = subMonths(today, 3);
        break;
      case 'year':
        from = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        from = new Date(today);
        from.setDate(today.getDate() - 30);
    }
    
    onDateChange({ from, to: today });
  };

  return (
    <div className="flex items-center space-x-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "justify-start text-left font-normal",
              !dateRange && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRange?.from ? (
              dateRange.to ? (
                <>
                  {format(dateRange.from, "LLL dd, y")} -{" "}
                  {format(dateRange.to, "LLL dd, y")}
                </>
              ) : (
                format(dateRange.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Date Range</h3>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={() => handleQuickSelect('week')}>Week</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickSelect('month')}>Month</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickSelect('quarter')}>Quarter</Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickSelect('year')}>Year</Button>
              </div>
            </div>
          </div>
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={onDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateFilter;
