import { useState, useEffect } from "react";
import { GamingTable } from "@/services/gamingTableData";
import { useNavigate } from "react-router-dom";
import { Dices, MapPin } from "lucide-react";

interface GamingTableMapProps {
  // Update to match the return type of getAllAvailableTables
  gamingTables: (GamingTable & { venueId?: string, venueName?: string, distance?: number, rating?: number })[];
  isLoading?: boolean;
}

// Simple mock map component (in a real app we'd use a real map library)
const GamingTableMap = ({ gamingTables, isLoading = false }: GamingTableMapProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Position gaming tables on the "map"
  const positionGamingTables = () => {
    // Add explicit null/undefined check with fallback to empty array
    if (!gamingTables || !Array.isArray(gamingTables)) {
      return [];
    }
    
    return gamingTables.map(gamingTable => {
      // Create a deterministic but somewhat random position based on the gaming table id
      const idSum = gamingTable.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const x = (idSum % 80) + 10; // Keep within 10-90% of width
      const y = ((idSum * 7) % 80) + 10; // Different pattern for y, also 10-90%
      
      return { ...gamingTable, posX: `${x}%`, posY: `${y}%` };
    });
  };

  const positionedGamingTables = positionGamingTables();

  const handleMarkerClick = (id: string) => {
    setSelectedId(id);
    // Optional: navigate to gaming table detail
    // navigate(`/gamingTable/${id}`);
  };

  // Clear selection when gaming tables change
  useEffect(() => {
    setSelectedId(null);
  }, [gamingTables]);

  return (
    <div className="map-container relative bg-blue-50 overflow-hidden">
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
      
      {/* Table markers - Updated to handle possibly missing properties */}
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
                  {/* Show venue name if it exists */}
                  {gamingTable.venueName && (
                    <div className="text-xs text-muted-foreground">{gamingTable.venueName}</div>
                  )}
                  {/* Only show distance if it exists */}
                  {gamingTable.distance !== undefined && (
                    <div className="text-xs text-muted-foreground mt-0.5">{gamingTable.distance}m away</div>
                  )}
                  <div className="flex justify-between items-center mt-1">
                    {/* Only show rating if it exists */}
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
    </div>
  );
};

export default GamingTableMap;
