import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  text: string;
  children?: React.ReactNode;
  className?: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  icon?: React.ReactNode;
}

export function Tooltip({
  text,
  children,
  className,
  position = 'top',
  icon = <HelpCircle className="h-4 w-4 text-muted-foreground" />,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2',
  };

  const arrowPositionClasses = {
    top: 'bottom-[-6px] left-1/2 -ml-1 border-t-background border-l-transparent border-r-transparent border-b-transparent',
    right:
      'left-[-6px] top-1/2 -mt-1 border-r-background border-t-transparent border-b-transparent border-l-transparent',
    bottom:
      'top-[-6px] left-1/2 -ml-1 border-b-background border-l-transparent border-r-transparent border-t-transparent',
    left: 'right-[-6px] top-1/2 -mt-1 border-l-background border-t-transparent border-b-transparent border-r-transparent',
  };

  // Close the tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={cn('relative inline-block', className)} ref={tooltipRef}>
      {children ? (
        <div
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          onClick={() => setIsVisible(!isVisible)}
        >
          {children}
        </div>
      ) : (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full p-1 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => setIsVisible(!isVisible)}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
          aria-label="Show help"
        >
          {icon}
        </button>
      )}

      {isVisible && (
        <div
          className={cn(
            'absolute z-50 w-max max-w-xs rounded-md border border-border bg-background px-4 py-2 text-sm text-foreground shadow-md',
            positionClasses[position]
          )}
        >
          <div className={cn('absolute border-8', arrowPositionClasses[position])}></div>
          {text}
        </div>
      )}
    </div>
  );
}
