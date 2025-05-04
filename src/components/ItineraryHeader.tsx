
import React from 'react';
import { CalendarIcon, Globe } from 'lucide-react';
import FoxMascot from './FoxMascot';
import { TripItinerary } from '@/services/itineraryService';

interface ItineraryHeaderProps {
  tripData: TripItinerary;
  isMultiCity: boolean;
}

const ItineraryHeader: React.FC<ItineraryHeaderProps> = ({ tripData, isMultiCity }) => {
  return (
    <div className="mb-6 pb-6 border-b border-gray-100 animate-fade-in relative">
      <div className="flex items-start">
        <div className="flex-grow">
          <h1 className="text-2xl font-bold text-gradient-primary mb-1">
            {isMultiCity 
              ? `${tripData.cities.length} Cities in ${tripData.cities[0].country}` 
              : tripData.destinations[0]}
          </h1>
          <div className="flex items-center text-gray-600 mb-3">
            <CalendarIcon size={14} className="mr-1" />
            <span className="text-sm">{tripData.dates}</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
              Budget: {tripData.totalBudget}
            </div>
            <div className="bg-gradient-to-r from-green-100 to-teal-100 text-green-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm">
              {tripData.cities.reduce((total, city) => total + city.days.length, 0)} Days
            </div>
            {isMultiCity && (
              <div className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-600 px-4 py-1.5 rounded-full text-xs font-medium shadow-sm flex items-center">
                <Globe size={12} className="mr-1" />
                {tripData.cities.length} Cities
              </div>
            )}
          </div>
        </div>
        <div className="ml-2">
          {isMultiCity ? (
            <FoxMascot variant="family" size="md" />
          ) : (
            tripData.destinations[0].toLowerCase().includes('beach') || 
            tripData.destinations[0].toLowerCase().includes('island') ? 
              <FoxMascot variant="beach" size="md" /> : 
            tripData.destinations[0].toLowerCase().includes('ski') || 
            tripData.destinations[0].toLowerCase().includes('mountain') ? 
              <FoxMascot variant="ski" size="md" /> : 
              <FoxMascot variant="map" size="md" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryHeader;
