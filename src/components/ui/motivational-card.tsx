import React from 'react';
import { ArrowRight, Heart, Star, Award, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface MotivationalCardProps {
  type: 'progress' | 'destination' | 'adventure';
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/**
 * A motivational card that displays encouraging messages during trip planning
 */
export const MotivationalCard: React.FC<MotivationalCardProps> = ({
  type,
  title,
  message,
  actionLabel,
  onAction,
  className,
}) => {
  // Configure icon and colors based on card type
  const getCardConfig = () => {
    switch (type) {
      case 'progress':
        return {
          icon: <TrendingUp className="h-6 w-6" />,
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
          actionColor: 'text-blue-600 hover:text-blue-700',
        };
      case 'destination':
        return {
          icon: <Star className="h-6 w-6" />,
          bgColor: 'bg-gradient-to-br from-amber-50 to-yellow-50',
          iconColor: 'text-amber-500',
          borderColor: 'border-amber-200',
          actionColor: 'text-amber-600 hover:text-amber-700',
        };
      case 'adventure':
        return {
          icon: <Award className="h-6 w-6" />,
          bgColor: 'bg-gradient-to-br from-green-50 to-emerald-50',
          iconColor: 'text-emerald-500',
          borderColor: 'border-emerald-200',
          actionColor: 'text-emerald-600 hover:text-emerald-700',
        };
      default:
        return {
          icon: <Heart className="h-6 w-6" />,
          bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-50',
          iconColor: 'text-blue-500',
          borderColor: 'border-blue-200',
          actionColor: 'text-blue-600 hover:text-blue-700',
        };
    }
  };

  const config = getCardConfig();

  return (
    <div
      className={cn(
        'rounded-lg border p-4 shadow-sm transition-all',
        config.bgColor,
        config.borderColor,
        className
      )}
    >
      <div className="flex items-start space-x-4">
        <div className={cn('rounded-full bg-white p-2', config.iconColor)}>{config.icon}</div>

        <div className="flex-1">
          <h3 className="mb-1 font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{message}</p>

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={cn(
                'mt-3 inline-flex items-center text-sm font-medium',
                config.actionColor
              )}
            >
              {actionLabel}
              <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
