
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Coordinates } from "./types";

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const watchIdRef = useRef<number | null>(null);

  // GPS functionality to track user location
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates: Coordinates = [latitude, longitude];
        setUserLocation(coordinates);
        toast.success("Your location has been found!");
      },
      (error) => {
        let errorMsg = "Failed to get your location";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = "You denied the request for Geolocation";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = "Location information is unavailable";
            break;
          case error.TIMEOUT:
            errorMsg = "The request to get your location timed out";
            break;
        }
        
        setLocationError(errorMsg);
        setIsLocating(false);
        toast.error(errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
    
    // Set up continuous tracking
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coordinates: Coordinates = [latitude, longitude];
        setUserLocation(coordinates);
      },
      (error) => {
        console.error("Tracking error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };
  
  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsLocating(false);
      toast.info("Location tracking stopped");
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);
  
  return {
    userLocation,
    locationError,
    isLocating,
    startLocationTracking,
    stopLocationTracking,
  };
};
