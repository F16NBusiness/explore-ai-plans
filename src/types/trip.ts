export interface Trip {
  id: string;
  destinations: Array<{
    city: string;
    country: string;
    nights: number;
  }>;
  startDate: string;
  endDate: string;
  budget: number;
  createdAt: string;
  itinerary?: any;
  likes: number;
  shares: number;
  comments: Comment[];
  author: {
    id: string;
    name: string;
    avatar?: string;
  };
  isPublic: boolean;
  tags: string[];
  difficulty: 'easy' | 'moderate' | 'challenging';
  rating: number;
  views: number;
  savedBy: string[];
  completed?: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  likes: number;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  level: number;
  xp: number;
  badges: Badge[];
  tripsCreated: number;
  tripsSaved: number;
  tripsCompleted: number;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirements: {
    tripsCreated?: number;
    tripsCompleted?: number;
    likesReceived?: number;
    commentsMade?: number;
  };
} 