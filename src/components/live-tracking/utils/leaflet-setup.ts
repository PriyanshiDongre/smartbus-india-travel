
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import 'leaflet/dist/leaflet.css';

// Fix the default icon issue in Leaflet
const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export const setupLeaflet = () => {
  L.Marker.prototype.options.icon = DefaultIcon;
};

// Create user location marker icon with more stable animation
export const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div class="relative">
        <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-30 animate-pulse"></div>
        <div class="absolute w-4 h-4 bg-blue-600 rounded-full left-1 top-1 border-2 border-white shadow-md"></div>
        <div class="absolute w-2 h-2 bg-white rounded-full left-2 top-2"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Create bus icon
export const createBusIcon = () => {
  return L.divIcon({
    className: 'test-bus-icon',
    html: `
      <div class="bg-orange-500 p-1 rounded shadow-md transform">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 5H16A5 5 0 0121 10V19H3V10A5 5 0 018 5Z"></path>
          <path d="M19 10H5"></path>
          <path d="M5 14H19"></path>
          <path d="M7 19V21"></path>
          <path d="M17 19V21"></path>
        </svg>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

export const createBusPopupContent = (bus: { id: string, route: string, nextStop: string, eta: string }) => {
  return `
    <div style="padding: 8px; max-width: 200px;">
      <h3 style="font-weight: bold; margin-bottom: 4px;">${bus.id}</h3>
      <p style="margin-bottom: 4px;">${bus.route}</p>
      <p style="margin-bottom: 4px;">Next stop: ${bus.nextStop}</p>
      <p>ETA: ${bus.eta}</p>
    </div>
  `;
};

export const createTestBusPopupContent = () => {
  return `
    <div style="padding: 8px; max-width: 200px;">
      <h3 style="font-weight: bold; margin-bottom: 4px;">TEST-BUS-123</h3>
      <p style="margin-bottom: 4px;">Test Route - Phone GPS Tracking</p>
      <p style="margin-bottom: 4px;">Next stop: Wherever you go</p>
      <p>ETA: Real-time</p>
    </div>
  `;
};
