import { useState, useEffect, useRef } from "react";
import { GamingTable } from "@/services/gamingTableData";
import { useNavigate } from "react-router-dom";
import { Dices, MapPin, Settings } from "lucide-react";
import MapboxMap from "@/components/MapboxMap";
import { useMapToken } from "./MapTokenProvider";
import MapTokenDialog from "./MapTokenDialog";
import { Button } from "@/components/ui/button";
import "./map-styles.css";

interface GamingTableMapProps {
  // Update to match the return type of getAllAvailableTables
  gamingTables: (GamingTable & { 
    venueId?: string, 
    venueName?: string, 
    distance?: number, 
    rating?: number 
  })[];
  isLoading?: boolean;
}

// Component can switch between mock map and real MapBox implementation
const GamingTableMap = ({ gamingTables, isLoading = false }: GamingTableMapProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { isTokenSet } = useMapToken();
  const [useRealMap, setUseRealMap] = useState(true);
  const [tokenDialogOpen, setTokenDialogOpen] = useState(false);
  
  // Convert longitude, latitude to X, Y positions on our mock map (used when real map fails)
  const getPositionFromCoordinates = (coords: [number, number]) => {
    // Barcelona coordinates as center reference point (approx)
    const centerLng = 2.1734; 
    const centerLat = 41.3851;
    
    // Scale factors - adjust these to control sensitivity of map movements
    // These are arbitrary values that work for our mock map display
    const lngScale = 1200; // Controls horizontal spread (higher value for Barcelona's smaller area)
    const latScale = 1000; // Controls vertical spread (higher value for Barcelona's smaller area)
    
    // Calculate percentage position within our map view
    // We add an offset to make the positions more centered on the map
    const x = 50 + ((coords[0] - centerLng) * lngScale);
    const y = 50 - ((coords[1] - centerLat) * latScale); // Invert Y since map coordinates go from bottom to top
    
    // Keep within bounds (10-90% of container to avoid edges)
    const boundedX = Math.max(10, Math.min(90, x));
    const boundedY = Math.max(10, Math.min(90, y));
    
    return { posX: `${boundedX}%`, posY: `${boundedY}%` };
  };

  // Position gaming tables on the map
  const positionGamingTables = () => {
    if (!gamingTables || !Array.isArray(gamingTables)) {
      return [];
    }
    
    return gamingTables.map(table => {
      // Use real coordinates if available, otherwise fall back to an algorithm
      let posX = "50%";
      let posY = "50%";
      
      if (table.location && table.location.coordinates) {
        const position = getPositionFromCoordinates(table.location.coordinates);
        posX = position.posX;
        posY = position.posY;
      } else {
        // Fall back to our previous algorithm for tables without coordinates
        const idSum = table.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        posX = `${(idSum % 80) + 10}%`;
        posY = `${((idSum * 7) % 80) + 10}%`;
      }
      
      return { ...table, posX, posY };
    });
  };

  const positionedGamingTables = positionGamingTables();

  const handleMarkerClick = (id: string) => {
    setSelectedId(id);
  };

  // Clear selection when gaming tables change
  useEffect(() => {
    setSelectedId(null);
  }, [gamingTables]);
  
  // Dynamically add CSS for marker positions
  useEffect(() => {
    if (!positionedGamingTables) return;
    
    // Create style element if it doesn't exist
    let styleEl = document.getElementById('dynamic-marker-styles');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'dynamic-marker-styles';
      document.head.appendChild(styleEl);
    }
    
    // Generate CSS rules for each marker
    const cssRules = positionedGamingTables.map(table => 
      `.custom-marker-${table.id} {
        top: ${table.posY};
        left: ${table.posX};
      }`
    ).join('\n');
    
    // Update style element
    styleEl.textContent = cssRules;
    
    // Clean up on unmount
    return () => {
      if (styleEl && document.head.contains(styleEl)) {
        document.head.removeChild(styleEl);
      }
    };
  }, [positionedGamingTables]);

  // Switch between real MapBox map and mock map
  return (
    <div className="map-container relative bg-blue-50 overflow-hidden">
      {/* Use the real MapBox map when token is available and useRealMap is true */}
      {isTokenSet && useRealMap ? (
        <MapboxMap 
          gamingTables={gamingTables} 
          isLoading={isLoading}
          // Default center to Barcelona
          center={[2.1734, 41.3851]} 
          zoom={13}
        />
      ) : (
        <>
          {/* Mock map background - fallback when MapBox isn't available */}
      {/* Mock map background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100">
        {/* Mock streets */}
        <div className="absolute top-1/4 left-0 right-0 h-1 bg-gray-200"></div>
        <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-200"></div>
        <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-gray-200"></div>
        
        {/* Mock buildings */}
        <div className="absolute top-[15%] left-[10%] w-[15%] h-[20%] bg-gray-100 rounded-sm"></div>
        <div className="absolute top-[45%] left-[20%] w-[10%] h-[15%] bg-gray-100 rounded-sm"></div>
        <div className="absolute top-[20%] left-[60%] w-[25%] h-[10%] bg-gray-100 rounded-sm"></div>
        <div className="absolute top-[60%] left-[55%] w-[15%] h-[25%] bg-gray-100 rounded-sm"></div>
        <div className="absolute top-[40%] left-[85%] w-[10%] h-[10%] bg-gray-100 rounded-sm"></div>
      </div>

          {/* Barcelona Indicator with Enhanced Mode Toggle */}
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={() => {
                // Toggle advanced Barcelona mode
                localStorage.setItem("barcelonaAdvancedMode", 
                  localStorage.getItem("barcelonaAdvancedMode") === "true" ? "false" : "true");
                // Force re-render (in a real app, use state)
                window.location.reload();
              }}
              className="barcelona-indicator cursor-pointer hover:bg-yellow-200"
            >
              <MapPin className="h-3 w-3" /> Barcelona Mode
            </button>
          </div>

          {/* Banner about upgrading to Mapbox */}
          <div className="absolute top-2 left-2 right-20 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-center shadow-sm">
            {isTokenSet ? 
              <div className="flex flex-col gap-1">
                <p>Using Barcelona mock map. Click below to use real MapBox for accurate geographic display.</p>
                <button 
                  onClick={() => setUseRealMap(true)}
                  className="text-xs bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                >
                  Switch to MapBox
                </button>
              </div>
              : 
              <div className="flex flex-col gap-1">
                <p>Set a valid MapBox token to enable real Barcelona maps.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setTokenDialogOpen(true)}
                  className="text-xs"
                >
                  <Settings className="h-3 w-3 mr-1" /> 
                  Configure MapBox Token
                </Button>
              </div>
            }
          </div>
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
          <div className="animate-pulse-soft text-primary">Loading map data...</div>
        </div>
      )}
      
      {/* User location (center of map) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="absolute -inset-4 bg-primary/20 rounded-full animate-pulse-soft"></div>
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-white"></div>
        </div>
      </div>
      
      {/* Table markers */}
      {positionedGamingTables.map((gamingTable) => {
        const isSelected = selectedId === gamingTable.id;
        const isAvailable = gamingTable.availability.status === "available";
        const color = isAvailable ? "text-green-500" : "text-amber-500";
        const size = isSelected ? "scale-125" : "scale-100";
        
        return (
          <div
            key={gamingTable.id}
            className={`absolute cursor-pointer transition-all ${size}`}
            style={{ top: gamingTable.posY, left: gamingTable.posX }}
            onClick={() => handleMarkerClick(gamingTable.id)}
          >
            <div className="relative flex items-center justify-center">
              {isSelected && (
                <div className="absolute -inset-3 bg-primary/20 rounded-full animate-pulse-soft"></div>
              )}
              <div className={`${color} bg-white p-1 rounded-full shadow-md`}>
                <Dices className="h-5 w-5" />
              </div>
              
              {isSelected && (
                <div className="absolute top-full mt-2 bg-white p-2 rounded-lg shadow-lg w-48 z-10">
                  <div className="text-xs font-medium">{gamingTable.name}</div>
                  {gamingTable.venueName && (
                    <div className="text-xs text-muted-foreground">{gamingTable.venueName}</div>
                  )}
                  {gamingTable.distance !== undefined && (
                    <div className="text-xs text-muted-foreground mt-0.5">{gamingTable.distance}m away</div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    {gamingTable.rating !== undefined && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs">{gamingTable.rating}</span>
                        <span className="text-yellow-500 text-xs">★</span>
                      </div>
                    )}
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/gamingTable/${gamingTable.id}`);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
        </>
      )}
      
      {/* MapBox Token Dialog */}
      <MapTokenDialog 
        isOpen={tokenDialogOpen} 
        onClose={() => setTokenDialogOpen(false)}
      />
    </div>
  );
};

export default GamingTableMap;
