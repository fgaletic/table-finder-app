
import { toast } from "sonner";

// You'll need to provide a Mapbox access token
// This should be a public token that can be exposed in client-side code
// See: https://docs.mapbox.com/help/getting-started/access-tokens/
const MAPBOX_ACCESS_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsazE0dGVnbDBhYXYzZGticDdkZjRnb3YifQ.lb4OjDvAFznA3fCebOgSng";

/**
 * Convert an address to coordinates using Mapbox geocoding API
 */
export const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
  if (!address) return null;
  
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?access_token=${MAPBOX_ACCESS_TOKEN}`);
    
    if (!response.ok) {
      throw new Error(`Geocoding API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      // Mapbox returns coordinates as [longitude, latitude]
      return data.features[0].center as [number, number];
    } else {
      toast.error("Address could not be geocoded. Please check the address.");
      return null;
    }
  } catch (error) {
    console.error("Geocoding error:", error);
    toast.error("Failed to geocode address. Please try again later.");
    return null;
  }
};

/**
 * Convert coordinates to an address using Mapbox reverse geocoding API
 */
export const reverseGeocode = async (coordinates: [number, number]): Promise<string | null> => {
  if (!coordinates) return null;
  
  try {
    const [longitude, latitude] = coordinates;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      // Return the place name or full address
      return data.features[0].place_name;
    } else {
      toast.error("Location could not be reverse geocoded.");
      return null;
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    toast.error("Failed to get address from coordinates. Please try again later.");
    return null;
  }
};

/**
 * Create a link to open the location in an external map application
 */
export const getMapLink = (coordinates: [number, number]): string => {
  const [longitude, latitude] = coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};
