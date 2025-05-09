
interface MapErrorProps {
  mapError: string | null;
}

export const MapError = ({ mapError }: MapErrorProps) => {
  if (!mapError) return null;
  
  return (
    <div className="mb-4 p-4 border border-red-300 bg-red-50 rounded-md">
      <h3 className="font-bold text-red-800">Map Error</h3>
      <p className="text-red-700">{mapError}</p>
      <p className="mt-2 text-sm text-red-600">
        Please refresh the page or try using a different browser if this error persists.
      </p>
    </div>
  );
};
