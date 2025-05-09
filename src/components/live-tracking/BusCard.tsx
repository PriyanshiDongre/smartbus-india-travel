
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import { Bus } from "./types";

interface BusCardProps {
  bus: Bus;
  isTestBus?: boolean;
  isTestBusEnabled?: boolean;
  onTrackBus: (coordinates: [number, number]) => void;
  onToggleTestBus?: (enabled: boolean) => void;
}

export const BusCard = ({ 
  bus, 
  isTestBus = false,
  isTestBusEnabled = false,
  onTrackBus,
  onToggleTestBus 
}: BusCardProps) => {
  return (
    <Card className={`bus-card ${
      isTestBus 
        ? isTestBusEnabled ? 'border-orange-500 ring-2 ring-orange-200' : 'hover:border-orange-500'
        : 'hover:border-smartbus-blue'
    }`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div>
            {isTestBus && isTestBusEnabled && (
              <span className="animate-ping absolute h-2 w-2 rounded-full bg-orange-400 inline-block mr-1"></span>
            )}
            <span className={`font-semibold text-sm ${isTestBus ? 'text-orange-600' : ''}`}>{bus.id}</span>
          </div>
          <span className={`text-xs ${
            isTestBus 
              ? 'bg-orange-100 text-orange-800' 
              : 'bg-smartbus-gray'
          } px-2 py-1 rounded-full`}>
            {isTestBus ? 'DEMO' : `ETA: ${bus.eta}`}
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
          <Progress 
            value={bus.progress} 
            className={`h-1.5 ${isTestBus ? 'bg-orange-100' : ''}`}
          >
            {isTestBus && isTestBusEnabled && (
              <div className={`h-full bg-orange-500 ${isTestBusEnabled ? 'animate-pulse' : ''}`}></div>
            )}
          </Progress>
        </div>
        
        {isTestBus ? (
          <Button 
            variant={isTestBusEnabled ? "default" : "outline"}
            size="sm" 
            className={`w-full ${
              isTestBusEnabled 
                ? "bg-orange-500 hover:bg-orange-600 text-white" 
                : "border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            }`}
            onClick={() => onToggleTestBus?.(!isTestBusEnabled)}
          >
            {isTestBusEnabled ? "Stop Test Bus Tracking" : "Track Test Bus (Your Phone)"}
          </Button>
        ) : (
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full border-smartbus-blue text-smartbus-blue hover:bg-smartbus-blue hover:text-white"
            onClick={() => onTrackBus(bus.coordinates)}
          >
            Track This Bus
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
