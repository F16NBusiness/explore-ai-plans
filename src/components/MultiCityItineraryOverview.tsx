
import React from 'react';
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TripItinerary } from "@/services/itineraryService";
import { MapPin, Calendar, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MultiCityItineraryOverviewProps {
  itinerary: TripItinerary;
  onSelectCity: (cityIndex: number) => void;
  selectedCityIndex: number;
}

const MultiCityItineraryOverview: React.FC<MultiCityItineraryOverviewProps> = ({
  itinerary,
  onSelectCity,
  selectedCityIndex
}) => {
  // Calculate the percentage of the trip for each city stay
  const totalDays = itinerary.cities.reduce((acc, city) => {
    return acc + city.days.length;
  }, 0);
  
  // Helper function to ensure we have a valid Date object
  const ensureDate = (dateValue: Date | string): Date => {
    if (dateValue instanceof Date) {
      return dateValue;
    }
    
    // If it's a string, try to parse it
    if (typeof dateValue === 'string') {
      return new Date(dateValue);
    }
    
    // Fallback to current date if the value is invalid
    console.warn('Invalid date value:', dateValue);
    return new Date();
  };
  
  // Helper function to format date as string safely
  const formatDateSafe = (dateValue: Date | string): string => {
    try {
      const date = ensureDate(dateValue);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };
  
  return (
    <Card className="ios-card mb-4 fade-in border-0 shadow-sm">
      <div className="h-0.5 bg-gradient-to-r from-violet-500 to-blue-500"></div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-sm font-medium text-gray-800">Your Itinerary</h2>
          <Badge variant="outline" className="bg-violet-50 text-violet-700 border-violet-200 text-xs font-normal">
            {totalDays} Days
          </Badge>
        </div>
        
        <div className="space-y-2">
          {/* Progress bar showing proportional time in each city */}
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <div className="text-xs text-gray-500">Trip Timeline</div>
              <div className="text-xs text-gray-500 flex items-center gap-0.5">
                <span>{itinerary.cities.length}</span>
                <span>Cities</span>
              </div>
            </div>
            <Progress 
              value={100} 
              className="h-1.5 bg-gray-100 rounded-full"
              indicatorClassName="flex"
            >
              {itinerary.cities.map((city, index) => {
                // Calculate width percentage for this city
                const percentage = (city.days.length / totalDays) * 100;
                
                // Generate a color based on index
                const colors = [
                  "bg-violet-500",
                  "bg-blue-500", 
                  "bg-green-500",
                  "bg-amber-500",
                  "bg-red-500",
                  "bg-pink-500"
                ];
                
                const colorClass = colors[index % colors.length];
                
                return (
                  <div 
                    key={index} 
                    className={`h-full ${colorClass} first:rounded-l-full last:rounded-r-full`}
                    style={{ width: `${percentage}%` }} 
                  />
                );
              })}
            </Progress>
          </div>
          
          {/* City cards */}
          {itinerary.cities.map((city, index) => {
            // Generate a color based on index for the badge
            const colors = [
              "from-violet-500 to-blue-500",
              "from-blue-500 to-cyan-500", 
              "from-green-500 to-teal-500",
              "from-amber-500 to-orange-500",
              "from-red-500 to-pink-500",
              "from-pink-500 to-violet-500"
            ];
            
            const gradient = colors[index % colors.length];
            const isActive = index === selectedCityIndex;
            
            // Check if this city has days
            const hasDays = city.days && city.days.length > 0;
            
            // Safely get formatted start and end dates
            const startDateStr = formatDateSafe(city.startDate);
            const endDateStr = formatDateSafe(city.endDate);
            
            return (
              <div 
                key={index}
                className={`rounded-lg p-3 cursor-pointer transition-all duration-200 scale-in ${
                  isActive 
                    ? 'bg-violet-50 border border-violet-100' 
                    : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                }`}
                onClick={() => onSelectCity(index)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className={`font-medium text-sm ${isActive ? 'text-violet-700' : 'text-gray-800'}`}>
                      {city.city}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                      <MapPin size={10} className="mr-0.5" />
                      <span>{city.country}</span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-r ${gradient} text-white px-2 py-0.5 rounded-full text-xs font-medium shadow-sm`}>
                    {hasDays ? `${city.days.length} ${city.days.length === 1 ? 'Day' : 'Days'}` : 'No data'}
                  </div>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar size={10} className="mr-0.5" />
                    <span>{startDateStr} - {endDateStr}</span>
                  </div>
                  
                  <ChevronRight 
                    size={14} 
                    className={`${isActive ? 'text-violet-500' : 'text-gray-400'}`} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default MultiCityItineraryOverview;
