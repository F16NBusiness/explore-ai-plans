import React, { useState, useEffect } from 'react';
import { Plane, MapPin, Globe, Compass, Camera, Utensils } from 'lucide-react';

const travelMessages = [
  "Packing your virtual suitcase...",
  "Consulting with local experts...",
  "Finding the best hidden gems...",
  "Checking the weather forecast...",
  "Mapping out the perfect route...",
  "Discovering local cuisine...",
  "Planning your photo spots...",
  "Researching cultural experiences...",
  "Finding the best viewpoints...",
  "Creating your personalized adventure..."
];

const LoadingScreen: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const messageInterval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % travelMessages.length);
    }, 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const icons = [Plane, MapPin, Globe, Compass, Camera, Utensils];
  const Icon = icons[currentMessage % icons.length];

  return (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8 text-center">
        <div className="animate-bounce mb-8">
          <Icon className="w-16 h-16 text-amber-500 mx-auto" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {travelMessages[currentMessage]}
        </h2>
        
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-500">
          This might take a minute or two. We're making sure your trip is perfect!
        </p>
        
        <div className="mt-8 grid grid-cols-3 gap-4">
          {icons.map((Icon, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg transition-all duration-300 ${
                index === currentMessage % icons.length
                  ? 'bg-amber-100 text-amber-500'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 