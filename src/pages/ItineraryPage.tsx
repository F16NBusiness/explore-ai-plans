
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripItinerary } from "@/services/itineraryService";
import MultiCityItineraryOverview from "@/components/MultiCityItineraryOverview";
import { toast } from "sonner";
import ItineraryHeader from "@/components/ItineraryHeader";
import FoxMascot from "@/components/FoxMascot";
import FoxMessage from "@/components/FoxMessage";

const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("itinerary");
  const [tripData, setTripData] = useState<TripItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCityIndex, setSelectedCityIndex] = useState(0);

  useEffect(() => {
    // Retrieve itinerary from session storage
    const storedItinerary = sessionStorage.getItem('tripItinerary');
    
    if (storedItinerary) {
      try {
        const parsedItinerary = JSON.parse(storedItinerary);
        setTripData(parsedItinerary);
      } catch (error) {
        console.error("Failed to parse stored itinerary:", error);
      }
    }
    
    setLoading(false);
  }, []);

  const handleShare = () => {
    // In a real app, this would implement sharing functionality
    toast.success("Sharing feature will be implemented in the future!");
  };

  // Get the days for the selected city
  const getSelectedCityDays = () => {
    if (!tripData || !tripData.cities || tripData.cities.length === 0) {
      return [];
    }
    
    // Ensure the selected index is valid
    const cityIndex = Math.min(selectedCityIndex, tripData.cities.length - 1);
    return tripData.cities[cityIndex].days;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-purple-600 border-r-blue-500 border-b-gray-200 border-l-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 text-gradient-primary font-medium">Loading your itinerary...</p>
        </div>
      </div>
    );
  }

  if (!tripData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <FoxMascot variant="map" size="lg" className="mb-4" />
        <FoxMessage 
          message="I couldn't find your itinerary. Let's create a new amazing trip!"
          variant="map"
          className="mb-6"
        />
        <Button 
          onClick={() => navigate('/create-trip')}
          className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full"
        >
          Create New Trip
        </Button>
      </div>
    );
  }

  const getActivityIcon = (title: string) => {
    if (title.toLowerCase().includes('breakfast') || title.toLowerCase().includes('lunch') || title.toLowerCase().includes('dinner') || title.toLowerCase().includes('cafe') || title.toLowerCase().includes('restaurant')) {
      return "🍽️";
    } else if (title.toLowerCase().includes('museum') || title.toLowerCase().includes('gallery') || title.toLowerCase().includes('palace') || title.toLowerCase().includes('temple') || title.toLowerCase().includes('wat')) {
      return "🖼️";
    } else if (title.toLowerCase().includes('park') || title.toLowerCase().includes('garden') || title.toLowerCase().includes('beach') || title.toLowerCase().includes('nature') || title.toLowerCase().includes('island')) {
      return "🌳";
    } else if (title.toLowerCase().includes('shopping') || title.toLowerCase().includes('market') || title.toLowerCase().includes('bazaar') || title.toLowerCase().includes('mall')) {
      return "🛍️";
    } else if (title.toLowerCase().includes('tour') || title.toLowerCase().includes('sight') || title.toLowerCase().includes('view')) {
      return "🏛️";
    } else if (title.toLowerCase().includes('cooking') || title.toLowerCase().includes('food') || title.toLowerCase().includes('tasting')) {
      return "👨‍🍳";
    } else if (title.toLowerCase().includes('boat') || title.toLowerCase().includes('cruise') || title.toLowerCase().includes('river')) {
      return "🚢";
    } else if (title.toLowerCase().includes('spa') || title.toLowerCase().includes('massage') || title.toLowerCase().includes('wellness')) {
      return "💆‍♀️";
    } else {
      return "📍";
    }
  };

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#9370DB', '#FF924C', '#B8E0D2'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Check if we have multiple cities
  const isMultiCity = tripData.cities && tripData.cities.length > 1;
  
  // Get the currently selected city name
  const selectedCityName = tripData.cities && tripData.cities.length > 0 
    ? tripData.cities[selectedCityIndex].city 
    : "";

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col pb-24">
      {/* iOS-style header */}
      <div className="bg-gray-50 h-12 w-full flex items-center justify-between px-4 fixed top-0 z-10">
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 hover:bg-transparent text-purple-600" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} className="mr-1" />
          Back
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          className="p-0 hover:bg-transparent text-purple-600" 
          onClick={handleShare}
        >
          <Share size={20} />
        </Button>
      </div>
      
      <div className="mt-12 pt-4 px-4 flex-1">
        {/* Trip header */}
        <ItineraryHeader tripData={tripData} isMultiCity={isMultiCity} />
        
        {/* Multi-city overview if multiple cities */}
        {isMultiCity && (
          <MultiCityItineraryOverview 
            itinerary={tripData} 
            onSelectCity={setSelectedCityIndex}
            selectedCityIndex={selectedCityIndex}
          />
        )}

        {/* Tab navigation */}
        <Tabs 
          defaultValue="itinerary" 
          className="w-full mb-4"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid grid-cols-3 bg-gray-100 rounded-xl p-1 h-auto shadow-inner">
            <TabsTrigger value="itinerary" className={`rounded-lg text-xs py-2 ${activeTab === 'itinerary' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-600'}`}>
              Itinerary
            </TabsTrigger>
            <TabsTrigger value="packing" className={`rounded-lg text-xs py-2 ${activeTab === 'packing' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-600'}`}>
              Packing List
            </TabsTrigger>
            <TabsTrigger value="tips" className={`rounded-lg text-xs py-2 ${activeTab === 'tips' ? 'bg-white shadow-sm text-purple-600 font-medium' : 'text-gray-600'}`}>
              Local Tips
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="itinerary" className="mt-4 space-y-4 animate-slide-in">
            {isMultiCity && (
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs mr-2">
                    {selectedCityIndex + 1}
                  </div>
                  {selectedCityName} Itinerary
                </h2>
                <FoxMascot 
                  variant={
                    selectedCityName.toLowerCase().includes('beach') ? 'beach' : 
                    selectedCityName.toLowerCase().includes('mountain') ? 'ski' : 'map'
                  } 
                  size="sm" 
                />
              </div>
            )}
            
            {getSelectedCityDays().map((day, index) => (
              <Collapsible key={index} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
                  <div className="h-1 bg-gradient-to-r from-purple-600 to-blue-500"></div>
                  <CollapsibleTrigger className="w-full text-left">
                    <CardHeader className="p-4 flex flex-row justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-800">Day {day.day}: {day.title}</h3>
                        <p className="text-xs text-gray-500">{day.date}</p>
                      </div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-400"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-4">
                        {day.activities.map((activity, actIdx) => {
                          const activityColor = getRandomColor();
                          const activityIcon = getActivityIcon(activity.title);
                          
                          return (
                            <div key={actIdx} className="border-t border-gray-100 pt-4 first:border-0 first:pt-0">
                              <div className="flex justify-between mb-2">
                                <div className="flex items-center">
                                  <Clock size={14} className="text-purple-500 mr-1" />
                                  <span className="text-xs font-medium text-purple-600">{activity.time}</span>
                                </div>
                                {activity.budget && (
                                  <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                    {activity.budget}
                                  </span>
                                )}
                              </div>
                              <div className="flex gap-3">
                                <div 
                                  className="h-10 w-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 mt-1"
                                  style={{ backgroundColor: activityColor }}
                                >
                                  {activityIcon}
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-800">{activity.title}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                                  {activity.location && (
                                    <div className="flex items-center mt-2 text-xs text-gray-500">
                                      <MapPin size={12} className="mr-1 flex-shrink-0" />
                                      <span>{activity.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </TabsContent>
          
          <TabsContent value="packing" className="mt-4 animate-slide-in">
            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-green-400 to-blue-400"></div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">Packing Essentials</h3>
                  <FoxMascot variant={tripData.packingList.some(item => item.toLowerCase().includes('ski') || item.toLowerCase().includes('snow')) ? 'ski' : 'beach'} size="sm" />
                </div>
                <ul className="space-y-3">
                  {tripData.packingList.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-green-400 to-blue-400 text-white flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tips" className="mt-4 animate-slide-in">
            <Card className="bg-white rounded-2xl shadow-lg border-0 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-400 to-orange-400"></div>
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-800">
                    {isMultiCity 
                      ? `Local Tips for ${tripData.cities[0].country}` 
                      : `Local Tips for ${tripData.destinations[0].split(',')[0]}`
                    }
                  </h3>
                  <FoxMascot variant="map" size="sm" />
                </div>
                <ul className="space-y-3">
                  {tripData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 text-white flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-800">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* iOS-style bottom nav */}
      <div className="bg-white border-t border-gray-200 h-20 w-full flex items-center justify-around px-4 fixed bottom-0 shadow-md">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-xs font-medium mt-1 text-gray-500">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span className="text-xs font-medium mt-1 text-purple-600">Trips</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="text-xs font-medium mt-1 text-gray-500">Profile</span>
        </div>
      </div>
    </div>
  );
};

export default ItineraryPage;
