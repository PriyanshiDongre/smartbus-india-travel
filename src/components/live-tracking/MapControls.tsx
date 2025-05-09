
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MapControlsProps {
  mapError: string | null;
  isLocating: boolean;
  userLocation: [number, number] | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
  centerOnLocation: () => void;
  locationError: string | null;
}

export const MapControls = ({
  mapError,
  isLocating,
  userLocation,
  startLocationTracking,
  stopLocationTracking,
  centerOnLocation,
  locationError
}: MapControlsProps) => {
  return (
    <>
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
    </>
  );
};
