import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEffect, useRef, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Define the proper type for coordinates to match mapboxgl.LngLatLike
type Coordinates = [number, number]; // Explicitly a tuple with exactly 2 elements

interface Bus {
  id: string;
  route: string;
  location: string;
  eta: string;
  occupancy: number;
  nextStop: string;
  progress: number;
  coordinates: Coordinates; // Updated to use our proper type
}

const LiveTrackingPreview = () => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>("");
  const [mapLoaded, setMapLoaded] = useState(false);

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
      coordinates: [77.623177, 12.935971] // Properly typed as [number, number]
    },
    {
      id: "KA-05-G-7890",
      route: "Whitefield - Marathahalli",
      location: "Near ITPL",
      eta: "5 mins",
      occupancy: 40,
      nextStop: "Kundalahalli Gate",
      progress: 40,
      coordinates: [77.731700, 12.969300] // Properly typed as [number, number]
    },
    {
      id: "KA-02-J-1234",
      route: "Hebbal - Majestic",
      location: "Near Mekhri Circle",
      eta: "15 mins",
      occupancy: 85,
      nextStop: "Mantri Square",
      progress: 80,
      coordinates: [77.583862, 13.015578] // Properly typed as [number, number]
    }
  ];
  
  useEffect(() => {
    if (!mapboxToken) return;
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [77.5946, 12.9716], // Bangalore center
      zoom: 11
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Set up map load event
    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add markers for buses when map loads
      buses.forEach((bus) => {
        if (!map.current) return;
        
        // Create a custom element for the bus marker
        const markerEl = document.createElement('div');
        markerEl.className = `bg-${bus.id.includes('KA-01') || bus.id.includes('KA-02') ? 'smartbus-blue' : 'smartbus-orange'} text-white p-2 rounded-full shadow-lg`;
        markerEl.style.width = '28px';
        markerEl.style.height = '28px';
        markerEl.style.borderRadius = '50%';
        markerEl.style.display = 'flex';
        markerEl.style.alignItems = 'center';
        markerEl.style.justifyContent = 'center';
        markerEl.style.animation = 'pulse 2s infinite';
        markerEl.innerHTML = `<span class="text-xs font-bold">${bus.id.substring(0, 5)}</span>`;
        
        // Add the marker to the map - coordinates now properly typed
        new mapboxgl.Marker(markerEl)
          .setLngLat(bus.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3 class="font-bold">${bus.id}</h3>
             <p>${bus.route}</p>
             <p>Next stop: ${bus.nextStop}</p>
             <p>ETA: ${bus.eta}</p>`
          ))
          .addTo(map.current);
      });
      
      // Add user location marker
      if (map.current) {
        const userMarker = new mapboxgl.Marker({ color: 'red' })
          .setLngLat([77.5946, 12.9716] as Coordinates) // Now properly typed
          .addTo(map.current);
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken]);

  return (
    <section className="py-12 bg-smartbus-gray">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Preview */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
            
            {!mapboxToken && (
              <div className="mb-4 p-4 border border-yellow-300 bg-yellow-50 rounded-md">
                <h3 className="font-bold text-yellow-800">Mapbox Token Required</h3>
                <p className="mb-2 text-yellow-700">To see the interactive map, please enter your Mapbox public token:</p>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-smartbus-blue"
                    value={mapboxToken}
                    onChange={(e) => setMapboxToken(e.target.value)}
                    placeholder="Enter your Mapbox token (pk.ey...)"
                  />
                  <Button 
                    onClick={() => {}}
                    disabled={!mapboxToken}
                    className="bg-smartbus-blue hover:bg-smartbus-dark-blue"
                  >
                    Apply
                  </Button>
                </div>
                <p className="mt-2 text-xs text-gray-600">
                  You can get a token by signing up at <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-smartbus-blue underline">mapbox.com</a>
                </p>
              </div>
            )}
            
            <div className="map-container h-[400px] relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-muted">
              {!mapboxToken && (
                <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,11,0/800x400?access_token=pk.placeholder')] bg-cover bg-center opacity-70"></div>
              )}
              
              <div ref={mapContainer} className="absolute inset-0"></div>
              
              {!mapboxToken && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <div className="bg-white p-6 rounded-lg max-w-md text-center shadow-xl">
                    <h3 className="font-bold text-xl mb-2">Interactive Map Disabled</h3>
                    <p>Enter your Mapbox token above to enable the interactive map and see live bus locations.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center mt-4">
              <Button 
                className="bg-smartbus-blue hover:bg-smartbus-dark-blue"
                disabled={!mapboxToken}
              >
                Open Full Map
              </Button>
            </div>
          </div>
          
          {/* Live Buses List */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Nearby Buses</h2>
            <div className="space-y-4">
              {buses.map((bus) => (
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
                          map.current.flyTo({
                            center: bus.coordinates,
                            zoom: 14,
                            essential: true
                          });
                        }
                      }}
                    >
                      Track This Bus
                    </Button>
                  </CardContent>
                </Card>
              ))}
              
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
