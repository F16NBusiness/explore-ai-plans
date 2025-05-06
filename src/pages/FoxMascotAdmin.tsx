import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import FoxMascot from '@/components/FoxMascot';
import { uploadAllFoxImages } from '@/utils/uploadFoxImages';
import { supabase } from '@/integrations/supabase/client';

const FoxMascotAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [defaultImage, setDefaultImage] = useState<File | null>(null);
  const [skiImage, setSkiImage] = useState<File | null>(null);
  const [beachImage, setBeachImage] = useState<File | null>(null);
  const [mapImage, setMapImage] = useState<File | null>(null);
  const [familyImage, setFamilyImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [session, setSession] = useState<any>(null);
  
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      
      // Set up listener for auth changes
      const { data: authListener } = supabase.auth.onAuthStateChange(
        (event, newSession) => {
          setSession(newSession);
        }
      );
      
      return () => {
        authListener.subscription.unsubscribe();
      };
    };
    
    checkSession();
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<File | null>>
  ) => {
    if (event.target.files && event.target.files[0]) {
      setter(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!defaultImage || !skiImage || !beachImage || !mapImage) {
      toast.error("Please select all required fox mascot images before uploading.");
      return;
    }

    setUploading(true);
    try {
      const success = await uploadAllFoxImages(
        defaultImage,
        skiImage,
        beachImage,
        mapImage,
        familyImage || undefined
      );

      if (success) {
        toast.success("All fox mascot images have been uploaded successfully.");
        
        // Refresh the page to see the new images
        window.location.reload();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error('Error during upload:', error);
      toast.error("There was a problem uploading the fox mascot images. Please try again.");
    } finally {
      setUploading(false);
    }
  };
  
  // If not logged in, show login prompt
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2">Admin Access Required</h1>
              <p className="text-gray-600">You need to be logged in to access the Fox Mascot Admin page.</p>
            </div>
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-violet-500 to-blue-500"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => navigate(-1)} 
            className="mr-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <h1 className="text-2xl font-bold text-gradient-primary">Fox Mascot Admin</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Current Fox Mascots</h2>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
              <div className="flex flex-col items-center">
                <FoxMascot variant="default" size="md" />
                <p className="text-sm mt-2 text-gray-600">Default</p>
              </div>
              <div className="flex flex-col items-center">
                <FoxMascot variant="ski" size="md" />
                <p className="text-sm mt-2 text-gray-600">Ski</p>
              </div>
              <div className="flex flex-col items-center">
                <FoxMascot variant="beach" size="md" />
                <p className="text-sm mt-2 text-gray-600">Beach</p>
              </div>
              <div className="flex flex-col items-center">
                <FoxMascot variant="map" size="md" />
                <p className="text-sm mt-2 text-gray-600">Map</p>
              </div>
              <div className="flex flex-col items-center">
                <FoxMascot variant="family" size="md" />
                <p className="text-sm mt-2 text-gray-600">Family</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Upload New Fox Mascots</h2>
            <div className="space-y-4">
              <FileUpload 
                label="Default Fox" 
                onChange={(e) => handleFileChange(e, setDefaultImage)}
                file={defaultImage}
                required
              />
              <FileUpload 
                label="Ski Fox" 
                onChange={(e) => handleFileChange(e, setSkiImage)}
                file={skiImage}
                required
              />
              <FileUpload 
                label="Beach Fox" 
                onChange={(e) => handleFileChange(e, setBeachImage)}
                file={beachImage}
                required
              />
              <FileUpload 
                label="Map Fox" 
                onChange={(e) => handleFileChange(e, setMapImage)}
                file={mapImage}
                required
              />
              <FileUpload 
                label="Family Fox (Optional)" 
                onChange={(e) => handleFileChange(e, setFamilyImage)}
                file={familyImage}
                required={false}
              />

              <Button 
                className="w-full mt-4 bg-gradient-to-r from-violet-500 to-blue-500 flex items-center justify-center gap-2"
                onClick={handleUpload}
                disabled={uploading || !defaultImage || !skiImage || !beachImage || !mapImage}
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-white border-r-white border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} /> Upload Fox Mascots
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface FileUploadProps {
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  file: File | null;
  required?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, onChange, file, required = true }) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {file && (
          <div className="flex items-center text-xs text-green-600">
            <Check size={14} className="mr-1" />
            {file.name}
          </div>
        )}
      </div>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <input 
          type="file" 
          className="hidden" 
          id={`file-${label}`}
          onChange={onChange}
          accept="image/*"
        />
        <label 
          htmlFor={`file-${label}`} 
          className="flex flex-col items-center justify-center cursor-pointer"
        >
          {file ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-sm text-gray-600">Change file</span>
              <Button 
                size="sm" 
                variant="ghost"
                type="button"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onChange({ target: { files: null } } as any);
                }}
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Upload className="mx-auto h-8 w-8 text-gray-400" />
              <span className="mt-2 block text-xs text-gray-600">
                Click to select a {label.toLowerCase()} image
              </span>
            </div>
          )}
        </label>
      </div>
    </div>
  );
};

export default FoxMascotAdmin;
