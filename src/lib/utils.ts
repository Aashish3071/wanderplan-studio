import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Combine class names with Tailwind CSS
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a human-readable format
 */
export function formatDateString(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format currency value
 */
export function formatCurrency(
  value: number,
  currency: string = 'USD',
  minimumFractionDigits: number = 0
): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits: minimumFractionDigits,
  }).format(value);
}

/**
 * Generate a random ID (useful for temporary IDs before API assigns real ones)
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function getGoogleApiKey(): string {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
}

export function isValidCoordinates(coords: any): boolean {
  if (!coords || typeof coords !== 'object') return false;

  const { lat, lng } = coords;
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return false;

  return true;
}
