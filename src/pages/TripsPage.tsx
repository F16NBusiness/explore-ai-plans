import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MapPin, Calendar, DollarSign, Heart, Share2, MessageCircle, Bookmark, Star, Trophy, Users, Globe, Award, Zap, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';
import { Trip, User, Badge } from '@/types/trip';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import AvatarSelector, { TRAVEL_AVATARS } from '@/components/AvatarSelector';

const TripsPage: React.FC = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my-trips');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User>({
    id: '1',
    name: 'Traveler',
    level: 1,
    xp: 0,
    badges: [
      { 
        id: '1', 
        name: 'First Trip', 
        description: 'Created your first trip', 
        icon: 'trip',
        requirements: { tripsCreated: 1 }
      },
      { 
        id: '2', 
        name: 'Explorer', 
        description: 'Completed 5 trips', 
        icon: 'explorer',
        requirements: { tripsCompleted: 5 }
      }
    ],
    tripsCreated: 0,
    tripsSaved: 0,
    tripsCompleted: 0
  });

  useEffect(() => {
    loadTrips();
    loadUserData();
  }, []);

  const loadTrips = () => {
    try {
      const savedTrips = localStorage.getItem('savedTrips');
      if (savedTrips) {
        setTrips(JSON.parse(savedTrips).map((trip: any) => ({
          ...trip,
          likes: Math.floor(Math.random() * 100),
          shares: Math.floor(Math.random() * 50),
          comments: Array(Math.floor(Math.random() * 10)).fill(null).map((_, i) => ({
            id: `comment-${i}`,
            userId: `user-${i}`,
            userName: `User ${i + 1}`,
            content: `Great trip! I love the itinerary for ${trip.destinations[0].city}`,
            createdAt: new Date().toISOString(),
            likes: Math.floor(Math.random() * 5)
          })),
          author: {
            id: user.id,
            name: user.name,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`
          },
          isPublic: true,
          tags: ['adventure', 'exploration', 'culture', 'food'],
          difficulty: ['easy', 'moderate', 'challenging'][Math.floor(Math.random() * 3)],
          rating: (Math.random() * 2 + 3).toFixed(1),
          views: Math.floor(Math.random() * 1000),
          savedBy: Array(Math.floor(Math.random() * 20)).fill(null).map(() => `user-${Math.floor(Math.random() * 100)}`)
        })));
      }
    } catch (error) {
      console.error('Error loading trips:', error);
      toast.error('Failed to load saved trips');
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = () => {
    try {
      const savedUser = localStorage.getItem('userData');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        // Initialize with some sample data
        const sampleUser = {
          id: '1',
          name: 'Traveler',
          level: 1,
          xp: 250,
          badges: [
            { 
              id: '1', 
              name: 'First Trip', 
              description: 'Created your first trip', 
              icon: 'trip',
              requirements: { tripsCreated: 1 }
            },
            { 
              id: '2', 
              name: 'Explorer', 
              description: 'Completed 5 trips', 
              icon: 'explorer',
              requirements: { tripsCompleted: 5 }
            }
          ],
          tripsCreated: 3,
          tripsSaved: 5,
          tripsCompleted: 2
        };
        setUser(sampleUser);
        localStorage.setItem('userData', JSON.stringify(sampleUser));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLike = (tripId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, likes: trip.likes + 1 };
      }
      return trip;
    }));
    setUser(prev => ({ ...prev, xp: prev.xp + 10 }));
    toast.success('Trip liked! +10 XP');
  };

  const handleShare = (tripId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, shares: trip.shares + 1 };
      }
      return trip;
    }));
    setUser(prev => ({ ...prev, xp: prev.xp + 15 }));
    toast.success('Trip shared! +15 XP');
  };

  const handleSave = (tripId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, savedBy: [...trip.savedBy, user.id] };
      }
      return trip;
    }));
    setUser(prev => ({ ...prev, tripsSaved: prev.tripsSaved + 1, xp: prev.xp + 5 }));
    toast.success('Trip saved! +5 XP');
  };

  const handleCompleteTrip = (tripId: string) => {
    setTrips(prev => prev.map(trip => {
      if (trip.id === tripId) {
        const completed = !trip.completed;
        if (completed) {
          setUser(prev => ({ 
            ...prev, 
            tripsCompleted: prev.tripsCompleted + 1,
            xp: prev.xp + 100 // Award XP for completing a trip
          }));
          toast.success('Trip completed! +100 XP');
        }
        return { ...trip, completed };
      }
      return trip;
    }));
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUser(prev => {
      const updatedUser = { ...prev, avatar: newAvatarUrl };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const filteredTrips = trips.filter(trip => {
    const matchesSearch = trip.destinations.some(dest => 
      dest.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    switch (activeTab) {
      case 'my-trips':
        return matchesSearch && trip.author.id === user.id;
      case 'saved':
        return matchesSearch && trip.savedBy.includes(user.id);
      case 'community':
        return matchesSearch && trip.isPublic;
      case 'completed':
        return matchesSearch && trip.completed;
      default:
        return matchesSearch;
    }
  });

  const getNextLevelXP = (currentLevel: number) => {
    return currentLevel * 1000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-16">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* User Profile Section */}
        <Card className="mb-8 border-none shadow-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col items-center space-y-2">
                  <Avatar className="w-20 h-20 border-4 border-white">
                    <AvatarImage src={user.avatar || TRAVEL_AVATARS[0].url} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <AvatarSelector 
                    currentAvatar={user.avatar || TRAVEL_AVATARS[0].url} 
                    onSelect={handleAvatarChange} 
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5" />
                      <span className="font-semibold">Level {user.level}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-5 h-5" />
                      <span className="font-semibold">{user.xp} XP</span>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Progress 
                      value={(user.xp % getNextLevelXP(user.level)) / 10} 
                      className="h-2 bg-white/20"
                    />
                    <p className="text-sm mt-1">
                      {getNextLevelXP(user.level) - (user.xp % getNextLevelXP(user.level))} XP to next level
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex space-x-4">
                {user.badges.map((badge, index) => (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-2">
                      <Award className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex justify-between items-center mb-6">
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md bg-white shadow-sm"
          />
          <Button
            onClick={() => navigate('/create-trip')}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Trip
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 w-full bg-white shadow-sm">
            <TabsTrigger value="my-trips" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              My Trips
            </TabsTrigger>
            <TabsTrigger value="saved" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Saved
            </TabsTrigger>
            <TabsTrigger value="community" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Community
            </TabsTrigger>
            <TabsTrigger value="completed" className="data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Completed
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
          </div>
        ) : filteredTrips.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <MapPin className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No trips found</h3>
              <p className="text-gray-500 mb-4">Start planning your next adventure!</p>
              <Button
                onClick={() => navigate('/create-trip')}
                className="bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all"
              >
                Create Your First Trip
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <Card key={trip.id} className={`hover:shadow-xl transition-all duration-300 ${trip.completed ? 'border-2 border-amber-500' : ''}`}>
                <CardHeader className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {trip.destinations.map(d => d.city).join(' → ')}
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                        </span>
                      </CardDescription>
                    </div>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={trip.author.avatar} />
                      <AvatarFallback>{trip.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    {/* Trip Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center text-amber-500">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span>${trip.budget}</span>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-1" />
                        <span>{trip.rating}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{trip.views}</span>
                      </div>
                    </div>

                    {/* Tags and Difficulty */}
                    <div className="flex flex-wrap gap-2">
                      <BadgeComponent variant="secondary" className="bg-amber-100 text-amber-800">
                        {trip.difficulty}
                      </BadgeComponent>
                      {trip.tags.map((tag, index) => (
                        <BadgeComponent key={index} variant="outline" className="border-amber-200">
                          {tag}
                        </BadgeComponent>
                      ))}
                    </div>

                    {/* Completion Status */}
                    <div className="flex items-center justify-between">
                      <Button
                        variant={trip.completed ? "default" : "outline"}
                        onClick={() => handleCompleteTrip(trip.id)}
                        className={`flex items-center space-x-2 ${
                          trip.completed 
                            ? 'bg-amber-500 text-white hover:bg-amber-600' 
                            : 'hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>{trip.completed ? 'Completed' : 'Mark as Complete'}</span>
                      </Button>
                      {trip.completed && (
                        <BadgeComponent variant="secondary" className="bg-amber-100 text-amber-800">
                          <Trophy className="w-3 h-3 mr-1" />
                          Completed
                        </BadgeComponent>
                      )}
                    </div>

                    {/* Social Stats */}
                    <div className="flex justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <button 
                          onClick={() => handleLike(trip.id)} 
                          className="flex items-center hover:text-amber-500 transition-colors"
                        >
                          <Heart className="w-4 h-4 mr-1" />
                          {trip.likes}
                        </button>
                        <button 
                          onClick={() => handleShare(trip.id)} 
                          className="flex items-center hover:text-amber-500 transition-colors"
                        >
                          <Share2 className="w-4 h-4 mr-1" />
                          {trip.shares}
                        </button>
                        <button className="flex items-center hover:text-amber-500 transition-colors">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {trip.comments.length}
                        </button>
                      </div>
                      <button 
                        onClick={() => handleSave(trip.id)} 
                        className="flex items-center hover:text-amber-500 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 mr-1" />
                        Save
                      </button>
                    </div>

                    <Separator />

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          if (trip.itinerary) {
                            sessionStorage.setItem('tripItinerary', JSON.stringify(trip.itinerary));
                            navigate(`/itinerary?tripId=${trip.id}`);
                          }
                        }}
                        className="flex-1 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                      >
                        View Itinerary
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          const newTrip = {
                            ...trip,
                            id: crypto.randomUUID(),
                            author: {
                              id: user.id,
                              name: user.name
                            },
                            createdAt: new Date().toISOString()
                          };
                          const savedTrips = JSON.parse(localStorage.getItem('savedTrips') || '[]');
                          localStorage.setItem('savedTrips', JSON.stringify([...savedTrips, newTrip]));
                          toast.success('Trip cloned successfully!');
                        }}
                        className="hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"
                      >
                        Clone
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TripsPage; 