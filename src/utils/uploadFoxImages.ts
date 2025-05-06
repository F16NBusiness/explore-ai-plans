
import { supabase } from '@/integrations/supabase/client';

interface FoxImage {
  variant: string;
  file: File;
}

export const uploadFoxImage = async (variant: string, file: File): Promise<string | null> => {
  try {
    const fileName = `fox-${variant}.webp`;
    console.log(`Uploading ${fileName} to fox_mascots bucket`);
    
    // Upload the file to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('fox_mascots')
      .upload(fileName, file, {
        cacheControl: '0', // Don't cache since we want fresh images
        upsert: true,
        contentType: file.type // Set the correct content type
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
    
    console.log(`Successfully uploaded image. Public URL: ${urlData.publicUrl}`);
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
    console.log('Starting upload of all fox mascot images');
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
    const results = await Promise.all(uploadPromises);
    
    const allSucceeded = results.every(result => result !== null);
    console.log(`Upload completed. All succeeded: ${allSucceeded}`);
    return allSucceeded;
  } catch (error) {
    console.error('Failed to upload all fox images:', error);
    return false;
  }
};
