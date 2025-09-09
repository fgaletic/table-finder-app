/**
 * Geographic utility functions for Barcelona gaming table finder
 * Shared utilities to avoid code duplication across services
 */

/**
 * Convert degrees to radians
 */
export const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param coords1 First coordinate pair [longitude, latitude]
 * @param coords2 Second coordinate pair [longitude, latitude]
 * @returns Distance in kilometers
 */
export const calculateDistance = (
  coords1: [number, number],
  coords2: [number, number]
): number => {
  const R = 6371; // Earth's radius in km
  const dLat = deg2rad(coords2[1] - coords1[1]);
  const dLon = deg2rad(coords2[0] - coords1[0]);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(coords1[1])) * Math.cos(deg2rad(coords2[1])) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

/**
 * Barcelona city center coordinates (Plaça de Catalunya)
 */
export const BARCELONA_CENTER: [number, number] = [2.1700, 41.3874];

/**
 * Calculate distance from Barcelona city center
 * @param coordinates Target coordinates [longitude, latitude]
 * @returns Distance from city center in meters
 */
export const distanceFromBarcelonaCenter = (coordinates: [number, number]): number => {
  const distanceKm = calculateDistance(BARCELONA_CENTER, coordinates);
  return Math.round(distanceKm * 1000); // Convert to meters and round
};
