
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import HomePage from './pages/HomePage';
import OnboardingPage from './pages/OnboardingPage';
import CreateTripPage from './pages/CreateTripPage';
import ItineraryPage from './pages/ItineraryPage';
import TripsPage from './pages/TripsPage';
import ProfilePage from './pages/ProfilePage';
import BottomNavigation from './components/BottomNavigation';
import { Toaster } from 'sonner';
import FoxMessage from './components/FoxMessage';
import FoxMascotAdmin from './pages/FoxMascotAdmin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="h-full w-full overflow-auto">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/create-trip" element={<CreateTripPage />} />
        <Route path="/itinerary" element={<ItineraryPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin/fox-mascots" element={<FoxMascotAdmin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <BottomNavigation />
      <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'white',
            border: '1px solid #f3f4f6',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      />
    </div>
  );
}

export default App;
