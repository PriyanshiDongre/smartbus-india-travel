
import { useState } from "react";
import { toast } from "@/components/ui/sonner";
import { Coordinates } from "./types";

export const useBusTracking = (userLocation: Coordinates | null) => {
  const [isTestBusEnabled, setIsTestBusEnabled] = useState(false);
  
  const enableTestBus = (enable: boolean = true) => {
    setIsTestBusEnabled(enable);
    
    // If enabling test bus
    if (enable) {
      // If we have user location
      if (userLocation) {
        toast.success("Test Bus is now tracking your phone's location!");
      } 
      // If trying to enable but no location yet
      else {
        toast.error("Please enable location tracking first before tracking the Test Bus");
        return false;
      }
    } 
    // If disabling test bus
    else {
      toast.info("Test Bus tracking disabled");
    }
    
    return true;
  };
  
  return {
    isTestBusEnabled,
    enableTestBus
  };
};
