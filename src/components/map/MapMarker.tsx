
import { useEffect, useState } from "react";
import mapboxgl from 'mapbox-gl';
import { GamingTable } from "@/services/gamingTableData";

interface MapMarkerProps {
  table: GamingTable & { 
    venueId?: string, 
    venueName?: string, 
    distance?: number, 
    rating?: number 
  };
  map: mapboxgl.Map;
  onMarkerClick: (tableId: string) => void;
  isSelected: boolean;
}

export const MapMarker = ({ table, map, onMarkerClick, isSelected }: MapMarkerProps) => {
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const [popup, setPopup] = useState<mapboxgl.Popup | null>(null);
  
  useEffect(() => {
    if (!map || !table.location || !table.location.coordinates) return;
    
    // Create a popup
    const newPopup = new mapboxgl.Popup({ offset: 25, closeButton: false })
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
    
    setPopup(newPopup);
    
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
    const newMarker = new mapboxgl.Marker(el)
      .setLngLat(table.location.coordinates)
      .addTo(map);
    
    setMarker(newMarker);
    
    // Event listeners
    el.addEventListener('mouseenter', () => {
      newPopup.addTo(map);
    });
    
    el.addEventListener('mouseleave', () => {
      if (!isSelected) {
        newPopup.remove();
      }
    });
    
    el.addEventListener('click', () => {
      onMarkerClick(table.id);
    });

    // Show popup if selected
    if (isSelected) {
      newPopup.addTo(map);
    }

    return () => {
      newMarker.remove();
      newPopup.remove();
    };
  }, [map, table, onMarkerClick, isSelected]);

  // Update popup visibility when selection state changes
  useEffect(() => {
    if (!popup || !map) return;
    
    if (isSelected) {
      popup.addTo(map);
    } else {
      popup.remove();
    }
  }, [isSelected, popup, map]);

  return null; // This is a non-visual component
};

// Helper function to get marker color based on availability status
function getMarkerColor(status: string): string {
  switch (status) {
    case 'available': return '#10b981'; // green
    case 'occupied': return '#f59e0b'; // amber
    case 'maintenance': return '#ef4444'; // red
    default: return '#6b7280'; // gray
  }
}

export default MapMarker;
