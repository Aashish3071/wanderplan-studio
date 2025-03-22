import { useState } from 'react';
import { DayPicker, DateRange as DayPickerDateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Calendar } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import 'react-day-picker/dist/style.css';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
  minDate?: Date;
  placeholder?: string;
}

export function DateRangePicker({
  value,
  onChange,
  className,
  minDate,
  placeholder = 'Select dates',
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Convert our DateRange to DayPicker's DateRange
  const dayPickerValue: DayPickerDateRange = {
    from: value.start || undefined,
    to: value.end || undefined,
  };

  // Convert DayPicker's DateRange to our DateRange
  const handleSelect = (range: DayPickerDateRange | undefined) => {
    onChange({
      start: range?.from || null,
      end: range?.to || null,
    });
    if (range?.from && range?.to) {
      setIsOpen(false);
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value.start && !value.end && 'text-muted-foreground',
            className
          )}
        >
          <Calendar className="mr-2 h-4 w-4" />
          {value.start ? (
            value.end ? (
              <>
                {format(value.start, 'LLL dd, y')} - {format(value.end, 'LLL dd, y')}
              </>
            ) : (
              format(value.start, 'LLL dd, y')
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DayPicker
          mode="range"
          defaultMonth={value.start || new Date()}
          selected={dayPickerValue}
          onSelect={handleSelect}
          numberOfMonths={2}
          disabled={minDate ? { before: minDate } : undefined}
          className="rounded-md border"
        />
      </PopoverContent>
    </Popover>
  );
}
