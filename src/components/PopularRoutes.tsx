
import { ArrowRight, Calendar, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PopularRoutes = () => {
  // In a real app, this would be fetched from an API
  const routes = [
    {
      id: "DEL-JAI",
      from: "Delhi",
      to: "Jaipur",
      duration: "5h 30m",
      distance: "268 km",
      price: "₹450 - ₹1200",
      frequency: "Every 30 mins",
      fromStop: "Central",
      toStop: "Main Bus Stand",
      operators: ["Rajasthan Roadways", "UPSRTC", "IntrCity SmartBus"],
      tag: "Popular"
    },
    {
      id: "MUM-PUN",
      from: "Mumbai",
      to: "Pune",
      duration: "3h 15m",
      distance: "148 km",
      price: "₹350 - ₹900",
      frequency: "Every 15 mins",
      fromStop: "Central",
      toStop: "Main Bus Stand",
      operators: ["MSRTC", "Purple Travels", "Prasanna Purple"],
      tag: "Express"
    },
    {
      id: "BLR-MYS",
      from: "Bangalore",
      to: "Mysore",
      duration: "3h 45m",
      distance: "143 km",
      price: "₹150 - ₹750",
      frequency: "Every 20 mins",
      fromStop: "Central",
      toStop: "Main Bus Stand",
      operators: ["KSRTC", "SRS Travels", "VRL Logistics"],
      tag: "Frequent"
    },
    {
      id: "CHN-PON",
      from: "Chennai",
      to: "Pondicherry",
      duration: "2h 50m",
      distance: "151 km",
      price: "₹200 - ₹650",
      frequency: "Every 45 mins",
      fromStop: "Central",
      toStop: "Main Bus Stand",
      operators: ["TNSTC", "PRTC", "KPN Travels"],
      tag: "Scenic"
    }
  ];
  
  return (
    <section className="py-16 bg-white">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-smartbus-text-dark mb-2">Popular Routes Across India</h2>
            <p className="text-gray-600">Discover frequent bus services on these major routes</p>
          </div>
          <Button variant="link" className="text-smartbus-blue mt-4 md:mt-0">
            View All Routes <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {routes.map((route) => (
            <Card key={route.id} className="hover:shadow-lg transition-all h-full">
              <CardContent className="p-5 flex flex-col h-full">
                {/* Top row with tag and distance */}
                <div className="flex justify-between items-center mb-4">
                  <Badge variant="secondary" className="bg-smartbus-gray">
                    {route.tag}
                  </Badge>
                  <span className="text-sm font-medium text-gray-500">{route.distance}</span>
                </div>
                
                {/* Route information with fixed heights */}
                <div className="flex items-center justify-between mb-6">
                  {/* From location */}
                  <div className="flex flex-col w-2/5 overflow-hidden">
                    <span className="text-lg font-bold truncate">{route.from}</span>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{route.fromStop}</span>
                    </div>
                  </div>
                  
                  {/* Arrow and duration */}
                  <div className="flex flex-col items-center px-2 flex-shrink-0">
                    <ArrowRight className="text-smartbus-blue h-5 w-5 mb-1" />
                    <span className="text-xs text-gray-500">{route.duration}</span>
                  </div>
                  
                  {/* To location */}
                  <div className="flex flex-col items-end w-2/5 overflow-hidden">
                    <span className="text-lg font-bold truncate">{route.to}</span>
                    <div className="flex items-center justify-end text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{route.toStop}</span>
                    </div>
                  </div>
                </div>
                
                {/* Details section with consistent layout */}
                <div className="border-t pt-4 space-y-2 flex-grow">
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Frequency:</span>
                    </div>
                    <span className="font-medium">{route.frequency}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
                      <span>Price Range:</span>
                    </div>
                    <span className="font-medium">{route.price}</span>
                  </div>
                </div>
                
                {/* Button at the bottom */}
                <Button className="w-full mt-4 bg-smartbus-blue hover:bg-smartbus-dark-blue">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularRoutes;
