
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Loader } from "@googlemaps/js-api-loader";

// Define the proper type for coordinates
type Coordinates = [number, number]; // lat, lng

interface Bus {
  id: string;
  route: string;
  location: string;
  eta: string;
  occupancy: number;
  nextStop: string;
  progress: number;
  coordinates: Coordinates;
  isTest?: boolean;
}

const LiveTrackingPreview = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<google.maps.Map | null>(null);
  // This is a placeholder - replace with a valid API key for actual deployment
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  const [mapLoaded, setMapLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const busMarkersRef = useRef<google.maps.Marker[]>([]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const [isTestBusEnabled, setIsTestBusEnabled] = useState(false);
  const testBusMarkerRef = useRef<google.maps.Marker | null>(null);

  // In a real app, this would be fetched from an API
  const buses: Bus[] = [
    {
      id: "KA-01-F-5555",
      route: "Bengaluru Central - Electronic City",
      location: "Near Silk Board",
      eta: "10 mins",
      occupancy: 65,
      nextStop: "HSR Layout",
      progress: 65,
      coordinates: [12.935971, 77.623177] // lat, lng
    },
    {
      id: "KA-05-G-7890",
      route: "Whitefield - Marathahalli",
      location: "Near ITPL",
      eta: "5 mins",
      occupancy: 40,
      nextStop: "Kundalahalli Gate",
      progress: 40,
      coordinates: [12.969300, 77.731700] // lat, lng
    },
    {
      id: "KA-02-J-1234",
      route: "Hebbal - Majestic",
      location: "Near Mekhri Circle",
      eta: "15 mins",
      occupancy: 85,
      nextStop: "Mantri Square",
      progress: 80,
      coordinates: [13.015578, 77.583862] // lat, lng
    },
    // Test bus that uses user's location
    {
      id: "TEST-BUS-123",
      route: "Test Route - Phone GPS Tracking",
      location: "Your current location",
      eta: "Real-time",
      occupancy: 10,
      nextStop: "Wherever you go",
      progress: 100,
      coordinates: [12.9716, 77.5946], // Default coordinates, will be updated with user location
      isTest: true
    }
  ];

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
        
        if (map.current) {
          map.current.panTo({ lat: latitude, lng: longitude });
          map.current.setZoom(15);
          
          // Update or create user marker
          if (userMarkerRef.current) {
            userMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
          } else if (map.current) {
            userMarkerRef.current = new google.maps.Marker({
              position: { lat: latitude, lng: longitude },
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
          if (isTestBusEnabled && testBusMarkerRef.current) {
            testBusMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
          }
          
          toast.success("Your location has been found!");
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
        
        if (userMarkerRef.current && map.current) {
          userMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
        }
        
        // If test bus is enabled, update its position too
        if (isTestBusEnabled && testBusMarkerRef.current) {
          testBusMarkerRef.current.setPosition({ lat: latitude, lng: longitude });
        }
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

  const enableTestBus = (enable: boolean = true) => {
    setIsTestBusEnabled(enable);
    
    // If enabling test bus and we have user location but no test bus marker yet
    if (enable && userLocation && !testBusMarkerRef.current && map.current) {
      // Create test bus marker at user location
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
          rotation: 0 // Will be updated based on movement
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
      if (testBusMarkerRef.current) {
        infoWindow.open(map.current, testBusMarkerRef.current);
        setTimeout(() => infoWindow.close(), 5000);
        
        // Add click event to show info window again
        testBusMarkerRef.current.addListener('click', () => {
          infoWindow.open(map.current, testBusMarkerRef.current);
        });
      }
      
      if (map.current) {
        map.current.panTo({ lat: userLocation[0], lng: userLocation[1] });
        map.current.setZoom(15);
      }
      
      toast.success("Test Bus is now tracking your phone's location!");
    } 
    // If disabling test bus
    else if (!enable && testBusMarkerRef.current) {
      testBusMarkerRef.current.setMap(null);
      testBusMarkerRef.current = null;
      toast.info("Test Bus tracking disabled");
    }
    // If trying to enable but no location yet
    else if (enable && !userLocation) {
      toast.error("Please enable location tracking first before tracking the Test Bus");
      startLocationTracking();
    }
  };

  useEffect(() => {
    if (!googleMapsApiKey) {
      console.warn("No Google Maps API key provided. The map will not load correctly.");
      toast.error("Missing Google Maps API key. Please add one to your environment variables.");
      return;
    }
    
    if (!mapContainer.current || map.current) return;

    // Initialize Google Maps
    const loader = new Loader({
      apiKey: googleMapsApiKey,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      // Create the map instance
      if (mapContainer.current) {
        map.current = new google.maps.Map(mapContainer.current, {
          center: { lat: 12.9716, lng: 77.5946 }, // Bangalore center
          zoom: 11,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        // Add event listener for when the map has finished loading
        google.maps.event.addListenerOnce(map.current, 'idle', () => {
          setMapLoaded(true);

          // Add bus markers
          buses.forEach((bus) => {
            if (!map.current || bus.isTest) return; // Skip test bus here, we handle it separately
            
            // Create info window content
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
      }
    }).catch(e => {
      console.error("Error loading Google Maps API", e);
      toast.error("Failed to load Google Maps. Please try again later.");
    });

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      
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
  }, [googleMapsApiKey]);

  return (
    <section className="py-12 bg-smartbus-gray">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Preview */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
            
            {!googleMapsApiKey && (
              <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md">
                <h3 className="font-bold text-red-800">Missing API Key</h3>
                <p className="text-red-700">Please add a Google Maps API key to your environment variables to enable the map functionality.</p>
              </div>
            )}
            
            {!mapLoaded && (
              <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                <h3 className="font-bold text-yellow-800">Loading Map...</h3>
                <p className="mb-2 text-yellow-700">Please wait while we set up the tracking map.</p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-smartbus-blue"></div>
                </div>
              </div>
            )}
            
            <div className="map-container h-[400px] relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-muted">
              <div ref={mapContainer} className="absolute inset-0"></div>
              
              {!mapLoaded && (
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
              <Button 
                className="bg-smartbus-blue hover:bg-smartbus-dark-blue"
              >
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
                      onClick={() => {
                        if (map.current && userLocation) {
                          map.current.panTo({ lat: userLocation[0], lng: userLocation[1] });
                          map.current.setZoom(15);
                        }
                      }}
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
          
          {/* Live Buses List */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Nearby Buses</h2>
            <div className="space-y-4">
              {buses.filter(bus => !bus.isTest).map((bus) => (
                <Card key={bus.id} className="bus-card hover:border-smartbus-blue">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <span className="live-dot"></span>
                        <span className="font-semibold text-sm">{bus.id}</span>
                      </div>
                      <span className="text-xs bg-smartbus-gray px-2 py-1 rounded-full">
                        ETA: {bus.eta}
                      </span>
                    </div>
                    
                    <h3 className="font-bold text-smartbus-text-dark mb-2">{bus.route}</h3>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <MapPin className="inline-block h-4 w-4 mr-1" />
                      {bus.location}
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Next stop: {bus.nextStop}</span>
                        <span>Occupancy: {bus.occupancy}%</span>
                      </div>
                      <Progress value={bus.progress} className="h-1.5" />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-smartbus-blue text-smartbus-blue hover:bg-smartbus-blue hover:text-white"
                      onClick={() => {
                        if (mapLoaded && map.current) {
                          map.current.panTo({ lat: bus.coordinates[0], lng: bus.coordinates[1] });
                          map.current.setZoom(14);
                          
                          toast.success(`Now tracking ${bus.id} on ${bus.route}`);
                        }
                      }}
                    >
                      Track This Bus
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
              {/* Special Test Bus card that follows user location */}
              <Card className={`bus-card ${isTestBusEnabled ? 'border-orange-500 ring-2 ring-orange-200' : 'hover:border-orange-500'}`}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      {isTestBusEnabled && (
                        <span className="animate-ping absolute h-2 w-2 rounded-full bg-orange-400 inline-block mr-1"></span>
                      )}
                      <span className="font-semibold text-sm text-orange-600">TEST-BUS-123</span>
                    </div>
                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                      DEMO
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-smartbus-text-dark mb-2">Test Route - Phone GPS Tracking</h3>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    {userLocation ? "Your current location" : "Enable location tracking first"}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Next stop: Wherever you go</span>
                      <span>Occupancy: 10%</span>
                    </div>
                    <Progress value={isTestBusEnabled ? 100 : 0} className="h-1.5 bg-orange-100">
                      <div className={`h-full bg-orange-500 ${isTestBusEnabled ? 'animate-pulse' : ''}`}></div>
                    </Progress>
                  </div>
                  
                  <Button 
                    variant={isTestBusEnabled ? "default" : "outline"}
                    size="sm" 
                    className={`w-full ${
                      isTestBusEnabled 
                        ? "bg-orange-500 hover:bg-orange-600 text-white" 
                        : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    }`}
                    onClick={() => enableTestBus(!isTestBusEnabled)}
                    disabled={!mapLoaded}
                  >
                    {isTestBusEnabled ? "Stop Test Bus Tracking" : "Track Test Bus (Your Phone)"}
                  </Button>
                </CardContent>
              </Card>
              
              <Button variant="link" className="w-full text-smartbus-blue">
                View All Nearby Buses
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveTrackingPreview;
