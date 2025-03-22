import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  illustration,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border border-dashed bg-background/50 p-8 text-center ${className}`}
    >
      {illustration && (
        <div className="mb-6 max-w-[200px] transition-transform duration-500 hover:scale-105">
          {illustration}
        </div>
      )}

      {icon && !illustration && <div className="mb-4">{icon}</div>}

      <h3 className="mb-2 text-xl font-semibold">{title}</h3>

      {description && (
        <p className="mb-6 max-w-md text-center text-sm text-muted-foreground">{description}</p>
      )}

      {action && <div className="animate-pulse">{action}</div>}
    </div>
  );
}
