
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { toast } from "@/components/ui/sonner";
import { Bus, Coordinates } from "../types";
import { 
  createUserLocationIcon, 
  createBusIcon, 
  createBusPopupContent, 
  createTestBusPopupContent,
  createCenterPointMarker,
  createAccuracyCircle
} from '../utils/leaflet-setup';

export const useMapMarkers = (
  mapRef: React.MutableRefObject<L.Map | null>,
  mapContainerRef: React.MutableRefObject<HTMLDivElement | null>,
  buses: Bus[],
  userLocation: Coordinates | null,
  isTestBusEnabled: boolean,
  locationAccuracy: number | null
) => {
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const testBusMarkerRef = useRef<L.Marker | null>(null);
  const busMarkersRef = useRef<L.Marker[]>([]);
  const centerPointRef = useRef<L.CircleMarker | null>(null);
  const isFirstLocationUpdate = useRef<boolean>(true);
  const userLocationRef = useRef<Coordinates | null>(null);
  const updateTimeoutRef = useRef<number | null>(null);

  // Initialize the map
  useEffect(() => {
    console.log("Initializing Leaflet map");
    
    if (!mapContainerRef.current || mapRef.current) return;

    try {
      // Create the map instance
      mapRef.current = L.map(mapContainerRef.current, {
        zoomControl: false,  // We'll add it in a better position
        attributionControl: true,
        minZoom: 5,
        maxZoom: 19
      }).setView([12.9716, 77.5946], 11); // Bangalore center
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapRef.current);
      
      // Add zoom control in a better position
      L.control.zoom({ position: 'bottomright' }).addTo(mapRef.current);
      
      console.log("Leaflet map initialized successfully");

      // Add bus markers
      buses.forEach((bus) => {
        if (!mapRef.current || bus.isTest) return; // Skip test bus here
        
        const infoContent = createBusPopupContent(bus);
        
        // Add the marker
        const busMarker = L.marker([bus.coordinates[0], bus.coordinates[1]], {
          title: bus.id
        }).addTo(mapRef.current);
        
        // Add popup for info window
        busMarker.bindPopup(infoContent);
        busMarkersRef.current.push(busMarker);
      });
      
      // Signal that map loaded successfully
      toast.success("Map loaded successfully!");
    } catch (error) {
      console.error("Error initializing Leaflet map:", error);
      toast.error("Failed to initialize map");
    }

    return () => {
      // Clean up on unmount
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [buses, mapContainerRef]);

  // Debounced update function to prevent too frequent updates
  const debouncedUpdateUserLocation = (location: Coordinates) => {
    // Store the latest location for reference
    userLocationRef.current = location;
    
    // Clear any pending updates
    if (updateTimeoutRef.current !== null) {
      window.clearTimeout(updateTimeoutRef.current);
    }
    
    // Set a new timeout for the update
    updateTimeoutRef.current = window.setTimeout(() => {
      // Only update if this is still the latest location
      if (userLocationRef.current === location && mapRef.current) {
        updateUserLocationMarkers(location);
      }
    }, 100); // Small delay to batch updates
  };
  
  // Function to update all user location related markers
  const updateUserLocationMarkers = (location: Coordinates) => {
    if (!mapRef.current) return;
    
    const latLng = [location[0], location[1]] as L.LatLngTuple;
    
    // Update user marker with improved icon
    const userLocationIcon = createUserLocationIcon();
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(latLng);
    } else {
      userMarkerRef.current = L.marker(latLng, {
        icon: userLocationIcon,
        title: "Your Location",
        zIndexOffset: 1000 // Ensure user marker is on top
      }).addTo(mapRef.current);
      
      userMarkerRef.current.bindPopup("Your current location");
      
      if (isFirstLocationUpdate.current) {
        userMarkerRef.current.openPopup();
        // Close popup after 3 seconds
        setTimeout(() => {
          userMarkerRef.current?.closePopup();
        }, 3000);
        isFirstLocationUpdate.current = false;
      }
    }

    // Add or update center point marker for precise location pinpointing
    if (centerPointRef.current) {
      centerPointRef.current.setLatLng(latLng);
    } else {
      centerPointRef.current = createCenterPointMarker(latLng).addTo(mapRef.current);
    }
    
    // Update accuracy circle if accuracy data is available
    if (locationAccuracy) {
      if (accuracyCircleRef.current) {
        accuracyCircleRef.current.setLatLng(latLng);
        accuracyCircleRef.current.setRadius(locationAccuracy);
      } else {
        accuracyCircleRef.current = createAccuracyCircle(latLng, locationAccuracy).addTo(mapRef.current);
      }
    } else if (accuracyCircleRef.current && !locationAccuracy) {
      // Remove accuracy circle if no accuracy data
      mapRef.current.removeLayer(accuracyCircleRef.current);
      accuracyCircleRef.current = null;
    }
    
    // Update test bus if enabled
    if (isTestBusEnabled) {
      updateTestBusLocation(latLng);
    } else if (!isTestBusEnabled && testBusMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(testBusMarkerRef.current);
      testBusMarkerRef.current = null;
    }
    
    // Center map on first location update
    if (isFirstLocationUpdate.current && mapRef.current && location) {
      centerOnLocation();
      isFirstLocationUpdate.current = false;
    }
  };
  
  // Update test bus location
  const updateTestBusLocation = (latLng: L.LatLngTuple) => {
    if (!mapRef.current) return;
    
    // Create a custom bus icon
    const busIcon = createBusIcon();
    
    if (testBusMarkerRef.current) {
      testBusMarkerRef.current.setLatLng(latLng);
    } else {
      testBusMarkerRef.current = L.marker(latLng, {
        icon: busIcon,
        title: "Test Bus (Your Phone)"
      }).addTo(mapRef.current);
      
      // Create popup for test bus
      const infoContent = createTestBusPopupContent();
      
      testBusMarkerRef.current.bindPopup(infoContent).openPopup();
      
      // Close popup after a few seconds
      setTimeout(() => {
        testBusMarkerRef.current?.closePopup();
      }, 5000);
    }
  };

  // Update user marker when location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    
    // Use the debounced update function
    debouncedUpdateUserLocation(userLocation);
  }, [userLocation, isTestBusEnabled, locationAccuracy]);

  // Clean up markers when component unmounts
  useEffect(() => {
    return () => {
      // Clear any pending timeout
      if (updateTimeoutRef.current !== null) {
        window.clearTimeout(updateTimeoutRef.current);
      }
      
      // Clean up markers
      if (mapRef.current) {
        if (centerPointRef.current) {
          mapRef.current.removeLayer(centerPointRef.current);
        }
        if (accuracyCircleRef.current) {
          mapRef.current.removeLayer(accuracyCircleRef.current);
        }
        if (userMarkerRef.current) {
          mapRef.current.removeLayer(userMarkerRef.current);
        }
        if (testBusMarkerRef.current) {
          mapRef.current.removeLayer(testBusMarkerRef.current);
        }
      }
    };
  }, [mapRef]);

  // Center map on location
  const centerOnLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation[0], userLocation[1]], 15, {
        animate: true,
        duration: 1 // 1 second animation
      });
    }
  };

  return { centerOnLocation };
};
