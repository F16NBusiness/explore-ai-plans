
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState<string>("");

  const interests = [
    { name: "Food & Dining", color: "#FF6B6B", icon: "🍽️" },
    { name: "Art & Museums", color: "#4ECDC4", icon: "🖼️" },
    { name: "History & Culture", color: "#FFD166", icon: "🏛️" },
    { name: "Nature & Outdoors", color: "#06D6A0", icon: "🌳" },
    { name: "Shopping", color: "#118AB2", icon: "🛍️" },
    { name: "Nightlife", color: "#9370DB", icon: "🌃" },
    { name: "Relaxation", color: "#B8E0D2", icon: "🧘" },
    { name: "Adventure", color: "#FF924C", icon: "🧗" }
  ];

  const travelStyles = [
    { name: "Budget traveler", color: "#06D6A0", icon: "💰" },
    { name: "Mid-range", color: "#118AB2", icon: "💼" },
    { name: "Luxury traveler", color: "#9370DB", icon: "👑" },
    { name: "Family travel", color: "#FF6B6B", icon: "👨‍👩‍👧" },
    { name: "Solo travel", color: "#4ECDC4", icon: "🧳" },
    { name: "Couples getaway", color: "#FF924C", icon: "💑" }
  ];

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleContinueToCreateTrip = () => {
    // Save user preferences to localStorage before navigating
    localStorage.setItem('user_interests', JSON.stringify(selectedInterests));
    localStorage.setItem('user_travel_style', travelStyle);
    navigate("/create-trip");
  };

  const getProgressPercentage = () => {
    return ((step + 1) / 3) * 100;
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">Welcome to TravelAI</h2>
            <p className="text-gray-600 text-center mb-8">
              Let's get to know you better to create your perfect travel experiences.
            </p>
            <Button 
              onClick={() => setStep(1)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full flex items-center justify-center gap-2 h-14 shadow-md"
            >
              Let's get started <ArrowRight size={16} />
            </Button>
          </div>
        );
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">What are you interested in?</h2>
            <p className="text-gray-600 text-sm mb-4">
              Select all that apply. This helps us plan activities you'll enjoy.
            </p>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {interests.map(interest => (
                <div 
                  key={interest.name}
                  onClick={() => toggleInterest(interest.name)}
                  className={`border rounded-xl p-3 flex items-center gap-3 cursor-pointer transition-all ${selectedInterests.includes(interest.name) 
                    ? 'border-transparent bg-gradient-to-br from-purple-100 to-blue-100 shadow-sm' 
                    : 'border-gray-200'}`}
                  style={{
                    boxShadow: selectedInterests.includes(interest.name) ? `0 2px 8px ${interest.color}40` : 'none'
                  }}
                >
                  <div 
                    className="h-8 w-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: interest.color }}
                  >
                    {interest.icon}
                  </div>
                  <span className={`text-sm ${selectedInterests.includes(interest.name) ? 'font-medium text-purple-600' : 'text-gray-800'}`}>
                    {interest.name}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full h-14 shadow-md"
              disabled={selectedInterests.length === 0}
            >
              Continue
            </Button>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent mb-2">What's your travel style?</h2>
            <p className="text-gray-600 text-sm mb-4">
              This helps us match accommodations and activities to your preferences.
            </p>
            <div className="flex flex-col gap-2 mb-8">
              {travelStyles.map(style => (
                <div 
                  key={style.name}
                  onClick={() => setTravelStyle(style.name)}
                  className={`rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                    travelStyle === style.name 
                      ? 'border-transparent bg-gradient-to-br from-purple-100 to-blue-100 shadow-sm' 
                      : 'border border-gray-200'}`}
                  style={{
                    boxShadow: travelStyle === style.name ? `0 2px 8px ${style.color}40` : 'none'
                  }}
                >
                  <div 
                    className="h-10 w-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: style.color }}
                  >
                    {style.icon}
                  </div>
                  <span className={`${travelStyle === style.name ? 'font-medium text-purple-600' : 'text-gray-800'}`}>
                    {style.name}
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleContinueToCreateTrip}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white rounded-full h-14 shadow-md"
              disabled={!travelStyle}
            >
              Continue
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* iOS-style status bar */}
      <div className="bg-gray-50 h-12 w-full flex items-center px-4 fixed top-0 z-10">
        <div className="text-sm font-medium text-gray-600">11:51</div>
        <div className="ml-auto flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M18 10h.01"></path>
            <path d="M22 10h.01"></path>
            <path d="M6 10h.01"></path>
            <path d="M10 10h.01"></path>
            <path d="M14 10h.01"></path>
            <path d="M18 14h.01"></path>
            <path d="M22 14h.01"></path>
            <path d="M6 14h.01"></path>
            <path d="M10 14h.01"></path>
            <path d="M14 14h.01"></path>
            <path d="M18 18h.01"></path>
            <path d="M22 18h.01"></path>
            <path d="M6 18h.01"></path>
            <path d="M10 18h.01"></path>
            <path d="M14 18h.01"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M23 6v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2z"></path>
            <path d="M11 4v16"></path>
            <path d="M7 8v.01"></path>
            <path d="M7 12v.01"></path>
            <path d="M7 16v.01"></path>
            <path d="M15 8v.01"></path>
            <path d="M15 12v.01"></path>
            <path d="M15 16v.01"></path>
          </svg>
        </div>
      </div>
      
      <div className="mt-12 pt-8 px-4 flex-1">
        {step > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            className="p-0 hover:bg-transparent mb-4 text-purple-600" 
            onClick={() => setStep(prev => prev - 1)}
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
        )}
        
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-purple-600">Step {step + 1} of 3</span>
            <span className="text-xs text-gray-500">{getProgressPercentage()}%</span>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 bg-gray-200" indicatorClassName="bg-gradient-to-r from-purple-600 to-blue-500" />
        </div>
        
        <Card className="bg-white rounded-2xl shadow-lg border-0">
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;
