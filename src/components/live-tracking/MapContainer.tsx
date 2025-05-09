
import { useEffect, useRef } from "react";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Loader } from "@googlemaps/js-api-loader";
import { Coordinates, Bus } from "./types";

interface MapContainerProps {
  googleMapsApiKey: string;
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
  googleMapsApiKey,
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
  const map = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const testBusMarkerRef = useRef<google.maps.Marker | null>(null);
  const busMarkersRef = useRef<google.maps.Marker[]>([]);

  // Google Maps initialization
  useEffect(() => {
    console.log("Initializing map with API key:", googleMapsApiKey ? "API key exists" : "API key missing");
    
    if (!googleMapsApiKey) {
      console.error("No Google Maps API key provided");
      return;
    }
    
    if (!mapContainer.current || map.current) return;

    const initializeMap = async () => {
      try {
        // Initialize Google Maps
        const loader = new Loader({
          apiKey: googleMapsApiKey,
          version: "weekly",
          libraries: ["places"]
        });

        await loader.load();
        console.log("Google Maps API loaded successfully");
        
        // Create the map instance
        if (mapContainer.current && !map.current) {
          map.current = new google.maps.Map(mapContainer.current, {
            center: { lat: 12.9716, lng: 77.5946 }, // Bangalore center
            zoom: 11,
            mapTypeControl: true,
            streetViewControl: false,
            fullscreenControl: true,
          });

          // Add event listener for when the map has finished loading
          google.maps.event.addListenerOnce(map.current, 'idle', () => {
            console.log("Map loaded and ready");

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
              
              const infoWindow = new google.maps.InfoWindow({
                content: infoContent
              });
              
              // Add the marker
              const busMarker = new google.maps.Marker({
                position: { lat: bus.coordinates[0], lng: bus.coordinates[1] },
                map: map.current,
                title: bus.id,
                icon: {
                  path: google.maps.SymbolPath.CIRCLE,
                  fillColor: bus.id.includes('KA-01') || bus.id.includes('KA-02') ? '#1E40AF' : '#F59E0B',
                  fillOpacity: 0.8,
                  strokeColor: '#FFFFFF',
                  strokeWeight: 2,
                  scale: 10
                }
              });
              
              // Add click event for info window
              busMarker.addListener('click', () => {
                infoWindow.open(map.current, busMarker);
              });
              
              busMarkersRef.current.push(busMarker);
            });
          });

          // Add error handling for map
          google.maps.event.addListener(map.current, 'error', () => {
            console.error("Map error occurred");
          });
        }
      } catch (error) {
        console.error("Error initializing Google Maps:", error);
      }
    };

    initializeMap();

    return () => {
      // Clean up markers and map on unmount
      if (busMarkersRef.current.length) {
        busMarkersRef.current.forEach(marker => marker.setMap(null));
        busMarkersRef.current = [];
      }
      
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
        userMarkerRef.current = null;
      }
      
      if (testBusMarkerRef.current) {
        testBusMarkerRef.current.setMap(null);
        testBusMarkerRef.current = null;
      }
      
      map.current = null;
    };
  }, [googleMapsApiKey, buses]);

  // Update user marker when location changes
  useEffect(() => {
    if (!map.current || !userLocation) return;

    // Update or create user marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setPosition({ lat: userLocation[0], lng: userLocation[1] });
    } else {
      userMarkerRef.current = new google.maps.Marker({
        position: { lat: userLocation[0], lng: userLocation[1] },
        map: map.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: "#1E88E5",
          fillOpacity: 1,
          strokeColor: "#FFFFFF",
          strokeWeight: 2,
          scale: 8
        },
        title: "Your Location"
      });
    }
    
    // If test bus is enabled, update its position too
    if (isTestBusEnabled) {
      if (testBusMarkerRef.current) {
        testBusMarkerRef.current.setPosition({ lat: userLocation[0], lng: userLocation[1] });
      } else {
        testBusMarkerRef.current = new google.maps.Marker({
          position: { lat: userLocation[0], lng: userLocation[1] },
          map: map.current,
          icon: {
            path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            fillColor: '#FF5722',
            fillOpacity: 0.8,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
            scale: 7,
            rotation: 0
          },
          title: "Test Bus (Your Phone)"
        });
        
        // Create info window for test bus
        const infoContent = `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">TEST-BUS-123</h3>
            <p style="margin-bottom: 4px;">Test Route - Phone GPS Tracking</p>
            <p style="margin-bottom: 4px;">Next stop: Wherever you go</p>
            <p>ETA: Real-time</p>
          </div>
        `;
        
        const infoWindow = new google.maps.InfoWindow({
          content: infoContent
        });
        
        // Show info window initially then close after a few seconds
        infoWindow.open(map.current, testBusMarkerRef.current);
        setTimeout(() => infoWindow.close(), 5000);
        
        // Add click event to show info window again
        testBusMarkerRef.current.addListener('click', () => {
          infoWindow.open(map.current, testBusMarkerRef.current);
        });
      }
    } else if (!isTestBusEnabled && testBusMarkerRef.current) {
      testBusMarkerRef.current.setMap(null);
      testBusMarkerRef.current = null;
    }
  }, [userLocation, isTestBusEnabled]);

  // Center map on location
  const centerOnLocation = () => {
    if (map.current && userLocation) {
      map.current.panTo({ lat: userLocation[0], lng: userLocation[1] });
      map.current.setZoom(15);
    }
  };

  // Track specific bus
  const trackBus = (coordinates: Coordinates) => {
    if (mapLoaded && map.current) {
      map.current.panTo({ lat: coordinates[0], lng: coordinates[1] });
      map.current.setZoom(14);
    }
  };

  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
      
      {!googleMapsApiKey && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="font-bold text-red-800">Missing API Key</h3>
          <p className="text-red-700">Please add a Google Maps API key to your environment variables to enable the map functionality.</p>
        </div>
      )}
      
      {mapError && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md">
          <h3 className="font-bold text-red-800">Map Error</h3>
          <p className="text-red-700">{mapError}</p>
          <p className="mt-2 text-sm text-red-600">Check browser console for more details.</p>
        </div>
      )}
      
      {!mapLoaded && !mapError && (
        <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
          <h3 className="font-bold text-yellow-800">Loading Map...</h3>
          <p className="mb-2 text-yellow-700">Please wait while we set up the tracking map.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-smartbus-blue"></div>
          </div>
        </div>
      )}
      
      <div className="map-container h-[400px] relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-muted">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }}></div>
        
        {!mapLoaded && !mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl">
              <h3 className="font-bold text-xl mb-2">Loading Map</h3>
              <p>Please wait while we initialize the tracking system...</p>
            </div>
          </div>
        )}
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
        
        {mapLoaded && (
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
