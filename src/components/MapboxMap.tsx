import React, { useCallback, useState, useRef, useEffect } from 'react';
import Map, { Marker, Popup, NavigationControl, GeolocateControl, MapRef } from 'react-map-gl';
import { GamingTable } from '@/services/gamingTableData';
import { useMapToken } from './MapTokenProvider';
import { Dices, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxMapProps {
  gamingTables: GamingTable[];
  center?: [number, number];
  zoom?: number;
  isLoading?: boolean;
}

// Barcelona-specific map settings
const BARCELONA_CENTER: [number, number] = [2.1734, 41.3851]; // Plaça de Catalunya
const BARCELONA_BOUNDS = {
  southwest: [2.05, 41.30] as [number, number],
  northeast: [2.30, 41.50] as [number, number]
};

const MapboxMap: React.FC<MapboxMapProps> = ({
  gamingTables,
  center = BARCELONA_CENTER,
  zoom = 13,
  isLoading = false
}) => {
  const { mapboxToken } = useMapToken();
  const navigate = useNavigate();
  const mapRef = useRef<MapRef>(null);
  
  const [selectedTable, setSelectedTable] = useState<GamingTable | null>(null);
  const [viewState, setViewState] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  });

  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/streets-v12');
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  // Handle map errors gracefully
  const onError = useCallback((error: Error) => {
    console.error('MapBox error:', error);
    toast.error('Map failed to load. Check your MapBox token.');
  }, []);

  // Handle map load
  const onLoad = useCallback(() => {
    setIsMapLoaded(true);
    toast.success('Barcelona map loaded successfully!');
  }, []);

  // Fit map to Barcelona bounds on load
  useEffect(() => {
    if (isMapLoaded && mapRef.current) {
      const map = mapRef.current.getMap();
      map.fitBounds([BARCELONA_BOUNDS.southwest, BARCELONA_BOUNDS.northeast], {
        padding: 50,
        duration: 1000
      });
    }
  }, [isMapLoaded]);

  // Handle marker click
  const handleMarkerClick = useCallback((table: GamingTable) => {
    setSelectedTable(table);
    // Center map on selected table
    setViewState(prev => ({
      ...prev,
      longitude: table.location?.coordinates[0] || BARCELONA_CENTER[0],
      latitude: table.location?.coordinates[1] || BARCELONA_CENTER[1],
      zoom: Math.max(prev.zoom, 15)
    }));
  }, []);

  // Handle popup close
  const handlePopupClose = useCallback(() => {
    setSelectedTable(null);
  }, []);

  // Navigate to table details
  const handleViewDetails = useCallback((tableId: string) => {
    navigate(`/gamingTable/${tableId}`);
    setSelectedTable(null);
  }, [navigate]);

  // Validate coordinates are in Barcelona area
  const isInBarcelona = (coords: [number, number]): boolean => {
    const [lng, lat] = coords;
    return (
      lng >= BARCELONA_BOUNDS.southwest[0] && 
      lng <= BARCELONA_BOUNDS.northeast[0] && 
      lat >= BARCELONA_BOUNDS.southwest[1] && 
      lat <= BARCELONA_BOUNDS.northeast[1]
    );
  };

  // Filter tables to only show those in Barcelona
  const barcelonaTables = gamingTables.filter(table => 
    table.location && isInBarcelona(table.location.coordinates)
  );

  // Map style options
  const mapStyles = [
    { id: 'streets-v12', name: 'Streets' },
    { id: 'outdoors-v12', name: 'Outdoors' },
    { id: 'light-v11', name: 'Light' },
    { id: 'dark-v11', name: 'Dark' }
  ];

  if (!mapboxToken) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-6">
          <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">MapBox Token Required</h3>
          <p className="text-gray-500 text-sm">
            Set a valid MapBox token to view the Barcelona gaming table map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={mapboxToken}
        mapStyle={`mapbox://styles/mapbox/${mapStyle}`}
        onError={onError}
        onLoad={onLoad}
        attributionControl={false}
        logoPosition="bottom-left"
        maxBounds={[BARCELONA_BOUNDS.southwest, BARCELONA_BOUNDS.northeast]}
        className="w-full h-full"
      >
        {/* Navigation Controls */}
        <NavigationControl position="top-right" />
        <GeolocateControl
          position="top-right"
          trackUserLocation={true}
          showUserHeading={true}
        />

        {/* Gaming Table Markers */}
        {barcelonaTables.map((table) => (
          <Marker
            key={table.id}
            longitude={table.location!.coordinates[0]}
            latitude={table.location!.coordinates[1]}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              handleMarkerClick(table);
            }}
          >
            <div className="relative cursor-pointer transform hover:scale-110 transition-transform">
              <div className={`p-2 rounded-full shadow-lg ${
                table.availability.status === 'available'
                  ? 'bg-green-500 hover:bg-green-600'
                  : table.availability.status === 'occupied'
                  ? 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-red-500 hover:bg-red-600'
              }`}>
                <Dices className="h-5 w-5 text-white" />
              </div>
              {/* Availability indicator */}
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                table.availability.status === 'available'
                  ? 'bg-green-400'
                  : table.availability.status === 'occupied'
                  ? 'bg-amber-400'
                  : 'bg-red-400'
              }`} />
            </div>
          </Marker>
        ))}

        {/* Selected Table Popup */}
        {selectedTable && selectedTable.location && (
          <Popup
            longitude={selectedTable.location.coordinates[0]}
            latitude={selectedTable.location.coordinates[1]}
            onClose={handlePopupClose}
            closeButton={true}
            closeOnClick={false}
            className="gaming-table-popup"
          >
            <div className="p-3 max-w-sm">
              <h3 className="font-semibold text-sm mb-1">{selectedTable.name}</h3>
              
              {selectedTable.description && (
                <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                  {selectedTable.description}
                </p>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  selectedTable.availability.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : selectedTable.availability.status === 'occupied'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {selectedTable.availability.status.charAt(0).toUpperCase() + selectedTable.availability.status.slice(1)}
                  {selectedTable.availability.until && ` until ${selectedTable.availability.until}`}
                </span>
                
                {selectedTable.rating && (
                  <div className="flex items-center text-xs">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1">{selectedTable.rating}</span>
                  </div>
                )}
              </div>

              {selectedTable.distance !== undefined && (
                <p className="text-xs text-gray-500 mb-2">
                  <Navigation className="h-3 w-3 inline mr-1" />
                  {selectedTable.distance}m from city center
                </p>
              )}
              
              <button
                onClick={() => handleViewDetails(selectedTable.id)}
                className="w-full bg-primary text-primary-foreground text-xs py-2 px-3 rounded-md hover:bg-primary/90 transition-colors"
              >
                View Details
              </button>
            </div>
          </Popup>
        )}

        {/* Map Style Selector */}
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2">
          <select
            value={mapStyle}
            onChange={(e) => setMapStyle(e.target.value)}
            className="text-xs border-none outline-none bg-transparent"
          >
            {mapStyles.map((style) => (
              <option key={style.id} value={style.id}>
                {style.name}
              </option>
            ))}
          </select>
        </div>

        {/* Loading overlay */}
        {(isLoading || !isMapLoaded) && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Loading Barcelona map...</span>
              </div>
            </div>
          </div>
        )}

        {/* Barcelona info badge */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
          <div className="flex items-center space-x-2 text-xs">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="font-medium">Barcelona Gaming Tables</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-600">{barcelonaTables.length} locations</span>
          </div>
        </div>
      </Map>
    </div>
  );
};

export default MapboxMap;
