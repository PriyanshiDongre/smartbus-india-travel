
import { Bus } from './types';

// Mock bus data - in a real app, this would come from an API
export const getBusData = (): Bus[] => [
  {
    id: "KA-01-F-5555",
    route: "Bengaluru Central - Electronic City",
    location: "Near Silk Board",
    eta: "10 mins",
    occupancy: 65,
    nextStop: "HSR Layout",
    progress: 65,
    coordinates: [12.935971, 77.623177] // lat, lng
  },
  {
    id: "KA-05-G-7890",
    route: "Whitefield - Marathahalli",
    location: "Near ITPL",
    eta: "5 mins",
    occupancy: 40,
    nextStop: "Kundalahalli Gate",
    progress: 40,
    coordinates: [12.969300, 77.731700] // lat, lng
  },
  {
    id: "KA-02-J-1234",
    route: "Hebbal - Majestic",
    location: "Near Mekhri Circle",
    eta: "15 mins",
    occupancy: 85,
    nextStop: "Mantri Square",
    progress: 80,
    coordinates: [13.015578, 77.583862] // lat, lng
  },
  // Test bus that uses user's location
  {
    id: "TEST-BUS-123",
    route: "Test Route - Phone GPS Tracking",
    location: "Your current location",
    eta: "Real-time",
    occupancy: 10,
    nextStop: "Wherever you go",
    progress: 100,
    coordinates: [12.9716, 77.5946], // Default coordinates, will be updated with user location
    isTest: true
  }
];
