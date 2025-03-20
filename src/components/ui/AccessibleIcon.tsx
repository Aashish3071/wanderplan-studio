import React from 'react';

interface AccessibleIconProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * AccessibleIcon provides a simple wrapper for icons with appropriate
 * accessibility attributes for screen readers.
 *
 * Usage:
 * <AccessibleIcon label="Search">
 *   <SearchIcon className="h-5 w-5" />
 * </AccessibleIcon>
 */
const AccessibleIcon: React.FC<AccessibleIconProps> = ({ label, children, className = '' }) => {
  return (
    <span className={`inline-flex ${className}`} role="img" aria-label={label}>
      {children}
      <span className="sr-only">{label}</span>
    </span>
  );
};

export default AccessibleIcon;
