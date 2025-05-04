import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Key, DollarSign, Plus, Minus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { generateMultiCityItinerary } from "@/services/itineraryService";
import MultiCityDestinationInput from "@/components/MultiCityDestinationInput";
import DateRangeSelector from "@/components/DateRangeSelector";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Destination {
  city: string;
  country: string;
  nights: number;
}

interface AdvancedSettings {
  familyFriendly: boolean;
  accessibility: boolean;
  interests: string[];
  travelStyle: string;
}

const CreateTripPage: React.FC = () => {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([{ city: '', country: '', nights: 1 }]);
  const [budget, setBudget] = useState<string>('');
  const [dates, setDates] = useState<DateRange | undefined>();
  const [loading, setLoading] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    familyFriendly: false,
    accessibility: false,
    interests: [],
    travelStyle: 'balanced'
  });

  const handleCreateTrip = async () => {
    // Filter out empty destinations
    const validDestinations = destinations.filter(dest => dest.city.trim() !== "");
    
    // Validate input
    if (validDestinations.length === 0) {
      toast.error("Please select at least one destination");
      return;
    }

    if (!budget || isNaN(Number(budget)) || Number(budget) <= 0) {
      toast.error("Please enter a valid budget");
      return;
    }

    // Validate that both from and to dates are selected
    if (!dates?.from || !dates?.to) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    setLoading(true);
    
    try {
      // Call the multi-city itinerary generator with advanced settings
      const itinerary = await generateMultiCityItinerary({
        destinations: validDestinations,
        startDate: dates.from,
        budget: Number(budget),
        preferences: advancedSettings
      });
      
      if (!itinerary) {
        throw new Error("Failed to generate itinerary");
      }

      // Create trip object
      const newTrip = {
        id: crypto.randomUUID(),
        destinations: validDestinations,
        startDate: dates.from.toISOString(),
        endDate: dates.to.toISOString(),
        budget: Number(budget),
        createdAt: new Date().toISOString(),
        itinerary: itinerary
      };

      // Save trip to localStorage
      const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
      localStorage.setItem('savedTrips', JSON.stringify([...savedTrips, newTrip]));
      
      // Store itinerary in session storage for retrieval in ItineraryPage
      sessionStorage.setItem('tripItinerary', JSON.stringify(itinerary));
      
      // Navigate to the itinerary page
      navigate("/itinerary");
    } catch (error) {
      console.error("Error generating itinerary:", error);
      toast.error("Failed to create trip. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDestinationChange = (index: number, field: keyof Destination, value: string | number) => {
    setDestinations(prev => {
      const newDestinations = [...prev];
      newDestinations[index] = {
        ...newDestinations[index],
        [field]: value
      };
      return newDestinations;
    });
  };

  const addDestination = () => {
    setDestinations(prev => [...prev, { city: '', country: '', nights: 1 }]);
  };

  const removeDestination = (index: number) => {
    if (destinations.length > 1) {
      setDestinations(prev => prev.filter((_, i) => i !== index));
    }
  };

  const isComplete = destinations.some(d => d.city.trim() !== "") && budget && dates?.from && dates?.to;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      {loading && <LoadingScreen />}
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Your Trip</h1>
          <p className="mt-2 text-sm text-gray-600">
            Plan your perfect multi-city adventure
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="space-y-4">
            {/* Destinations */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-800">Where are you going?</label>
                <span className="text-xs text-purple-600">{destinations.filter(d => d.city.trim() !== "").length} cities</span>
              </div>
              
              {destinations.map((destination, index) => (
                <div key={index} className="flex gap-4 mb-4">
                  <div className="flex-1">
                    <Input
                      value={destination.city}
                      onChange={(e) => handleDestinationChange(index, 'city', e.target.value)}
                      placeholder="City, Country"
                      className="rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      min="1"
                      value={destination.nights}
                      onChange={(e) => handleDestinationChange(index, 'nights', parseInt(e.target.value) || 1)}
                      placeholder="Nights"
                      className="rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  {destinations.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeDestination(index)}
                      className="rounded-xl"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                onClick={addDestination}
                className="w-full mt-2 rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another City
              </Button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-800 mb-1">What's your budget?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ''))}
                  type="text"
                  inputMode="numeric"
                  placeholder="Total budget"
                  className="pl-7 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
            </div>
            
            <DateRangeSelector 
              dates={dates}
              onDatesChange={setDates}
            />

            {/* Advanced Settings */}
            <div className="pt-4 border-t">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <Settings className="h-4 w-4 mr-2" />
                    Advanced Settings
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Advanced Trip Settings</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Family Friendly</label>
                      <Switch
                        checked={advancedSettings.familyFriendly}
                        onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, familyFriendly: checked }))}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Accessibility</label>
                      <Switch
                        checked={advancedSettings.accessibility}
                        onCheckedChange={(checked) => setAdvancedSettings(prev => ({ ...prev, accessibility: checked }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Travel Style</label>
                      <select
                        value={advancedSettings.travelStyle}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, travelStyle: e.target.value }))}
                        className="w-full rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      >
                        <option value="relaxed">Relaxed</option>
                        <option value="balanced">Balanced</option>
                        <option value="active">Active</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium block mb-2">Interests (comma separated)</label>
                      <Input
                        value={advancedSettings.interests.join(', ')}
                        onChange={(e) => setAdvancedSettings(prev => ({ ...prev, interests: e.target.value.split(',').map(i => i.trim()) }))}
                        placeholder="e.g., museums, hiking, food"
                        className="rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                      />
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          <Button 
            onClick={handleCreateTrip}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full h-12 shadow-md mt-6"
            disabled={!isComplete || loading}
          >
            {loading ? "Creating your trip..." : "Create AI Itinerary"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateTripPage;
