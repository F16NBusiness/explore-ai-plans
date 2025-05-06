
import { supabase } from '@/integrations/supabase/client';

interface FoxImage {
  variant: string;
  file: File;
}

export const uploadFoxImage = async (variant: string, file: File): Promise<string | null> => {
  try {
    const fileName = `fox-${variant}.webp`;
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('fox_mascots')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading image to Supabase:', error);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = await supabase
      .storage
      .from('fox_mascots')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    return null;
  }
};

export const uploadAllFoxImages = async (
  defaultImage: File,
  skiImage: File,
  beachImage: File,
  mapImage: File,
  familyImage?: File
): Promise<boolean> => {
  try {
    const images: FoxImage[] = [
      { variant: 'default', file: defaultImage },
      { variant: 'ski', file: skiImage },
      { variant: 'beach', file: beachImage },
      { variant: 'map', file: mapImage }
    ];
    
    if (familyImage) {
      images.push({ variant: 'family', file: familyImage });
    }
    
    const uploadPromises = images.map(img => uploadFoxImage(img.variant, img.file));
    await Promise.all(uploadPromises);
    
    return true;
  } catch (error) {
    console.error('Failed to upload all fox images:', error);
    return false;
  }
};
