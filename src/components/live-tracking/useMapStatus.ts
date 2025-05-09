
import { useState } from "react";
import { toast } from "@/components/ui/sonner";

export const useMapStatus = (googleMapsApiKey: string) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Check for API key and report missing dependencies
  if (!googleMapsApiKey) {
    console.error("No Google Maps API key provided");
    setMapError("Missing Google Maps API key");
    toast.error("Missing Google Maps API key. Please add one to your environment variables.");
  }
  
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
