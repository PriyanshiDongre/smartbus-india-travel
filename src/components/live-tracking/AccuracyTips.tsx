
export const AccuracyTips = () => {
  return (
    <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
      <h3 className="font-bold text-amber-800">How to improve location accuracy:</h3>
      <ol className="list-decimal pl-5 text-amber-700">
        <li>Make sure you're outdoors with a clear view of the sky</li>
        <li>Enable high-accuracy mode in your device location settings</li>
        <li>Allow a few moments for GPS signal to stabilize</li>
        <li>Try not to move too quickly while the location is being determined</li>
        <li>Use a device with better GPS capabilities if possible</li>
      </ol>
    </div>
  );
};
