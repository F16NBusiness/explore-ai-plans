
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FoxMascot from "@/components/FoxMascot";
import FoxMessage from "@/components/FoxMessage";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* iOS-style status bar */}
      <div className="bg-white h-10 w-full flex items-center justify-between px-4 fixed top-0 z-10">
        <div className="text-xs font-medium text-gray-600">11:51</div>
        <div className="flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M18 10h.01"></path>
            <path d="M22 10h.01"></path>
            <path d="M6 10h.01"></path>
            <path d="M10 10h.01"></path>
            <path d="M14 10h.01"></path>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
            <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
            <line x1="12" y1="20" x2="12.01" y2="20"></line>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600">
            <path d="M23 6v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2z"></path>
          </svg>
        </div>
      </div>
      
      <div className="mt-10 pt-8 px-6 flex-1 max-w-md mx-auto w-full">
        <div className="flex flex-col items-center justify-center mb-8 fade-in">
          <FoxMascot variant="map" size="lg" className="mb-5" />
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">TravelAI</h1>
          <p className="text-sm text-gray-600 text-center max-w-xs">
            Your AI travel assistant. Create personalized itineraries in seconds.
          </p>
        </div>
        
        <FoxMessage 
          message="Hi there! I'm Foxy, your travel companion. Ready to plan an amazing trip together?"
          variant="map"
          className="mb-6 animate-slide-in"
          position="left"
        />
        
        <div className="space-y-4">
          <Card className="ios-card slide-up" style={{animationDelay: "0.1s"}}>
            <div className="h-1 bg-gradient-to-r from-violet-500 to-blue-500"></div>
            <CardContent className="p-5">
              <h2 className="text-base font-medium text-gray-800 mb-2">Get Started</h2>
              <p className="text-sm text-gray-600 mb-4">
                Create your first AI-generated travel itinerary in minutes.
              </p>
              <Button 
                onClick={() => navigate("/onboarding")}
                className="w-full bg-gradient-to-r from-violet-500 to-blue-500 hover:from-violet-600 hover:to-blue-600 text-white rounded-xl flex items-center justify-center gap-2 h-10 shadow-sm"
              >
                Continue <ArrowRight size={14} />
              </Button>
            </CardContent>
          </Card>

          <Card className="ios-card slide-up" style={{animationDelay: "0.2s"}}>
            <div className="h-1 bg-gradient-to-r from-green-400 to-blue-500"></div>
            <CardContent className="p-5 relative">
              <div className="flex items-start">
                <div className="flex-grow">
                  <h2 className="text-base font-medium text-gray-800 mb-2">About TravelAI</h2>
                  <p className="text-sm text-gray-600">
                    Our AI creates personalized travel itineraries based on your preferences, 
                    budget, and travel style. Get day-by-day plans, budget estimates, 
                    packing lists, and local tips.
                  </p>
                </div>
                <FoxMascot variant="beach" size="sm" className="ml-2 -mt-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* iOS-style bottom nav */}
      <div className="bg-white border-t border-gray-100 h-16 w-full flex items-center justify-around px-4 fixed bottom-0 shadow-sm">
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-violet-500 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          </div>
          <span className="text-xs font-medium mt-1 text-violet-600">Home</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <span className="text-xs font-medium mt-1 text-gray-500">Trips</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
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

export default HomePage;
