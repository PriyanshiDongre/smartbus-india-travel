
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Coordinates } from "./types";

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastLocationRef = useRef<Coordinates | null>(null);
  const locationUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // GPS functionality to track user location
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    toast.info("Requesting your location...");

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coordinates: Coordinates = [latitude, longitude];
        setUserLocation(coordinates);
        setLocationAccuracy(accuracy);
        lastLocationRef.current = coordinates;
        
        if (accuracy <= 20) {
          toast.success(`Location found with high accuracy (±${Math.round(accuracy)}m)`);
        } else if (accuracy <= 100) {
          toast.success(`Location found with moderate accuracy (±${Math.round(accuracy)}m)`);
        } else {
          toast.warning(`Location found with low accuracy (±${Math.round(accuracy)}m). Try moving to an open area.`);
        }
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
        timeout: 15000,
        maximumAge: 0
      }
    );
    
    // Set up continuous tracking with stabilization
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newCoordinates: Coordinates = [latitude, longitude];
        
        // Implement a filter to reduce jitter
        if (lastLocationRef.current) {
          const [prevLat, prevLng] = lastLocationRef.current;
          const latDiff = Math.abs(latitude - prevLat);
          const lngDiff = Math.abs(longitude - prevLng);
          
          // Only update if position changed significantly (reduces jitter)
          // or accuracy improved significantly
          const significantChange = (latDiff > 0.00001 || lngDiff > 0.00001);
          const currentAccuracy = locationAccuracy || Infinity;
          const accuracyImproved = accuracy < currentAccuracy - 5;
          
          if (!significantChange && !accuracyImproved) {
            return; // Skip this update to reduce constant refreshing
          }
        }
        
        // Debounce updates to prevent rapid UI refreshes
        if (locationUpdateTimeoutRef.current) {
          clearTimeout(locationUpdateTimeoutRef.current);
        }
        
        locationUpdateTimeoutRef.current = setTimeout(() => {
          setUserLocation(newCoordinates);
          setLocationAccuracy(accuracy);
          lastLocationRef.current = newCoordinates;
          
          // Log accuracy for debugging
          console.log(`Location updated: Accuracy ±${accuracy}m`, newCoordinates);
        }, 300); // Wait 300ms before updating state
      },
      (error) => {
        console.error("Tracking error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,  // Accept positions up to 5 seconds old
      }
    );
  };
  
  const stopLocationTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsLocating(false);
      setLocationAccuracy(null);
      toast.info("Location tracking stopped");
    }
    
    if (locationUpdateTimeoutRef.current) {
      clearTimeout(locationUpdateTimeoutRef.current);
      locationUpdateTimeoutRef.current = null;
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      if (locationUpdateTimeoutRef.current) {
        clearTimeout(locationUpdateTimeoutRef.current);
      }
    };
  }, []);
  
  return {
    userLocation,
    locationError,
    isLocating,
    locationAccuracy,
    startLocationTracking,
    stopLocationTracking,
  };
};
