
import { toast } from "sonner";

// Get token from environment variables if available
const ENV_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
// Default fallback token - your application should use the token from MapTokenProvider or env
const MAPBOX_ACCESS_TOKEN = ENV_TOKEN || "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsazE0dGVnbDBhYXYzZGticDdkZjRnb3YifQ.lb4OjDvAFznA3fCebOgSng";

// Helper function to get MapBox token from localStorage if available
const getMapboxToken = (): string => {
  // Try to get token from localStorage
  if (typeof window !== "undefined") {
    const storedToken = localStorage.getItem("mapboxToken");
    if (storedToken) return storedToken;
  }
  return MAPBOX_ACCESS_TOKEN;
};

// Barcelona coordinates boundaries for validation
const BARCELONA_BOUNDS = {
  lng: { min: 2.05, max: 2.30 },
  lat: { min: 41.30, max: 41.50 }
};

// Barcelona neighborhoods with approximate coordinate boundaries
export const BARCELONA_NEIGHBORHOODS = {
  EIXAMPLE: {
    name: "L'Eixample",
    bounds: {
      lng: { min: 2.13, max: 2.18 },
      lat: { min: 41.37, max: 41.41 }
    }
  },
  GRACIA: {
    name: "Gràcia",
    bounds: {
      lng: { min: 2.14, max: 2.17 },
      lat: { min: 41.39, max: 41.42 }
    }
  },
  GOTHIC_QUARTER: {
    name: "Barri Gòtic",
    bounds: {
      lng: { min: 2.17, max: 2.18 },
      lat: { min: 41.37, max: 41.39 }
    }
  },
  BARCELONETA: {
    name: "La Barceloneta",
    bounds: {
      lng: { min: 2.18, max: 2.20 },
      lat: { min: 41.37, max: 41.39 }
    }
  },
  POBLENOU: {
    name: "Poblenou",
    bounds: {
      lng: { min: 2.18, max: 2.22 },
      lat: { min: 41.39, max: 41.41 }
    }
  },
  SAGRADA_FAMILIA: {
    name: "Sagrada Familia",
    bounds: {
      lng: { min: 2.16, max: 2.19 },
      lat: { min: 41.40, max: 41.42 }
    }
  }
};

/**
 * Check if coordinates are within Barcelona area
 */
export const isBarcelonaLocation = (coordinates: [number, number]): boolean => {
  const [lng, lat] = coordinates;
  return (
    lng >= BARCELONA_BOUNDS.lng.min && 
    lng <= BARCELONA_BOUNDS.lng.max && 
    lat >= BARCELONA_BOUNDS.lat.min && 
    lat <= BARCELONA_BOUNDS.lat.max
  );
};

/**
 * Convert an address to coordinates using Mapbox geocoding API
 */
/**
 * Check if an address appears to be in Barcelona
 */
const isBarcelonaAddress = (address: string): boolean => {
  const lowercaseAddress = address.toLowerCase();
  // Check if address contains Barcelona or common Barcelona postal codes
  return (
    lowercaseAddress.includes("barcelona") || 
    /\b080[0-9]{2}\b/.test(lowercaseAddress) || // Barcelona postal codes
    lowercaseAddress.includes("bcn") ||
    lowercaseAddress.includes("barna") // Common local abbreviation
  );
};

/**
 * Attempt to append Barcelona to addresses without city information
 */
const appendBarcelonaToAddress = (address: string): string => {
  // Only append Barcelona if it's not already included
  if (!isBarcelonaAddress(address)) {
    // Check if it has a postal code but no city name
    if (/\d{5}/.test(address) && !address.toLowerCase().includes("barcelona")) {
      return `${address}, Barcelona`;
    }
    // If no postal code but likely just a street
    if (address.toLowerCase().includes("carrer") || 
        address.toLowerCase().includes("avinguda") || 
        address.toLowerCase().includes("plaça")) {
      return `${address}, Barcelona, 08001`;
    }
  }
  return address;
};

export const geocodeAddress = async (address: string, customToken?: string): Promise<[number, number] | null> => {
  if (!address) return null;
  
  try {
    // Use provided token, or get token from localStorage
    const token = customToken || getMapboxToken();
    
    // Add Barcelona context to address if missing
    const enrichedAddress = appendBarcelonaToAddress(address);
    const encodedAddress = encodeURIComponent(enrichedAddress);
    
    // Add Barcelona as a proximity bias and restrict to Spain
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodedAddress}.json?proximity=2.1734,41.3851&country=es&bbox=2.05,41.30,2.30,41.50&access_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      // Mapbox returns coordinates as [longitude, latitude]
      const coordinates = data.features[0].center as [number, number];
      
      // Get Barcelona location context
      const locationContext = getBarcelonaLocationContext(coordinates);
      
      // If the geocoded address is in Barcelona, use it
      if (locationContext.isInBarcelona) {
        // If there's a neighborhood, show it in the notification
        if (locationContext.neighborhood) {
          toast.success(`Location found in ${locationContext.neighborhood}, Barcelona`);
        }
        return coordinates;
      } else {
        // For addresses outside Barcelona, show a warning and return coordinates
        console.warn("Address geocoded outside of Barcelona:", data.features[0].place_name);
        toast.warning("Address appears to be outside Barcelona. Results may not be accurate.");
        return coordinates;
      }
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
 * Now with enhanced Barcelona location context
 */
export const reverseGeocode = async (coordinates: [number, number], customToken?: string): Promise<{ 
  address: string | null;
  neighborhood: string | null;
  isInBarcelona: boolean;
}> => {
  if (!coordinates) return { address: null, neighborhood: null, isInBarcelona: false };
  
  try {
    // Use provided token, or get token from localStorage
    const token = customToken || getMapboxToken();
    
    const [longitude, latitude] = coordinates;
    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${token}`
    );
    
    if (!response.ok) {
      throw new Error(`Reverse geocoding API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Get Barcelona location context
    const locationContext = getBarcelonaLocationContext(coordinates);
    
    if (data.features && data.features.length > 0) {
      // Return the place name or full address along with Barcelona context
      return {
        address: data.features[0].place_name,
        neighborhood: locationContext.neighborhood,
        isInBarcelona: locationContext.isInBarcelona
      };
    } else {
      toast.error("Location could not be reverse geocoded.");
      return {
        address: null,
        neighborhood: locationContext.neighborhood,
        isInBarcelona: locationContext.isInBarcelona
      };
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    toast.error("Failed to get address from coordinates. Please try again later.");
    
    // Still return Barcelona context if available
    const locationContext = getBarcelonaLocationContext(coordinates);
    return {
      address: null,
      neighborhood: locationContext.neighborhood,
      isInBarcelona: locationContext.isInBarcelona
    };
  }
};

/**
 * Detect which Barcelona neighborhood the coordinates are in
 */
export const detectBarcelonaNeighborhood = (coordinates: [number, number]): string | null => {
  if (!isBarcelonaLocation(coordinates)) return null;
  
  const [lng, lat] = coordinates;
  
  // Check each neighborhood
  for (const [key, neighborhood] of Object.entries(BARCELONA_NEIGHBORHOODS)) {
    const { bounds } = neighborhood;
    if (
      lng >= bounds.lng.min &&
      lng <= bounds.lng.max &&
      lat >= bounds.lat.min &&
      lat <= bounds.lat.max
    ) {
      return neighborhood.name;
    }
  }
  
  // If in Barcelona but not in a defined neighborhood
  return "Barcelona";
};

/**
 * Get Barcelona-specific location context from coordinates
 */
export const getBarcelonaLocationContext = (coordinates: [number, number]): { 
  isInBarcelona: boolean;
  neighborhood: string | null;
  distanceToCenter: number; // in meters
} => {
  // Barcelona city center (Plaça de Catalunya)
  const BARCELONA_CENTER: [number, number] = [2.1700, 41.3874];
  
  const isInBarcelona = isBarcelonaLocation(coordinates);
  const neighborhood = detectBarcelonaNeighborhood(coordinates);
  
  // Calculate distance to city center in meters (approximate using Haversine formula)
  const [lng1, lat1] = coordinates;
  const [lng2, lat2] = BARCELONA_CENTER;
  
  const R = 6371e3; // Earth's radius in meters
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lng2-lng1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return {
    isInBarcelona,
    neighborhood,
    distanceToCenter: Math.round(distance)
  };
};

/**
 * Create a link to open the location in an external map application
 */
export const getMapLink = (coordinates: [number, number]): string => {
  const [longitude, latitude] = coordinates;
  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
};
