import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useMapToken } from "./MapTokenProvider";
import { GamingTable } from "@/services/gamingTableData";
import { useNavigate } from "react-router-dom";
import { Dices, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import "./map-styles.css";

interface MapboxMapProps {
  gamingTables: (GamingTable & { 
    venueId?: string, 
    venueName?: string, 
    distance?: number, 
    rating?: number 
  })[];
  isLoading?: boolean;
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
}

const MapboxMap = ({ 
  gamingTables, 
  isLoading = false,
  center = [-73.9857, 40.7484], // Default to NYC center
  zoom = 12
}: MapboxMapProps) => {
  const { mapboxToken, isTokenSet } = useMapToken();
  const navigate = useNavigate();
  
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const popups = useRef<mapboxgl.Popup[]>([]);
  
  const [mapInitialized, setMapInitialized] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current || !isTokenSet) return;
    
    // Set access token
    mapboxgl.accessToken = mapboxToken;

    try {
      // Create new map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: center,
        zoom: zoom
      });
      
      // Add error handler
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e.error);
        if (e.error && e.error.status === 401) {
          // Token is invalid
          setMapInitialized(false);
          setMapError('Invalid MapBox token. Please provide a valid token.');
        }
      });
      
      // Add load event handler
      map.current.on('load', () => {
        setMapInitialized(true);
        setMapError(null);
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add user location
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        })
      );
    } catch (error) {
      console.error("Error initializing MapBox:", error);
      setMapError("Failed to initialize the map. Please check your token.");
      setMapInitialized(false);
    }

    // Clean up map on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, isTokenSet, center, zoom]);

  // Add markers when tables change or map is ready
  useEffect(() => {
    if (!map.current || !mapInitialized || !gamingTables.length) return;

    // Clear existing markers and popups
    markers.current.forEach(marker => marker.remove());
    popups.current.forEach(popup => popup.remove());
    markers.current = [];
    popups.current = [];

    // Add new markers
    gamingTables.forEach(table => {
      if (!table.location?.coordinates) return;
      
      const [longitude, latitude] = table.location.coordinates;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.innerHTML = `
        <div class="${table.availability.status === 'available' ? 'text-green-500' : 'text-amber-500'} 
            bg-white p-1 rounded-full shadow-md" style="width: 32px; height: 32px; display: flex; 
            justify-content: center; align-items: center; cursor: pointer;">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" 
            fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
            stroke-linejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <circle cx="9" cy="12" r="1" fill="currentColor" />
            <circle cx="15" cy="12" r="1" fill="currentColor" />
          </svg>
        </div>
      `;

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <div class="font-medium">${table.name}</div>
            ${table.venueName ? `<div class="text-sm text-gray-500">${table.venueName}</div>` : ''}
            ${table.distance !== undefined ? `<div class="text-sm text-gray-500 mt-0.5">${table.distance}m away</div>` : ''}
            <div class="flex justify-between items-center mt-1">
              ${table.rating !== undefined ? 
                `<div class="flex items-center gap-1">
                  <span class="text-sm">${table.rating}</span>
                  <span class="text-yellow-500 text-sm">★</span>
                </div>` : ''}
              <button
                class="text-sm text-blue-600 hover:underline"
                onclick="window.navigateToTable('${table.id}')"
              >
                View Details
              </button>
            </div>
          </div>
        `);
      
      // Add marker to map
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      // Store references for cleanup
      markers.current.push(marker);
      popups.current.push(popup);

      // Add click handler
      el.addEventListener('click', () => {
        setSelectedId(table.id);
      });
    });

    // Add global function for popup buttons
    window.navigateToTable = (id: string) => {
      navigate(`/gamingTable/${id}`);
    };

  }, [gamingTables, mapInitialized, navigate]);
    return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-md overflow-hidden map-container"
      />
      
      {/* Token not set warning */}
      {!isTokenSet && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-4 text-center">
          <p className="mb-2">MapBox token not set. Please set a valid token in settings.</p>
        </div>
      )}
      
      {/* Map error message */}
      {mapError && (
        <div className="absolute inset-0 bg-white/90 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-red-500 font-medium mb-2">{mapError}</p>
          <p className="text-sm text-gray-600 mb-4">Please set a valid MapBox token in settings.</p>
          <div className="text-xs text-gray-500 max-w-md">
            <p className="mb-2">To get a valid MapBox token:</p>
            <ol className="list-decimal list-inside text-left">
              <li>Sign up for a free account at <a href="https://www.mapbox.com/signup" className="text-blue-500 underline" target="_blank" rel="noopener">mapbox.com</a></li>
              <li>Go to your account dashboard</li>
              <li>Create a new token with these scopes:</li>
              <ul className="list-disc list-inside ml-4 mt-1">
                <li>Styles:read</li>
                <li>Fonts:read</li>
                <li>Vision:read</li>
                <li>Geocoding:read</li>
              </ul>
              <li>Copy the token and paste it here</li>
            </ol>
          </div>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Loading map data...</span>
          </div>
        </div>
      )}
      
      {/* Global types for window object */}
      {createPortal(
        <script dangerouslySetInnerHTML={{ 
          __html: `
            window.navigateToTable = function(id) {
              console.log("This will be overridden by the real implementation");
            };
          ` 
        }} />,
        document.head
      )}
    </div>
  );
};

// Add type declaration for the global function
declare global {
  interface Window {
    navigateToTable: (id: string) => void;
  }
}

export default MapboxMap;
