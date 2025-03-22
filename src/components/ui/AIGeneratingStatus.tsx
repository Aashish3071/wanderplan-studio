import React from 'react';
import { Loader2 } from 'lucide-react';

interface AIGeneratingStatusProps {
  status: 'idle' | 'generating' | 'error' | 'success';
  message?: string;
}

const AIGeneratingStatus: React.FC<AIGeneratingStatusProps> = ({
  status,
  message = 'Generating your personalized itinerary...',
}) => {
  if (status === 'idle') return null;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg bg-white p-6 shadow-md">
      {status === 'generating' && (
        <>
          <Loader2 className="mb-3 h-8 w-8 animate-spin text-primary" />
          <p className="text-center text-gray-700">{message}</p>
          <div className="mt-4 h-2.5 w-full max-w-xs rounded-full bg-gray-200">
            <div className="h-2.5 animate-pulse rounded-full bg-primary" style={{ width: '60%' }} />
          </div>
          <p className="mt-2 text-xs text-gray-500">This may take a minute or two</p>
        </>
      )}

      {status === 'error' && (
        <div className="text-center text-red-600">
          <p className="font-medium">Error generating itinerary</p>
          <p className="mt-1 text-sm">{message || 'Please try again later'}</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center text-green-600">
          <p className="font-medium">Success!</p>
          <p className="mt-1 text-sm">{message || 'Your itinerary is ready'}</p>
        </div>
      )}
    </div>
  );
};

export default AIGeneratingStatus;
