
interface AccuracyIndicatorProps {
  userLocation: [number, number] | null;
  locationAccuracy: number | null;
}

export const AccuracyIndicator = ({ 
  userLocation, 
  locationAccuracy 
}: AccuracyIndicatorProps) => {
  if (!userLocation || !locationAccuracy) return null;
  
  // Determine accuracy status
  let accuracyStatus = 'Low';
  let colorClass = 'text-red-600';
  
  if (locationAccuracy <= 20) {
    accuracyStatus = 'High';
    colorClass = 'text-green-600';
  } else if (locationAccuracy <= 100) {
    accuracyStatus = 'Moderate';
    colorClass = 'text-amber-600';
  }
  
  return (
    <div className="absolute top-2 left-2 bg-white bg-opacity-80 p-2 rounded shadow-sm text-xs z-[1000] max-w-[200px]">
      <div className="font-semibold">Location Accuracy</div>
      <div className={colorClass}>
        ±{Math.round(locationAccuracy)}m ({accuracyStatus})
      </div>
    </div>
  );
};
