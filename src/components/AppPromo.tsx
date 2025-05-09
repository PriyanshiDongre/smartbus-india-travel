
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, ArrowDown, Smartphone } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const AppPromo = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    
    setIsLocating(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        toast.success("Your location has been found!");
        
        // Log for debugging
        console.log("User location:", latitude, longitude);
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
        console.error("Geolocation error:", errorMsg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };
  
  // Optional: Try to get location when component mounts
  useEffect(() => {
    // Uncomment the line below if you want to automatically request location
    // getLocation();
  }, []);
  
  return (
    <section className="py-16 bg-gradient-to-br from-smartbus-blue/10 to-smartbus-blue/5">
      <div className="container px-4">
        <div className="flex flex-col items-center text-center mb-8">
          <h2 className="text-3xl font-bold text-smartbus-text-dark mb-4">
            Download the SmartBus App
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Track buses in real-time, book tickets, and get alerts about your journey right on your phone.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          <div className="flex flex-col gap-6">
            <Card className="border border-smartbus-blue/20 shadow-md overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-xl mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5 text-smartbus-blue" />
                  Use Your Location
                </h3>
                
                <p className="mb-6 text-muted-foreground">
                  Allow location access to find buses near you and get real-time updates.
                </p>
                
                {userLocation ? (
                  <div className="bg-muted p-4 rounded-lg mb-4">
                    <p className="font-medium">Your current coordinates:</p>
                    <p className="font-mono text-sm">
                      Latitude: {userLocation.lat.toFixed(6)}<br />
                      Longitude: {userLocation.lng.toFixed(6)}
                    </p>
                  </div>
                ) : (
                  <Button 
                    onClick={getLocation} 
                    className="w-full bg-smartbus-blue hover:bg-smartbus-dark-blue"
                    disabled={isLocating}
                  >
                    {isLocating ? (
                      <>
                        <div className="mr-2 h-4 w-4 rounded-full border-2 border-t-transparent border-white animate-spin"></div>
                        Locating...
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-2 h-4 w-4" />
                        Get My Location
                      </>
                    )}
                  </Button>
                )}
                
                {locationError && (
                  <div className="mt-3 p-2 bg-destructive/10 text-destructive text-sm rounded border border-destructive/20">
                    {locationError}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Button size="lg" className="bg-smartbus-blue hover:bg-smartbus-dark-blue">
              <Smartphone className="mr-2 h-5 w-5" />
              Download App
            </Button>
            
            <div className="flex items-center justify-center text-muted-foreground">
              <span className="text-sm">Available for iOS and Android</span>
            </div>
          </div>
          
          <div className="hidden md:flex justify-center items-center">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce">
                <ArrowDown className="h-6 w-6 text-smartbus-blue" />
              </div>
              <div className="h-[500px] w-[250px] bg-gray-800 rounded-[40px] border-[8px] border-gray-900 shadow-2xl flex items-center justify-center overflow-hidden">
                <div className="h-full w-full bg-gradient-to-br from-smartbus-blue to-blue-700 p-4 flex flex-col items-center justify-center text-white">
                  <div className="text-2xl font-bold mb-2">SmartBus</div>
                  <div className="text-xs opacity-80 mb-6">Real-time bus tracking</div>
                  
                  <div className="w-full h-[200px] bg-white/10 rounded-lg mb-4 flex items-center justify-center">
                    <MapPin className="h-10 w-10 text-white" />
                  </div>
                  
                  <div className="w-full space-y-2">
                    <div className="h-8 bg-white/10 rounded-md w-full"></div>
                    <div className="h-8 bg-white/10 rounded-md w-2/3"></div>
                    <div className="h-8 bg-white/10 rounded-md w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPromo;
