
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
      // Initialize map
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: defaultCenter,
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
        setMapReady(true);
      });
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
  }, [mapContainer, mapboxToken, onError]);

  // Fit bounds when tables or selection changes
  useEffect(() => {
    if (!map.current || !mapReady || !gamingTables.length) return;

    // Fit bounds to include all markers if there are any
    try {
      const tablesWithCoordinates = gamingTables.filter(
        table => table.location && table.location.coordinates
      );
      
      if (tablesWithCoordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        
        tablesWithCoordinates.forEach(table => {
          if (table.location && table.location.coordinates) {
            bounds.extend(table.location.coordinates);
          }
        });
        
        map.current.fitBounds(bounds, {
          padding: 100,
          maxZoom: 15
        });
      }
    } catch (error) {
      console.error("Error fitting bounds:", error);
      onError(`Failed to fit bounds: ${(error as Error).message}`);
    }
  }, [gamingTables, mapReady, onError]);

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
