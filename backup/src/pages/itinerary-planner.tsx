import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const ItineraryPlannerPage: NextPage = () => {
  const router = useRouter();
  const { destination } = router.query;
  const [destinationValue, setDestinationValue] = useState('');
  
  useEffect(() => {
    if (destination && typeof destination === 'string') {
      setDestinationValue(destination);
    }
  }, [destination]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Plan Your Itinerary
      </h1>
      
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-xl font-semibold mb-4">
          {destinationValue 
            ? `Planning trip to ${destinationValue}` 
            : 'Where are you going?'}
        </h2>
        
        <p className="text-gray-600 mb-8">
          Start planning your dream adventure!
        </p>
        
        <div className="flex flex-col space-y-4">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-1">
              Destination
            </label>
            <input
              type="text"
              id="destination"
              value={destinationValue}
              onChange={(e) => setDestinationValue(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              placeholder="Enter city or country"
            />
          </div>
          
          <div className="pt-4">
            <button 
              className="w-full bg-primary text-white font-medium py-3 px-4 rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
            >
              Generate Itinerary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPlannerPage; 