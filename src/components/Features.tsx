
import { BusFront, MapPin, Navigation, Route, Clock, Users } from "lucide-react";

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
    <section className="py-16 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-4 text-smartbus-text-dark bg-gradient-to-r from-smartbus-blue to-smartbus-light-blue bg-clip-text text-transparent">
          Smart Features for Smarter Travel
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          SmartBus brings you innovative features designed to make your bus travel across India convenient, predictable, and stress-free.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group feature-card"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-smartbus-text-dark group-hover:text-smartbus-blue transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
