
import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface DateRangeSelectorProps {
  dateRange: DateRange | undefined;
  onDateChange: (range: DateRange | undefined) => void;
  presets?: {
    label: string;
    value: () => DateRange;
  }[];
}

const DEFAULT_PRESETS = [
  {
    label: 'Today',
    value: () => ({
      from: new Date(),
      to: new Date(),
    }),
  },
  {
    label: 'Yesterday',
    value: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return {
        from: yesterday,
        to: yesterday,
      };
    },
  },
  {
    label: 'Last 7 days',
    value: () => {
      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(lastWeek.getDate() - 6);
      return {
        from: lastWeek,
        to: today,
      };
    },
  },
  {
    label: 'Last 30 days',
    value: () => {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(lastMonth.getDate() - 29);
      return {
        from: lastMonth,
        to: today,
      };
    },
  },
  {
    label: 'This month',
    value: () => {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      return {
        from: startOfMonth,
        to: today,
      };
    },
  },
];

const DateRangeSelector: React.FC<DateRangeSelectorProps> = ({
  dateRange,
  onDateChange,
  presets = DEFAULT_PRESETS,
}) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal md:w-auto",
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
          <div className="flex flex-col sm:flex-row">
            <div className="border-r p-2">
              {presets.map((preset) => (
                <Button
                  key={preset.label}
                  onClick={() => onDateChange(preset.value())}
                  variant="ghost"
                  className="justify-start w-full"
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              onSelect={onDateChange}
              numberOfMonths={2}
              className="p-3"
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangeSelector;
