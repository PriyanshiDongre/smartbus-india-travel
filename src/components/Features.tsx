
import { BusFront, MapPin, Navigation, Route, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      icon: <Navigation className="h-8 w-8 text-smartbus-blue" />,
      title: "Live Tracking",
      description: "Track your bus in real-time and know exactly when it will arrive at your stop."
    },
    {
      icon: <Users className="h-8 w-8 text-smartbus-blue" />,
      title: "Occupancy Info",
      description: "Check how crowded the bus is before it arrives to plan your journey better."
    },
    {
      icon: <Route className="h-8 w-8 text-smartbus-blue" />,
      title: "Smart Routes",
      description: "Discover the fastest and most convenient routes to your destination."
    },
    {
      icon: <Clock className="h-8 w-8 text-smartbus-blue" />,
      title: "Accurate Schedules",
      description: "Get precise timetables and ETA for all bus services across India."
    },
    {
      icon: <BusFront className="h-8 w-8 text-smartbus-blue" />,
      title: "All Buses",
      description: "Info on both government and private buses in one convenient app."
    },
    {
      icon: <MapPin className="h-8 w-8 text-smartbus-blue" />,
      title: "Nearby Stops",
      description: "Easily find the closest bus stops to your current location."
    }
  ];
  
  return (
    <section className="py-12 bg-white">
      <div className="container px-4">
        <h2 className="text-2xl font-bold text-center mb-3 text-smartbus-text-dark bg-gradient-to-r from-smartbus-blue to-smartbus-light-blue bg-clip-text text-transparent">
          Smart Features for Smarter Travel
        </h2>
        <p className="text-center text-gray-600 mb-8 max-w-md mx-auto text-sm">
          Everything you need for convenient and stress-free bus travel.
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="border-none shadow-md hover:shadow-lg transition-all duration-300"
            >
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-smartbus-gray rounded-full p-3 mb-3">
                  {feature.icon}
                </div>
                <h3 className="text-base font-bold mb-1 text-smartbus-text-dark">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-xs">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
