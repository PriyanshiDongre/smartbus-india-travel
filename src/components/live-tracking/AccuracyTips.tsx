
export const AccuracyTips = () => {
  return (
    <div className="mt-4 p-4 border border-amber-300 bg-amber-50 rounded-md">
      <h3 className="font-bold text-amber-800">How to improve location accuracy:</h3>
      <ol className="list-decimal pl-5 text-amber-700">
        <li>Make sure you're outdoors or near windows</li>
        <li>Enable high-accuracy mode in your device settings</li>
        <li>Wait a few seconds for GPS signal to stabilize</li>
        <li>Try a different browser if issues persist</li>
      </ol>
    </div>
  );
};
