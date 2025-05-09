
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

  // Update user marker when location changes
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    console.log("Updating user location on map:", userLocation, "Accuracy:", locationAccuracy);
    
    // Create a custom blue icon for user location with pulsing effect
    const userLocationIcon = createUserLocationIcon();

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
    } else {
      userMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
        icon: userLocationIcon,
        title: "Your Location"
      }).addTo(mapRef.current);
      
      userMarkerRef.current.bindPopup("Your current location").openPopup();
      
      // Close popup after 3 seconds
      setTimeout(() => {
        userMarkerRef.current?.closePopup();
      }, 3000);
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
    
    // If test bus is enabled, update its position too
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
        
        testBusMarkerRef.current.bindPopup(infoContent).openPopup();
        
        // Close popup after a few seconds
        setTimeout(() => {
          testBusMarkerRef.current?.closePopup();
        }, 5000);
      }
    } else if (!isTestBusEnabled && testBusMarkerRef.current && mapRef.current) {
      mapRef.current.removeLayer(testBusMarkerRef.current);
      testBusMarkerRef.current = null;
    }
    
    // Center map if this is the first location update
    if (userLocation && mapRef.current && !mapRef.current.getBounds().contains([userLocation[0], userLocation[1]])) {
      centerOnLocation();
    }
  }, [userLocation, isTestBusEnabled, locationAccuracy, mapRef]);

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
