
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

type FoxMascotVariant = 'default' | 'ski' | 'beach' | 'map' | 'family';
type FoxMascotSize = 'sm' | 'md' | 'lg';

interface FoxMascotProps {
  variant?: FoxMascotVariant;
  size?: FoxMascotSize;
  className?: string;
}

const FoxMascot: React.FC<FoxMascotProps> = ({ 
  variant = 'default', 
  size = 'md',
  className = ''
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };

  // Fallback images in case Supabase isn't available
  const fallbackImages = {
    default: '/lovable-uploads/3e5b9dc8-98b1-458e-ab4f-b4e320bd9148.png',
    ski: '/lovable-uploads/4bfccb3b-9f11-488c-8fc8-3ca5ac46e391.png',
    beach: '/lovable-uploads/ee1c8cbc-ef5e-4221-bf99-d19b56b4a0c3.png',
    map: '/lovable-uploads/e5af8af1-41a6-4654-8acf-bf7185f0fa3f.png',
    family: '/lovable-uploads/cf3a3bb9-8ad8-41ca-a6af-9abe9a59fdce.png' // Using the uploaded image
  };

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(false);
      try {
        const imageName = `fox-${variant}.webp`;
        console.log(`Fetching image: ${imageName} from fox_mascots bucket`);
        
        // Try to get the image from Supabase
        const { data, error } = await supabase
          .storage
          .from('fox_mascots')
          .getPublicUrl(imageName);
        
        if (error) {
          console.error('Error fetching from Supabase:', error);
          setError(true);
          setImageUrl(fallbackImages[variant]);
          return;
        }
        
        if (data && data.publicUrl) {
          console.log('Successfully fetched image URL:', data.publicUrl);
          // Add a timestamp to force a fresh image load and avoid caching issues
          const timestampedUrl = `${data.publicUrl}?t=${new Date().getTime()}`;
          setImageUrl(timestampedUrl);
        } else {
          console.warn('No data returned from Supabase, using fallback');
          setImageUrl(fallbackImages[variant]);
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        setImageUrl(fallbackImages[variant]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [variant]);

  return (
    <div className={`${sizeClasses[size]} ${className} relative group animate-fadeIn`}>
      {loading ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-full">
          <div className="w-1/2 h-1/2 border-2 border-t-violet-500 border-r-violet-300 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <img 
          src={imageUrl || fallbackImages[variant]} 
          alt={`Fox mascot ${variant}`} 
          className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-300"
          onError={() => {
            console.log(`Error loading image, falling back to: ${fallbackImages[variant]}`);
            setImageUrl(fallbackImages[variant]);
          }}
        />
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-10 rounded-full">
        </div>
      )}
    </div>
  );
};

export default FoxMascot;
