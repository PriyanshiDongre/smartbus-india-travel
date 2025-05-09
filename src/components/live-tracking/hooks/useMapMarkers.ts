
import { useRef, useEffect } from 'react';
import L from 'leaflet';
import { toast } from "@/components/ui/sonner";
import { Bus, Coordinates } from "../types";
import { createUserLocationIcon, createBusIcon, createBusPopupContent, createTestBusPopupContent } from '../utils/leaflet-setup';

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
  const lastLocationRef = useRef<Coordinates | null>(null);
  const locationUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Update user marker when location changes - with stabilization logic
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;
    
    // Calculate distance if we have a previous location
    let shouldUpdate = true;
    if (lastLocationRef.current) {
      const [prevLat, prevLng] = lastLocationRef.current;
      const [newLat, newLng] = userLocation;
      
      // Calculate distance (in meters) between previous and new location
      const distance = mapRef.current.distance(
        [prevLat, prevLng],
        [newLat, newLng]
      );
      
      // Only update if the distance is significant (more than 2 meters)
      // or if it's been a while since our last update
      shouldUpdate = distance > 2;
    }
    
    if (!shouldUpdate) {
      return; // Skip update if location hasn't changed enough
    }
    
    // Store current location for next comparison
    lastLocationRef.current = userLocation;
    
    // Debounce location updates to prevent rapid refreshes
    if (locationUpdateTimeoutRef.current) {
      clearTimeout(locationUpdateTimeoutRef.current);
    }
    
    locationUpdateTimeoutRef.current = setTimeout(() => {
      console.log("Updating user location on map:", userLocation, "Accuracy:", locationAccuracy);
      
      // Create a custom blue icon for user location with pulsing effect
      const userLocationIcon = createUserLocationIcon();

      // Update or create user marker
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
      } else {
        userMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
          icon: userLocationIcon,
          title: "Your Location",
          zIndexOffset: 1000 // Ensure user marker is on top
        }).addTo(mapRef.current);
        
        userMarkerRef.current.bindPopup("Your current location");
      }
      
      // Show accuracy circle if we have accuracy data
      if (locationAccuracy) {
        if (accuracyCircleRef.current) {
          accuracyCircleRef.current.setLatLng([userLocation[0], userLocation[1]]);
          accuracyCircleRef.current.setRadius(locationAccuracy);
        } else {
          accuracyCircleRef.current = L.circle([userLocation[0], userLocation[1]], {
            radius: locationAccuracy,
            color: '#3b82f6',
            fillColor: '#60a5fa',
            fillOpacity: 0.15,
            weight: 1
          }).addTo(mapRef.current);
        }
      }
      
      // If test bus is enabled, update its position too with same debounce
      if (isTestBusEnabled) {
        // Create a custom bus icon
        const busIcon = createBusIcon();
        
        if (testBusMarkerRef.current) {
          testBusMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
        } else {
          testBusMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
            icon: busIcon,
            title: "Test Bus (Your Phone)"
          }).addTo(mapRef.current);
          
          // Create popup for test bus
          const infoContent = createTestBusPopupContent();
          testBusMarkerRef.current.bindPopup(infoContent);
        }
      } else if (!isTestBusEnabled && testBusMarkerRef.current && mapRef.current) {
        mapRef.current.removeLayer(testBusMarkerRef.current);
        testBusMarkerRef.current = null;
      }
    }, 150); // Wait for 150ms before updating markers to avoid constant refreshing
    
    // Center map on first location detection
    if (userLocation && mapRef.current && !mapRef.current.getBounds().contains([userLocation[0], userLocation[1]])) {
      mapRef.current.setView([userLocation[0], userLocation[1]], 15, {
        animate: true,
        duration: 1 // 1 second animation
      });
    }
    
    return () => {
      if (locationUpdateTimeoutRef.current) {
        clearTimeout(locationUpdateTimeoutRef.current);
      }
    };
  }, [userLocation, isTestBusEnabled, locationAccuracy, mapRef]);

  // Center map on location with smooth animation
  const centerOnLocation = () => {
    if (mapRef.current && userLocation) {
      mapRef.current.setView([userLocation[0], userLocation[1]], 15, {
        animate: true,
        duration: 0.8, // Slightly faster animation
        easeLinearity: 0.5 // More linear animation (less bounce)
      });
    }
  };

  return { centerOnLocation };
};
