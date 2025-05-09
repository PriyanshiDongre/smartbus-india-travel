
import { useState } from "react";
import { MapContainer } from "./live-tracking/MapContainer";
import { BusList } from "./live-tracking/BusList"; 
import { useLocation } from "./live-tracking/useLocation";
import { useMapStatus } from "./live-tracking/useMapStatus";
import { useBusTracking } from "./live-tracking/useBusTracking";
import { getBusData } from "./live-tracking/busData";
import { toast } from "@/components/ui/sonner";
import { Coordinates } from "./live-tracking/types";

const LiveTrackingPreview = () => {
  // Get API key from environment variables
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";
  
  // Get bus data
  const buses = getBusData();
  
  // Location management
  const { 
    userLocation, 
    locationError, 
    isLocating, 
    startLocationTracking, 
    stopLocationTracking 
  } = useLocation();
  
  // Map status management
  const { 
    mapLoaded, 
    mapError, 
    setMapLoadSuccess, 
    setMapLoadError 
  } = useMapStatus(googleMapsApiKey);
  
  // Bus tracking functionality
  const { 
    isTestBusEnabled, 
    enableTestBus 
  } = useBusTracking(userLocation);
  
  // Handler for tracking a specific bus
  const handleTrackBus = (coordinates: Coordinates) => {
    if (!googleMapsApiKey || googleMapsApiKey.trim() === '') {
      toast.error("Cannot track bus: Missing Google Maps API key");
      return;
    }
    
    toast.success(`Now tracking bus at coordinates: ${coordinates[0]}, ${coordinates[1]}`);
  };
  
  // Handler for toggling the test bus
  const handleToggleTestBus = (enabled: boolean) => {
    // If enabling test bus and no location yet, start tracking
    if (enabled && !userLocation) {
      startLocationTracking();
    }
    
    // Enable/disable test bus
    enableTestBus(enabled);
  };

  return (
    <section className="py-12 bg-smartbus-gray">
      <div className="container">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Map Container */}
          <MapContainer 
            googleMapsApiKey={googleMapsApiKey}
            buses={buses}
            userLocation={userLocation}
            isLocating={isLocating}
            locationError={locationError}
            isTestBusEnabled={isTestBusEnabled}
            mapLoaded={mapLoaded}
            mapError={mapError}
            startLocationTracking={startLocationTracking}
            stopLocationTracking={stopLocationTracking}
          />
          
          {/* Bus List */}
          <BusList 
            buses={buses}
            isTestBusEnabled={isTestBusEnabled}
            userLocation={userLocation}
            onTrackBus={handleTrackBus}
            onToggleTestBus={handleToggleTestBus}
          />
        </div>
      </div>
    </section>
  );
};

export default LiveTrackingPreview;
