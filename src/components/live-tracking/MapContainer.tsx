
import { useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Coordinates, Bus } from "./types";
import L from 'leaflet';

// Fix for default marker icons in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix the default icon issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapContainerProps {
  buses: Bus[];
  userLocation: Coordinates | null;
  isLocating: boolean;
  locationError: string | null;
  locationAccuracy?: number | null;
  isTestBusEnabled: boolean;
  mapLoaded: boolean;
  mapError: string | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
}

export const MapContainer = ({
  buses,
  userLocation,
  isLocating,
  locationError,
  locationAccuracy = null,
  isTestBusEnabled,
  mapLoaded,
  mapError,
  startLocationTracking,
  stopLocationTracking,
}: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const testBusMarkerRef = useRef<L.Marker | null>(null);
  const busMarkersRef = useRef<L.Marker[]>([]);

  // Leaflet map initialization
  useEffect(() => {
    console.log("Initializing Leaflet map");
    
    if (!mapContainer.current || map.current) return;

    try {
      // Create the map instance
      map.current = L.map(mapContainer.current, {
        zoomControl: false,  // We'll add it in a better position
        attributionControl: true,
        minZoom: 5,
        maxZoom: 19
      }).setView([12.9716, 77.5946], 11); // Bangalore center
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
      // Add zoom control in a better position
      L.control.zoom({ position: 'bottomright' }).addTo(map.current);
      
      console.log("Leaflet map initialized successfully");

      // Add bus markers
      buses.forEach((bus) => {
        if (!map.current || bus.isTest) return; // Skip test bus here
        
        const infoContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${bus.id}</h3>
            <p style="margin-bottom: 4px;">${bus.route}</p>
            <p style="margin-bottom: 4px;">Next stop: ${bus.nextStop}</p>
            <p>ETA: ${bus.eta}</p>
          </div>
        `;
        
        // Add the marker
        const busMarker = L.marker([bus.coordinates[0], bus.coordinates[1]], {
          title: bus.id
        }).addTo(map.current);
        
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
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [buses]);

  // Update user marker when location changes
  useEffect(() => {
    if (!map.current || !userLocation) return;

    console.log("Updating user location on map:", userLocation, "Accuracy:", locationAccuracy);
    
    // Create a custom blue icon for user location with pulsing effect
    const userLocationIcon = L.divIcon({
      className: 'user-location-marker',
      html: `
        <div class="relative">
          <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-25 animate-ping"></div>
          <div class="absolute w-4 h-4 bg-blue-600 rounded-full left-1 top-1 border-2 border-white"></div>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
    } else {
      userMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
        icon: userLocationIcon,
        title: "Your Location"
      }).addTo(map.current);
      
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
        }).addTo(map.current);
      }
    }
    
    // If test bus is enabled, update its position too
    if (isTestBusEnabled) {
      // Create a custom bus icon
      const busIcon = L.divIcon({
        className: 'test-bus-icon',
        html: `
          <div class="bg-orange-500 p-1 rounded shadow-md transform rotate-45">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M8 5H16A5 5 0 0121 10V19H3V10A5 5 0 018 5Z"></path>
              <path d="M19 10H5"></path>
              <path d="M5 14H19"></path>
              <path d="M7 19V21"></path>
              <path d="M17 19V21"></path>
            </svg>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });
      
      if (testBusMarkerRef.current) {
        testBusMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
      } else {
        testBusMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
          icon: busIcon,
          title: "Test Bus (Your Phone)"
        }).addTo(map.current);
        
        // Create popup for test bus
        const infoContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">TEST-BUS-123</h3>
            <p style="margin-bottom: 4px;">Test Route - Phone GPS Tracking</p>
            <p style="margin-bottom: 4px;">Next stop: Wherever you go</p>
            <p>ETA: Real-time</p>
          </div>
        `;
        
        testBusMarkerRef.current.bindPopup(infoContent).openPopup();
        
        // Close popup after a few seconds
        setTimeout(() => {
          testBusMarkerRef.current?.closePopup();
        }, 5000);
      }
    } else if (!isTestBusEnabled && testBusMarkerRef.current && map.current) {
      map.current.removeLayer(testBusMarkerRef.current);
      testBusMarkerRef.current = null;
    }
    
    // Center map if this is the first location update
    if (userLocation && !map.current.getBounds().contains([userLocation[0], userLocation[1]])) {
      centerOnLocation();
    }
  }, [userLocation, isTestBusEnabled, locationAccuracy]);

  // Center map on location
  const centerOnLocation = () => {
    if (map.current && userLocation) {
      map.current.setView([userLocation[0], userLocation[1]], 15, {
        animate: true,
        duration: 1 // 1 second animation
      });
    }
  };

  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
      
      {mapError && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="font-bold text-red-800">Map Error</h3>
          <p className="text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-600">Check browser console for more details.</p>
        </div>
      )}
      
      <div className="map-container h-[400px] relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-muted">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }}></div>
        
        {userLocation && locationAccuracy && (
          <div className="absolute top-2 left-2 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs z-[1000] max-w-[200px]">
            <div className="font-semibold">Location Accuracy</div>
            <div className={`
              ${locationAccuracy <= 20 ? 'text-green-600' : 
                locationAccuracy <= 100 ? 'text-amber-600' : 'text-red-600'}
            `}>
              ±{Math.round(locationAccuracy)}m {locationAccuracy <= 20 ? '(High)' : 
                locationAccuracy <= 100 ? '(Moderate)' : '(Low)'}
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
        <h3 className="font-bold text-amber-800">How to improve location accuracy:</h3>
        <ol className="list-decimal pl-5 text-amber-700">
          <li>Make sure you're outdoors or near windows</li>
          <li>Enable high-accuracy mode in your device settings</li>
          <li>Wait a few seconds for GPS signal to stabilize</li>
          <li>Try a different browser if issues persist</li>
        </ol>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4 justify-center">
        <Button className="bg-smartbus-blue hover:bg-smartbus-dark-blue">
          Open Full Map
        </Button>
        
        {!mapError && (
          <>
            <Button 
              variant="outline" 
              className={`${isLocating ? 'border-red-500 text-red-500' : 'border-green-600 text-green-600'}`}
              onClick={isLocating ? stopLocationTracking : startLocationTracking}
            >
              {isLocating ? (
                <>
                  <span className="mr-2 animate-ping h-2 w-2 rounded-full bg-red-400 inline-block"></span>
                  Stop Location Tracking
                </>
              ) : (
                <>
                  <Navigation className="h-4 w-4 mr-2" />
                  Track My Location
                </>
              )}
            </Button>
            
            {userLocation && (
              <Button 
                variant="secondary"
                onClick={centerOnLocation}
                disabled={!userLocation}
              >
                <MapPin className="h-4 w-4 mr-2" />
                Center on My Location
              </Button>
            )}
          </>
        )}
      </div>
      
      {locationError && (
        <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded border border-red-200">
          {locationError}
        </div>
      )}
    </div>
  );
};
