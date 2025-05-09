
import { useRef } from "react";
import { Bus, Coordinates } from "./types";
import { useMapMarkers } from "./hooks/useMapMarkers";
import { MapControls } from "./MapControls";
import { AccuracyIndicator } from "./AccuracyIndicator";
import { MapError } from "./MapError";
import { AccuracyTips } from "./AccuracyTips";
import { setupLeaflet } from "./utils/leaflet-setup";
import L from 'leaflet';

// Initialize Leaflet
setupLeaflet();

interface MapContainerProps {
  buses: Bus[];
  userLocation: Coordinates | null;
  isLocating: boolean;
  locationError: string | null;
  locationAccuracy?: number | null;
  isTestBusEnabled: boolean;
  mapLoaded: boolean;
  mapError: string | null;
  startLocationTracking: () => void;
  stopLocationTracking: () => void;
}

export const MapContainer = ({
  buses,
  userLocation,
  isLocating,
  locationError,
  locationAccuracy = null,
  isTestBusEnabled,
  mapLoaded,
  mapError,
  startLocationTracking,
  stopLocationTracking,
}: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<L.Map | null>(null);
  
  // Use the custom hook to manage map markers
  const { centerOnLocation } = useMapMarkers(
    map,
    mapContainer,
    buses,
    userLocation,
    isTestBusEnabled,
    locationAccuracy
  );

  return (
    <div className="w-full md:w-2/3">
      <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Live Bus Tracking</h2>
      
      {/* Map Error Display */}
      <MapError mapError={mapError} />
      
      {/* Map Container */}
      <div className="map-container h-[400px] relative bg-gray-100 rounded-xl overflow-hidden shadow-lg border border-muted">
        <div ref={mapContainer} className="absolute inset-0" style={{ width: '100%', height: '100%' }}></div>
        
        {/* Location Accuracy Indicator */}
        <AccuracyIndicator 
          userLocation={userLocation} 
          locationAccuracy={locationAccuracy} 
        />
      </div>
      
      {/* Location Accuracy Tips */}
      <AccuracyTips />
      
      {/* Map Controls */}
      <MapControls 
        mapError={mapError}
        isLocating={isLocating}
        userLocation={userLocation}
        startLocationTracking={startLocationTracking}
        stopLocationTracking={stopLocationTracking}
        centerOnLocation={centerOnLocation}
        locationError={locationError}
      />
    </div>
  );
};
