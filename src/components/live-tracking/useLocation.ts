
import { useState, useRef, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { Coordinates } from "./types";

export const useLocation = () => {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const lastPositionRef = useRef<Coordinates | null>(null);
  const lastUpdateTimeRef = useRef<number>(0);

  // GPS functionality to track user location with improved filtering
  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);
    toast.info("Requesting your location...");

    // Get initial position with improved timeout and accuracy settings
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const coordinates: Coordinates = [latitude, longitude];
        setUserLocation(coordinates);
        lastPositionRef.current = coordinates;
        setLocationAccuracy(accuracy);
        lastUpdateTimeRef.current = Date.now();
        
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
    
    // Set up continuous tracking with improved settings and position filtering
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const newCoordinates: Coordinates = [latitude, longitude];
        const now = Date.now();
        
        // Filter out small movements and implement time-based throttling
        if (lastPositionRef.current) {
          const [lastLat, lastLng] = lastPositionRef.current;
          const distanceChange = calculateDistance(lastLat, lastLng, latitude, longitude);
          const timeSinceLastUpdate = now - lastUpdateTimeRef.current;
          
          // Only update if:
          // 1. Position changed significantly (more than 5 meters) or
          // 2. Accuracy improved significantly or
          // 3. It's been at least 3 seconds since last update (to prevent total freezing)
          if (distanceChange > 5 || 
              (locationAccuracy && accuracy < locationAccuracy * 0.7) ||
              timeSinceLastUpdate > 3000) {
            
            setUserLocation(newCoordinates);
            lastPositionRef.current = newCoordinates;
            setLocationAccuracy(accuracy);
            lastUpdateTimeRef.current = now;
            
            console.log(`Location update: Accuracy ±${accuracy}m, Distance moved: ${distanceChange.toFixed(2)}m, Time since last: ${(timeSinceLastUpdate/1000).toFixed(1)}s`);
          } else {
            console.log(`Filtered location update: Accuracy ±${accuracy}m, Distance: ${distanceChange.toFixed(2)}m, Time: ${(timeSinceLastUpdate/1000).toFixed(1)}s`);
          }
        } else {
          setUserLocation(newCoordinates);
          lastPositionRef.current = newCoordinates;
          setLocationAccuracy(accuracy);
          lastUpdateTimeRef.current = now;
        }
      },
      (error) => {
        console.error("Tracking error:", error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 6000,  // Accept positions up to 6 seconds old to reduce updates
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
  
  // Helper function to calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    return R * c; // Distance in meters
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
    locationAccuracy,
    startLocationTracking,
    stopLocationTracking,
  };
};
