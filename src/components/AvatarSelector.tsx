import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export const TRAVEL_AVATARS = [
  { id: 'explorer', name: 'Explorer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=explorer&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=264653&accessoriesColor=2a9d8f' },
  { id: 'backpacker', name: 'Backpacker', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=backpacker&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=e76f51&accessoriesColor=f4a261' },
  { id: 'photographer', name: 'Photographer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=photographer&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=2a9d8f&accessoriesColor=264653' },
  { id: 'foodie', name: 'Foodie', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=foodie&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=e9c46a&accessoriesColor=f4a261' },
  { id: 'adventurer', name: 'Adventurer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=adventurer&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=e76f51&accessoriesColor=2a9d8f' },
  { id: 'culture', name: 'Culture Seeker', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=culture&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=264653&accessoriesColor=e9c46a' },
  { id: 'beach', name: 'Beach Lover', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=beach&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=2a9d8f&accessoriesColor=e9c46a' },
  { id: 'mountain', name: 'Mountain Explorer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mountain&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=264653&accessoriesColor=e76f51' },
  { id: 'city', name: 'City Explorer', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=city&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=2a9d8f&accessoriesColor=264653' },
  { id: 'nature', name: 'Nature Lover', url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=nature&backgroundColor=ffdfbf&hairColor=2c1b27&facialHairColor=2c1b27&clothingColor=2a9d8f&accessoriesColor=e9c46a' }
];

interface AvatarSelectorProps {
  currentAvatar: string;
  onSelect: (avatarUrl: string) => void;
}

const AvatarSelector: React.FC<AvatarSelectorProps> = ({ currentAvatar, onSelect }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Change Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Choose Your Travel Avatar</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[400px] pr-4">
          <div className="grid grid-cols-2 gap-4 py-4">
            {TRAVEL_AVATARS.map((avatar) => (
              <div
                key={avatar.id}
                className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all ${
                  currentAvatar === avatar.url
                    ? 'bg-amber-100 border-2 border-amber-500'
                    : 'hover:bg-gray-100 border border-transparent'
                }`}
                onClick={() => onSelect(avatar.url)}
              >
                <Avatar className="w-20 h-20 mb-2">
                  <AvatarImage src={avatar.url} />
                  <AvatarFallback>{avatar.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{avatar.name}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarSelector; 