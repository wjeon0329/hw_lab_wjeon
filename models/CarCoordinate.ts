export interface CarCoordinate {
  latitude: number;
  longitude: number;
}

export const defaultCarCoordinate: CarCoordinate = { latitude: 0, longitude: 0 };

// Treats (0, 0) as the lab's sentinel meaning that no car location is saved.
export function isValidCoordinate(coordinate: CarCoordinate): boolean {
  return coordinate.latitude !== 0 || coordinate.longitude !== 0;
}

// Formats latitude and longitude to six decimal places for the alert and map card.
export function formatCoordinate(coordinate: CarCoordinate): string {
  return `(${coordinate.latitude.toFixed(6)}, ${coordinate.longitude.toFixed(6)})`;
}
