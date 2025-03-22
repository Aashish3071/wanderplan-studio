import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  percentage: number;
  title?: string;
  showCheckmark?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressIndicator({
  percentage,
  title,
  showCheckmark = true,
  className,
  size = 'md',
  animated = true,
}: ProgressIndicatorProps) {
  // Ensure percentage is between 0 and 100
  const normalizedPercentage = Math.max(0, Math.min(100, percentage));
  const isComplete = normalizedPercentage === 100;

  // Size-based classes
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  // Animation classes
  const animationClass = animated ? 'transition-all duration-500' : '';

  return (
    <div className={cn('w-full', className)}>
      {title && (
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">{title}</span>
          <div className="flex items-center gap-1">
            <span className="text-sm font-semibold">{normalizedPercentage}%</span>
            {isComplete && showCheckmark && <CheckCircle className="h-4 w-4 text-primary" />}
          </div>
        </div>
      )}

      <div className={cn('w-full overflow-hidden rounded-full bg-muted', sizeClasses[size])}>
        <div
          className={cn(
            'h-full rounded-full bg-primary',
            animationClass,
            isComplete ? 'bg-primary' : 'bg-primary/80'
          )}
          style={{ width: `${normalizedPercentage}%` }}
        ></div>
      </div>
    </div>
  );
}
