
// Define the proper type for coordinates
export type Coordinates = [number, number]; // lat, lng

export interface Bus {
  id: string;
  route: string;
  location: string;
  eta: string;
  occupancy: number;
  nextStop: string;
  progress: number;
  coordinates: Coordinates;
  isTest?: boolean;
}
