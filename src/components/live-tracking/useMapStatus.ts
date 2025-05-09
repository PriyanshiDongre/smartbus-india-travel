
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";

export const useMapStatus = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Check for any map issues on mount
  useEffect(() => {
    // Clear any previous errors
    setMapError(null);
    
    // No API key needed for Leaflet + OpenStreetMap
    // Just check if Leaflet is available
    if (typeof window !== 'undefined' && !window.L) {
      setMapError("Leaflet library not loaded properly");
    }
  }, []);
  
  const setMapLoadSuccess = () => {
    setMapLoaded(true);
    toast.success("Map loaded successfully!");
  };
  
  const setMapLoadError = (error: string) => {
    setMapError(`Failed to load map: ${error}`);
    toast.error("Failed to load map. Please try refreshing the page.");
  };
  
  return {
    mapLoaded, 
    mapError,
    setMapLoadSuccess,
    setMapLoadError,
  };
};
