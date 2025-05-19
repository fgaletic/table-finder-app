
import { useRef, useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GamingTable } from "@/services/gamingTableData";
import MapMarker from "./MapMarker";

interface MapContainerProps {
  gamingTables: (GamingTable & { 
    venueId?: string, 
    venueName?: string, 
    distance?: number, 
    rating?: number 
  })[];
  mapboxToken: string;
  onError: (error: string) => void;
}

export const MapContainer = ({ gamingTables, mapboxToken, onError }: MapContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Center on Barcelona
  const defaultCenter: [number, number] = [2.1734, 41.3851];

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapboxToken) return;
    
    // If the map is already initialized, don't recreate it
    if (map.current) return;
    
    try {
      console.log("Initializing map with token:", mapboxToken.substring(0, 10) + "...");
      console.log("Tables to display:", gamingTables.length);
      
      // Initialize map with Barcelona default center
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: defaultCenter, // Always initialize with Barcelona center
        zoom: 13,
      });

      // Add error handling
      map.current.on('error', (e) => {
        console.error("Mapbox error:", e);
        onError(`Map error: ${e.error?.message || 'Unknown error'}`);
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      // Add geolocation control to center on user location
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true
        }),
        'top-right'
      );

      // Mark map as ready when loaded
      map.current.on('load', () => {
        console.log("Map loaded successfully");
        setMapReady(true);
      });
      
      // Add Barcelona landmark marker if no tables
      if (gamingTables.length === 0) {
        console.log("No tables, adding Barcelona landmark marker");
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3>Barcelona</h3><p>No gaming tables are currently available here. Try adding some!</p>');
          
        new mapboxgl.Marker({ color: "#3FB1CE" })
          .setLngLat(defaultCenter)
          .setPopup(popup)
          .addTo(map.current);
      }
      
    } catch (error) {
      console.error("Error initializing map:", error);
      onError(`Failed to initialize map: ${(error as Error).message}`);
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, mapboxToken, onError, gamingTables.length]);

  // Fit bounds when tables or selection changes - but only for Barcelona-area coordinates
  useEffect(() => {
    if (!map.current || !mapReady) return;

    console.log("Fitting bounds with tables:", gamingTables.length);
    
    // Filter for tables that have valid Barcelona-area coordinates
    try {
      const barcelonaAreaTables = gamingTables.filter(
        table => {
          // Check if table has coordinates
          if (!table.location || !table.location.coordinates) {
            return false;
          }
          
          // Get the coordinates
          const [lng, lat] = table.location.coordinates;
          
          // Check if the coordinates are in the Barcelona area (rough bounds check)
          const isInBarcelonaArea = 
            lng > 1.0 && lng < 3.0 && // Barcelona longitude range 
            lat > 40.0 && lat < 42.5; // Barcelona latitude range
          
          if (!isInBarcelonaArea) {
            console.log(`Table ${table.id} coordinates outside Barcelona area:`, table.location.coordinates);
          }
          
          return isInBarcelonaArea;
        }
      );
      
      console.log("Tables with Barcelona-area coordinates:", barcelonaAreaTables.length);
      
      if (barcelonaAreaTables.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        
        barcelonaAreaTables.forEach(table => {
          if (table.location && table.location.coordinates) {
            bounds.extend(table.location.coordinates);
          }
        });
        
        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 15
        });
      } else {
        // If no tables with coordinates, center on Barcelona
        console.log("No tables with Barcelona coordinates, centering on Barcelona default");
        map.current.flyTo({
          center: defaultCenter,
          zoom: 13,
          essential: true
        });
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
    }
  }, [gamingTables, mapReady]);

  // Handle marker click
  const handleMarkerClick = (tableId: string) => {
    if (selectedId === tableId) {
      setSelectedId(null);
    } else {
      setSelectedId(tableId);
      
      // Center map on the marker
      const selectedTable = gamingTables.find(table => table.id === tableId);
      if (selectedTable?.location?.coordinates && map.current) {
        map.current.flyTo({
          center: selectedTable.location.coordinates,
          zoom: 15,
          essential: true
        });
      }
    }
  };

  return (
    <>
      <div ref={mapContainer} className="h-full w-full bg-blue-50" />
      
      {/* Render markers once map is ready */}
      {mapReady && map.current && gamingTables.map(table => (
        table.location && table.location.coordinates ? (
          <MapMarker
            key={table.id}
            table={table}
            map={map.current!}
            onMarkerClick={handleMarkerClick}
            isSelected={selectedId === table.id}
          />
        ) : null
      ))}
    </>
  );
};

export default MapContainer;
