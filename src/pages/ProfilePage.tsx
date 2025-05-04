import React, { useState } from 'react';
import { Settings, User, Bell, Moon, Sun, Globe, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  language: string;
  travelPreferences: {
    familyFriendly: boolean;
    accessibility: boolean;
    budgetRange: string;
  };
}

const ProfilePage: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: false,
    notifications: true,
    language: 'en',
    travelPreferences: {
      familyFriendly: true,
      accessibility: false,
      budgetRange: 'medium'
    }
  });

  const handlePreferenceChange = (key: keyof UserPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleTravelPreferenceChange = (key: keyof UserPreferences['travelPreferences'], value: any) => {
    setPreferences(prev => ({
      ...prev,
      travelPreferences: {
        ...prev.travelPreferences,
        [key]: value
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <User className="w-6 h-6 mr-2 text-amber-500" />
          <h1 className="text-2xl font-bold text-gray-900">Profile & Settings</h1>
        </div>

        <div className="space-y-4">
          {/* General Settings */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">General Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Moon className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Dark Mode</span>
                  </div>
                  <Switch
                    checked={preferences.darkMode}
                    onCheckedChange={(checked) => handlePreferenceChange('darkMode', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Notifications</span>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => handlePreferenceChange('notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Language</span>
                  </div>
                  <select
                    value={preferences.language}
                    onChange={(e) => handlePreferenceChange('language', e.target.value)}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Travel Preferences */}
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Travel Preferences</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Family Friendly</span>
                  </div>
                  <Switch
                    checked={preferences.travelPreferences.familyFriendly}
                    onCheckedChange={(checked) => handleTravelPreferenceChange('familyFriendly', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Settings className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Accessibility</span>
                  </div>
                  <Switch
                    checked={preferences.travelPreferences.accessibility}
                    onCheckedChange={(checked) => handleTravelPreferenceChange('accessibility', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Budget Range</span>
                  </div>
                  <select
                    value={preferences.travelPreferences.budgetRange}
                    onChange={(e) => handleTravelPreferenceChange('budgetRange', e.target.value)}
                    className="border rounded-md px-2 py-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 