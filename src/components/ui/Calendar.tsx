import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

interface CalendarProps {
  value?: Date | null;
  onDateChange?: (date: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  isRange?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onRangeChange?: (start: Date | null, end: Date | null) => void;
  className?: string;
  highlightToday?: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  value = null,
  onDateChange,
  minDate,
  maxDate,
  isRange = false,
  startDate = null,
  endDate = null,
  onRangeChange,
  className = '',
  highlightToday = true,
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  // If we're in range mode and have a start date but no end date
  const isSelectingEndDate = isRange && startDate && !endDate;

  const getCurrentMonthDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Create a date for the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);

    // Get the day of the week (0-6, where 0 is Sunday) for the first day
    const firstDayOfWeek = firstDayOfMonth.getDay();

    // Calculate the number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Previous month days needed to fill the calendar grid
    const previousMonthDays = [];
    if (firstDayOfWeek > 0) {
      const previousMonth = new Date(year, month, 0);
      const daysInPreviousMonth = previousMonth.getDate();

      for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPreviousMonth - i;
        previousMonthDays.push({
          date: new Date(year, month - 1, day),
          isCurrentMonth: false,
          isToday: false,
        });
      }
    }

    // Current month days
    const currentMonthDays = [];
    const today = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday =
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();

      currentMonthDays.push({
        date,
        isCurrentMonth: true,
        isToday,
      });
    }

    // Next month days needed to complete the grid
    const nextMonthDays = [];
    const totalDaysShown = 42; // 6 rows x 7 days
    const remainingDays = totalDaysShown - (previousMonthDays.length + currentMonthDays.length);

    for (let day = 1; day <= remainingDays; day++) {
      nextMonthDays.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false,
      });
    }

    return [...previousMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    // Check if date is within allowed range
    if ((minDate && date < minDate) || (maxDate && date > maxDate)) {
      return;
    }

    if (isRange) {
      // Range selection logic
      if (!startDate || endDate) {
        // Start a new selection
        if (onRangeChange) onRangeChange(date, null);
      } else {
        // Complete the range
        if (date < startDate) {
          // If clicking a date before the start date, swap them
          if (onRangeChange) onRangeChange(date, startDate);
        } else {
          if (onRangeChange) onRangeChange(startDate, date);
        }
      }
    } else {
      // Single date selection
      if (onDateChange) onDateChange(date);
    }
  };

  const handleDateHover = (date: Date) => {
    if (isRange && startDate && !endDate) {
      setHoverDate(date);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!isRange || !startDate) return false;

    const end = endDate || hoverDate;
    if (!end) return false;

    return date > startDate && date < end;
  };

  const isSelectedDate = (date: Date) => {
    if (isRange) {
      return (
        (startDate &&
          date.getDate() === startDate.getDate() &&
          date.getMonth() === startDate.getMonth() &&
          date.getFullYear() === startDate.getFullYear()) ||
        (endDate &&
          date.getDate() === endDate.getDate() &&
          date.getMonth() === endDate.getMonth() &&
          date.getFullYear() === endDate.getFullYear())
      );
    } else {
      return (
        value &&
        date.getDate() === value.getDate() &&
        date.getMonth() === value.getMonth() &&
        date.getFullYear() === value.getFullYear()
      );
    }
  };

  const days = getCurrentMonthDays();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`calendar rounded-lg border border-border bg-white shadow-sm ${className}`}>
      <div className="flex items-center justify-between border-b border-border p-4">
        <button
          onClick={handlePreviousMonth}
          className="rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Previous month"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="text-lg font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </div>

        <button
          onClick={handleNextMonth}
          className="rounded-full p-1.5 hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Next month"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4">
        <div className="mb-2 grid grid-cols-7 gap-1">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isDisabled = (minDate && day.date < minDate) || (maxDate && day.date > maxDate);

            const isSelected = isSelectedDate(day.date);
            const isInRange = isDateInRange(day.date);

            let cellClasses = 'h-10 flex items-center justify-center rounded-md text-sm';

            if (!day.isCurrentMonth) {
              cellClasses += ' text-muted-foreground/40';
            } else {
              cellClasses += ' text-foreground';
            }

            if (day.isToday && highlightToday) {
              cellClasses += ' border-2 border-primary/30';
            }

            if (isSelected) {
              cellClasses += ' bg-primary text-white font-medium hover:bg-primary/90';
            } else if (isInRange) {
              cellClasses += ' bg-primary/10 text-primary';
            } else {
              cellClasses += ' hover:bg-muted';
            }

            if (isDisabled) {
              cellClasses += ' opacity-50 cursor-not-allowed';
            } else {
              cellClasses += ' cursor-pointer';
            }

            return (
              <div
                key={index}
                className={cellClasses}
                onClick={() => !isDisabled && handleDateClick(day.date)}
                onMouseEnter={() => handleDateHover(day.date)}
                aria-label={day.date.toDateString()}
                aria-disabled={isDisabled}
                role="button"
                tabIndex={0}
              >
                {day.date.getDate()}
              </div>
            );
          })}
        </div>
      </div>

      {isRange && startDate && (
        <div className="border-t border-border p-4 text-center text-sm text-muted-foreground">
          {!endDate ? (
            <div className="flex items-center justify-center">
              <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
              <span>Select end date</span>
            </div>
          ) : (
            <div className="flex flex-col space-y-1">
              <div className="flex items-center justify-center font-medium text-foreground">
                {startDate.toLocaleDateString()} – {endDate.toLocaleDateString()}
              </div>
              <div>
                {Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))} days
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calendar;
