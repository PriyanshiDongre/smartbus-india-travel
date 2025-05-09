
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export const useMapStatus = (googleMapsApiKey: string) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Check for API key on mount
  useEffect(() => {
    // Clear any previous errors
    setMapError(null);
    
    // Check if API key is available
    if (!googleMapsApiKey || googleMapsApiKey.trim() === '') {
      const error = "Missing Google Maps API key";
      setMapError(error);
      toast.error("Missing Google Maps API key. Please add one to your environment variables.");
      console.error(error);
    }
  }, [googleMapsApiKey]);
  
  const setMapLoadSuccess = () => {
    setMapLoaded(true);
    toast.success("Map loaded successfully!");
  };
  
  const setMapLoadError = (error: string) => {
    setMapError(`Failed to load map: ${error}`);
    toast.error("Failed to load Google Maps. Please check your API key and try again.");
  };
  
  return {
    mapLoaded, 
    mapError,
    setMapLoadSuccess,
    setMapLoadError,
  };
};
