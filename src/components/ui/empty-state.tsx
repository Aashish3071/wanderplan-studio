import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg border bg-background p-8 text-center ${className}`}
    >
      {icon && <div className="mb-4">{icon}</div>}

      <h3 className="mb-2 text-xl font-semibold">{title}</h3>

      {description && <p className="mb-6 max-w-md text-muted-foreground">{description}</p>}

      {action && <div>{action}</div>}
    </div>
  );
}
