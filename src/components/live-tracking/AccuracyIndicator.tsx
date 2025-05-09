
interface AccuracyIndicatorProps {
  userLocation: [number, number] | null;
  locationAccuracy: number | null;
}

export const AccuracyIndicator = ({ 
  userLocation, 
  locationAccuracy 
}: AccuracyIndicatorProps) => {
  if (!userLocation || !locationAccuracy) return null;
  
  return (
    <div className="absolute top-2 left-2 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs z-[1000] max-w-[200px]">
      <div className="font-semibold">Location Accuracy</div>
      <div className={`
        ${locationAccuracy <= 20 ? 'text-green-600' : 
          locationAccuracy <= 100 ? 'text-amber-600' : 'text-red-600'}
      `}>
        ±{Math.round(locationAccuracy)}m {locationAccuracy <= 20 ? '(High)' : 
          locationAccuracy <= 100 ? '(Moderate)' : '(Low)'}
      </div>
    </div>
  );
};
