
import { useState, useEffect, useRef } from "react";
import { GamingTable } from "@/services/gamingTableData";
import { useNavigate } from "react-router-dom";
import { Dices, MapPin, Settings, ExternalLink } from "lucide-react";
import { useMapToken } from "./MapTokenProvider";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from "./ui/button";

interface GamingTableMapProps {
  gamingTables: (GamingTable & { 
    venueId?: string, 
    venueName?: string, 
    distance?: number, 
    rating?: number 
  })[];
  isLoading?: boolean;
}

const GamingTableMap = ({ gamingTables, isLoading = false }: GamingTableMapProps) => {
  const navigate = useNavigate();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<{[key: string]: mapboxgl.Marker}>({});
  const popupsRef = useRef<{[key: string]: mapboxgl.Popup}>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { mapboxToken, showTokenDialog, isTokenValid } = useMapToken();
  const [mapError, setMapError] = useState<string | null>(null);

  // Center on Barcelona
  const defaultCenter: [number, number] = [2.1734, 41.3851];

  useEffect(() => {
    if (!mapContainer.current) return;
    if (!mapboxToken) return;
    if (!isTokenValid) return;
    
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
        setMapError(`Map error: ${e.error?.message || 'Unknown error'}`);
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

      // Clear any error when map loads successfully
      map.current.on('load', () => {
        setMapError(null);
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(`Failed to initialize map: ${(error as Error).message}`);
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, mapboxToken, isTokenValid]);

  // Update markers when gaming tables change
  useEffect(() => {
    if (!map.current || !mapboxToken || !isTokenValid || !gamingTables.length) return;

    try {
      // Wait for map to be ready
      if (!map.current.loaded()) {
        map.current.once('load', () => updateMarkers());
      } else {
        updateMarkers();
      }
    } catch (error) {
      console.error("Error updating markers:", error);
      setMapError(`Failed to update markers: ${(error as Error).message}`);
    }
  }, [gamingTables, mapboxToken, isTokenValid, selectedId]);

  // Function to update markers
  const updateMarkers = () => {
    if (!map.current) return;

    // Clear any existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};
    
    // Clear any existing popups
    Object.values(popupsRef.current).forEach(popup => popup.remove());
    popupsRef.current = {};

    // Add markers for each gaming table
    gamingTables.forEach(table => {
      // Only add marker if we have coordinates
      if (table.location && table.location.coordinates) {
        const coordinates = table.location.coordinates; // [longitude, latitude]
        
        // Create a popup
        const popup = new mapboxgl.Popup({ offset: 25, closeButton: false })
          .setHTML(`
            <div style="padding: 8px;">
              <div style="font-weight: 500; margin-bottom: 4px;">${table.name}</div>
              ${table.venueName ? `<div style="font-size: 12px; color: #666;">${table.venueName}</div>` : ''}
              ${table.distance !== undefined ? `<div style="font-size: 12px; color: #666; margin-top: 4px;">${table.distance}m away</div>` : ''}
              <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
                ${table.rating !== undefined ? 
                `<div style="display: flex; align-items: center; gap: 4px;">
                  <span style="font-size: 12px;">${table.rating}</span>
                  <span style="color: #f59e0b; font-size: 12px;">★</span>
                </div>` : ''}
                <a href="/gamingTable/${table.id}" style="font-size: 12px; color: #0d6efd; text-decoration: none; margin-left: 8px;">
                  View Details
                </a>
              </div>
            </div>
          `);
        
        popupsRef.current[table.id] = popup;
        
        // Create HTML element for marker
        const el = document.createElement('div');
        el.className = 'marker';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.borderRadius = '50%';
        el.style.backgroundColor = getMarkerColor(table.availability.status);
        el.style.display = 'flex';
        el.style.justifyContent = 'center';
        el.style.alignItems = 'center';
        el.style.cursor = 'pointer';
        el.style.boxShadow = '0 0 0 2px white, 0 0 0 4px rgba(0,0,0,0.1)';
        el.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;"><path d="M2 16V15a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1M8 7H6a2 2 0 0 0-2 2v1"/><path d="M18 7h2a2 2 0 0 1 2 2v1"/><path d="M16 15v1a2 2 0 0 0 2 2h.5"/><path d="M7.5 20H2v-1a2 2 0 0 1 2-2h1.9"/><path d="M12 12v-1.5a2.5 2.5 0 0 1 5 0V12"/><rect x="12" y="11" width="5" height="10" rx="1"/></svg>';

        // Create and add the marker
        const marker = new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current!);
        
        markersRef.current[table.id] = marker;
        
        // Event listeners
        el.addEventListener('mouseenter', () => {
          popup.addTo(map.current!);
        });
        
        el.addEventListener('mouseleave', () => {
          if (selectedId !== table.id) {
            popup.remove();
          }
        });
        
        el.addEventListener('click', () => {
          if (selectedId === table.id) {
            setSelectedId(null);
            popup.remove();
          } else {
            // Close any open popup
            if (selectedId && popupsRef.current[selectedId]) {
              popupsRef.current[selectedId].remove();
            }
            
            setSelectedId(table.id);
            popup.addTo(map.current!);
            
            // Center map on the marker
            map.current!.flyTo({
              center: coordinates,
              zoom: 15,
              essential: true
            });
          }
        });
      }
    });
    
    // Fit bounds to include all markers if there are any
    if (Object.keys(markersRef.current).length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      Object.values(markersRef.current).forEach(marker => {
        bounds.extend(marker.getLngLat());
      });
      map.current.fitBounds(bounds, {
        padding: 100,
        maxZoom: 15
      });
    }
  };

  // Helper function to get marker color based on availability status
  const getMarkerColor = (status: string): string => {
    switch (status) {
      case 'available': return '#10b981'; // green
      case 'occupied': return '#f59e0b'; // amber
      case 'maintenance': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {/* If no token is set or token is invalid, show token request banner */}
      {(!mapboxToken || !isTokenValid) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm z-50 p-4">
          <div className="bg-background rounded-lg shadow-lg p-6 max-w-md text-center">
            <h3 className="text-lg font-semibold mb-2">
              {!mapboxToken ? "Mapbox Token Required" : "Invalid Mapbox Token"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {!mapboxToken 
                ? "To display the map, please set your Mapbox token."
                : "Your current Mapbox token is invalid. Please update it."}
            </p>
            <div className="space-y-4">
              <Button onClick={showTokenDialog} className="w-full">
                {!mapboxToken ? "Set Mapbox Token" : "Update Token"}
              </Button>
              <a 
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center text-sm text-blue-500 hover:underline gap-1"
              >
                Get free Mapbox token
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
      
      {/* Map error message */}
      {mapError && isTokenValid && (
        <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-md shadow-lg z-20 flex items-center">
          <span>{mapError}</span>
          <Button variant="link" onClick={showTokenDialog} className="ml-2 p-0 h-auto text-red-700">
            Update Token
          </Button>
        </div>
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
          <div className="animate-pulse-soft text-primary">Loading map data...</div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapContainer} className="h-full w-full bg-blue-50" />
      
      {/* Map settings button */}
      <Button 
        variant="outline" 
        size="sm" 
        className="absolute top-3 left-3 z-10 bg-white"
        onClick={showTokenDialog}
      >
        <Settings className="h-4 w-4 mr-2" />
        Map Settings
      </Button>
    </div>
  );
};

export default GamingTableMap;
