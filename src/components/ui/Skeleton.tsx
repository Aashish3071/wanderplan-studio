import React from 'react';

interface SkeletonProps {
  className?: string;
  height?: string | number;
  width?: string | number;
  circle?: boolean;
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  height,
  width,
  circle = false,
  animate = true,
}) => {
  const baseClassName = 'loading-skeleton bg-muted/60';
  const animateClass = animate ? 'after:animate-shimmerEffect' : '';
  const circleClass = circle ? 'rounded-full' : 'rounded-md';

  const style = {
    height:
      height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
  };

  return (
    <div className={`${baseClassName} ${animateClass} ${circleClass} ${className}`} style={style} />
  );
};

export const SkeletonText = ({ lines = 1, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height={16}
          className={index === lines - 1 && lines > 1 ? 'w-4/5' : 'w-full'}
        />
      ))}
    </div>
  );
};

export const SkeletonCard = ({ rows = 3, className = '' }) => {
  return (
    <div className={`rounded-xl border border-border/40 bg-white p-6 shadow-md ${className}`}>
      <div className="mb-4 flex items-center gap-4">
        <Skeleton circle height={40} width={40} />
        <div className="flex-1">
          <Skeleton height={20} className="mb-2 w-2/3" />
          <Skeleton height={16} className="w-1/2" />
        </div>
      </div>

      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <Skeleton key={index} height={16} />
        ))}
      </div>
    </div>
  );
};

export const SkeletonTripCard = () => {
  return (
    <div className="card overflow-hidden">
      <Skeleton height={200} className="w-full" />
      <div className="p-5">
        <Skeleton height={24} className="mb-3 w-3/4" />
        <Skeleton height={16} className="mb-2 w-1/2" />
        <Skeleton height={16} className="mb-4 w-2/3" />
        <div className="flex items-center justify-between">
          <Skeleton height={16} width={80} />
          <Skeleton circle height={36} width={36} />
        </div>
      </div>
    </div>
  );
};

export default Skeleton;
