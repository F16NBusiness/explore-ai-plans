
import React, { useState, useEffect } from "react";
import { Search, X, PlusCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getDestinationSuggestions } from "@/data/destinations";

interface MultiCityDestinationInputProps {
  destinations: string[];
  onDestinationsChange: (destinations: string[]) => void;
}

const MultiCityDestinationInput: React.FC<MultiCityDestinationInputProps> = ({
  destinations,
  onDestinationsChange
}) => {
  const [destinationQuery, setDestinationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeDestinationIndex, setActiveDestinationIndex] = useState(0);

  useEffect(() => {
    const results = getDestinationSuggestions(destinationQuery);
    setSuggestions(results);
  }, [destinationQuery]);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    
    if (index === activeDestinationIndex) {
      setDestinationQuery(value);
      setShowSuggestions(true);
    }
    
    const newDestinations = [...destinations];
    newDestinations[index] = value;
    onDestinationsChange(newDestinations);
  };

  const handleSelectSuggestion = (suggestion: string) => {
    const newDestinations = [...destinations];
    newDestinations[activeDestinationIndex] = suggestion;
    onDestinationsChange(newDestinations);
    setDestinationQuery("");
    setShowSuggestions(false);
  };

  const addDestination = () => {
    onDestinationsChange([...destinations, ""]);
    setActiveDestinationIndex(destinations.length);
  };

  const removeDestination = (index: number) => {
    if (destinations.length <= 1) return;
    
    const newDestinations = destinations.filter((_, i) => i !== index);
    onDestinationsChange(newDestinations);
    
    // Adjust active index if needed
    if (activeDestinationIndex >= index && activeDestinationIndex > 0) {
      setActiveDestinationIndex(activeDestinationIndex - 1);
    }
  };

  return (
    <div className="space-y-3">
      {destinations.map((destination, index) => (
        <div key={index} className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Input
                value={destination}
                onChange={(e) => handleDestinationChange(e, index)}
                onFocus={() => {
                  setActiveDestinationIndex(index);
                  setShowSuggestions(true);
                }}
                placeholder={`City ${index + 1}`}
                className="pr-10 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
              />
              <Search size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {destinations.length > 1 && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full flex-shrink-0"
                onClick={() => removeDestination(index)}
              >
                <X size={16} />
              </Button>
            )}
          </div>
          
          {/* Show suggestions only for the active input */}
          {showSuggestions && index === activeDestinationIndex && suggestions.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-auto ios-shadow">
              {suggestions.map((suggestion, sIndex) => (
                <div
                  key={sIndex}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Add destination button */}
      <Button
        variant="outline"
        size="sm"
        onClick={addDestination}
        className="mt-2 w-full border-dashed border-gray-300 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-xl"
      >
        <PlusCircle size={16} className="mr-2" />
        Add another city
      </Button>
    </div>
  );
};

export default MultiCityDestinationInput;
