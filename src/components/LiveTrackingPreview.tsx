
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const LiveTrackingPreview = () => {
  // In a real app, this would be fetched from an API
  const buses = [
    {
      id: "KA-01-F-5555",
      route: "Bengaluru Central - Electronic City",
      location: "Near Silk Board",
      eta: "10 mins",
      occupancy: 65,
      nextStop: "HSR Layout",
      progress: 65
    },
    {
      id: "KA-05-G-7890",
      route: "Whitefield - Marathahalli",
      location: "Near ITPL",
      eta: "5 mins",
      occupancy: 40,
      nextStop: "Kundalahalli Gate",
      progress: 40
    },
    {
      id: "KA-02-J-1234",
      route: "Hebbal - Majestic",
      location: "Near Mekhri Circle",
      eta: "15 mins",
      occupancy: 85,
      nextStop: "Mantri Square",
      progress: 80
    }
  ];
  
  return (
    <section className="py-12 bg-smartbus-gray">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Preview */}
          <div className="w-full md:w-2/3">
            <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
            <div className="map-container h-[400px] relative bg-gray-100">
              {/* This would be a real map in a complete implementation */}
              <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/77.5946,12.9716,11,0/800x400?access_token=pk.placeholder')] bg-cover bg-center opacity-70"></div>
              
              <div className="absolute top-4 right-4 bg-white p-2 rounded-md shadow-md">
                <Navigation className="h-5 w-5 text-smartbus-blue" />
              </div>
              
              {/* Bus markers */}
              <div className="absolute top-1/2 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-smartbus-blue text-white p-2 rounded-full shadow-lg animate-pulse-subtle">
                  <span className="text-xs font-bold">KA-01</span>
                </div>
              </div>
              
              <div className="absolute top-1/4 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-smartbus-orange text-white p-2 rounded-full shadow-lg animate-pulse-subtle">
                  <span className="text-xs font-bold">KA-05</span>
                </div>
              </div>
              
              <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="bg-smartbus-blue text-white p-2 rounded-full shadow-lg animate-pulse-subtle">
                  <span className="text-xs font-bold">KA-02</span>
                </div>
              </div>
              
              {/* Central marker for demo */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <MapPin className="h-8 w-8 text-red-500" />
                <div className="bg-white px-2 py-1 rounded-md shadow-md text-xs font-medium mt-1">
                  Your Location
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-4">
              <Button className="bg-smartbus-blue hover:bg-smartbus-dark-blue">
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
                    
                    <Button variant="outline" size="sm" className="w-full border-smartbus-blue text-smartbus-blue hover:bg-smartbus-blue hover:text-white">
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
