import React from 'react';

interface EmptyTripsIllustrationProps {
  className?: string;
}

const EmptyTripsIllustration: React.FC<EmptyTripsIllustrationProps> = ({ className = '' }) => {
  return (
    <svg className={className} viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect x="30" y="110" width="240" height="60" rx="4" fill="#F3F4F6" />

      {/* Suitcase */}
      <rect x="120" y="50" width="60" height="80" rx="6" fill="#D1D5DB" />
      <rect x="135" y="40" width="30" height="10" rx="2" fill="#9CA3AF" />
      <rect x="130" y="65" width="40" height="50" rx="2" fill="#F9FAFB" />
      <rect x="140" y="75" width="20" height="4" rx="1" fill="#9CA3AF" />
      <rect x="140" y="85" width="20" height="4" rx="1" fill="#9CA3AF" />
      <rect x="140" y="95" width="20" height="4" rx="1" fill="#9CA3AF" />

      {/* Plane */}
      <g transform="translate(180, 80) rotate(15) scale(0.8)">
        <path
          d="M50,20 L70,10 L80,15 L60,25 L50,20 Z"
          fill="#9CA3AF"
          stroke="#6B7280"
          strokeWidth="1"
        />
        <path
          d="M10,25 L50,20 L60,25 L20,35 L10,25 Z"
          fill="#D1D5DB"
          stroke="#6B7280"
          strokeWidth="1"
        />
        <path
          d="M30,15 L35,13 L40,20 L35,22 L30,15 Z"
          fill="#9CA3AF"
          stroke="#6B7280"
          strokeWidth="1"
        />
        <circle cx="20" cy="30" r="2" fill="#6B7280" />
      </g>

      {/* Sun */}
      <circle cx="50" cy="50" r="15" fill="#FBBF24" />
      <circle cx="50" cy="50" r="10" fill="#FCD34D" />

      {/* Clouds */}
      <g transform="translate(200, 40)">
        <circle cx="10" cy="10" r="10" fill="#F9FAFB" />
        <circle cx="20" cy="8" r="8" fill="#F9FAFB" />
        <circle cx="30" cy="10" r="10" fill="#F9FAFB" />
        <circle cx="20" cy="15" r="8" fill="#F9FAFB" />
      </g>

      <g transform="translate(70, 70)">
        <circle cx="8" cy="8" r="8" fill="#F9FAFB" />
        <circle cx="16" cy="6" r="6" fill="#F9FAFB" />
        <circle cx="24" cy="8" r="8" fill="#F9FAFB" />
        <circle cx="16" cy="12" r="6" fill="#F9FAFB" />
      </g>

      {/* Text */}
      <rect x="90" y="150" width="120" height="4" rx="2" fill="#9CA3AF" />
      <rect x="110" y="160" width="80" height="4" rx="2" fill="#D1D5DB" />
    </svg>
  );
};

export default EmptyTripsIllustration;
