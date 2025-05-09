
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
  isTestBusEnabled,
  mapLoaded,
  mapError,
  startLocationTracking,
  stopLocationTracking,
}: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const testBusMarkerRef = useRef<L.Marker | null>(null);
  const busMarkersRef = useRef<L.Marker[]>([]);

  // Leaflet map initialization
  useEffect(() => {
    console.log("Initializing Leaflet map");
    
    if (!mapContainer.current || map.current) return;

    try {
      // Create the map instance
      map.current = L.map(mapContainer.current).setView([12.9716, 77.5946], 11); // Bangalore center
      
      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);
      
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

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
    } else {
      // Create a custom blue icon for user location
      const blueIcon = L.divIcon({
        className: 'blue-user-marker',
        html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      });
      
      userMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
        icon: blueIcon,
        title: "Your Location"
      }).addTo(map.current);
    }
    
    // If test bus is enabled, update its position too
    if (isTestBusEnabled) {
      if (testBusMarkerRef.current) {
        testBusMarkerRef.current.setLatLng([userLocation[0], userLocation[1]]);
      } else {
        // Create a custom orange icon for test bus
        const orangeIcon = L.divIcon({
          className: 'orange-test-bus',
          html: '<div class="w-5 h-5 bg-orange-500 rotate-45 transform origin-center border-2 border-white"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
        
        testBusMarkerRef.current = L.marker([userLocation[0], userLocation[1]], {
          icon: orangeIcon,
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
  }, [userLocation, isTestBusEnabled]);

  // Center map on location
  const centerOnLocation = () => {
    if (map.current && userLocation) {
      map.current.setView([userLocation[0], userLocation[1]], 15);
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
      </div>
      
      <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
        <h3 className="font-bold text-amber-800">How to test tracking:</h3>
        <ol className="list-decimal pl-5 text-amber-700">
          <li>Click "Track My Location" to allow GPS access</li>
          <li>Once your location appears, click "Track Test Bus" at the bottom of the list</li>
          <li>The map will show a test bus that follows your phone's movement</li>
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
