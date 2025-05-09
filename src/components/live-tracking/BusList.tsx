
import { Button } from "@/components/ui/button";
import { BusCard } from "./BusCard";
import { Bus } from "./types";

interface BusListProps {
  buses: Bus[];
  isTestBusEnabled: boolean;
  userLocation: [number, number] | null;
  onTrackBus: (coordinates: [number, number]) => void;
  onToggleTestBus: (enabled: boolean) => void;
}

export const BusList = ({ 
  buses, 
  isTestBusEnabled,
  userLocation,
  onTrackBus,
  onToggleTestBus
}: BusListProps) => {
  const regularBuses = buses.filter(bus => !bus.isTest);
  const testBus = buses.find(bus => bus.isTest);
  
  return (
    <div className="w-full md:w-1/3">
      <h2 className="text-2xl font-bold mb-6 text-smartbus-text-dark">Nearby Buses</h2>
      <div className="space-y-4">
        {/* Regular buses */}
        {regularBuses.map((bus) => (
          <BusCard
            key={bus.id}
            bus={bus}
            onTrackBus={onTrackBus}
          />
        ))}
        
        {/* Test Bus */}
        {testBus && (
          <BusCard
            bus={testBus}
            isTestBus={true}
            isTestBusEnabled={isTestBusEnabled}
            onTrackBus={onTrackBus}
            onToggleTestBus={onToggleTestBus}
          />
        )}
        
        <Button variant="link" className="w-full text-smartbus-blue">
          View All Nearby Buses
        </Button>
      </div>
    </div>
  );
};
