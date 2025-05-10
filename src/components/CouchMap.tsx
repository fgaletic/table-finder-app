import { useState, useEffect } from "react";
import { Couch } from "@/services/couchData";
import { useNavigate } from "react-router-dom";
import { Sofa, MapPin } from "lucide-react";

interface CouchMapProps {
  couches: Couch[];
  isLoading?: boolean;
}

// Simple mock map component (in a real app we'd use a real map library)
const CouchMap = ({ couches, isLoading = false }: CouchMapProps) => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Position couches on the "map"
  const positionCouches = () => {
    return couches.map(couch => {
      // Create a deterministic but somewhat random position based on the couch id
      const idSum = couch.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const x = (idSum % 80) + 10; // Keep within 10-90% of width
      const y = ((idSum * 7) % 80) + 10; // Different pattern for y, also 10-90%
      
      return { ...couch, posX: `${x}%`, posY: `${y}%` };
    });
  };

  const positionedCouches = positionCouches();

  const handleMarkerClick = (id: string) => {
    setSelectedId(id);
    // Optional: navigate to couch detail
    // navigate(`/couch/${id}`);
  };

  // Clear selection when couches change
  useEffect(() => {
    setSelectedId(null);
  }, [couches]);

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
      
      {/* Couch markers */}
      {positionedCouches.map((couch) => {
        const isSelected = selectedId === couch.id;
        const isAvailable = couch.availability.status === "available";
        const color = isAvailable ? "text-green-500" : "text-amber-500";
        const size = isSelected ? "scale-125" : "scale-100";
        
        return (
          <div
            key={couch.id}
            className={`absolute cursor-pointer transition-all ${size}`}
            style={{ top: couch.posY, left: couch.posX }}
            onClick={() => handleMarkerClick(couch.id)}
          >
            <div className="relative flex items-center justify-center">
              {isSelected && (
                <div className="absolute -inset-3 bg-primary/20 rounded-full animate-pulse-soft"></div>
              )}
              <div className={`${color} bg-white p-1 rounded-full shadow-md`}>
                <Sofa className="h-5 w-5" />
              </div>
              
              {isSelected && (
                <div className="absolute top-full mt-2 bg-white p-2 rounded-lg shadow-lg w-48 z-10">
                  <div className="text-xs font-medium">{couch.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{couch.distance}m away</div>
                  <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-1">
                      <span className="text-xs">{couch.rating}</span>
                      <span className="text-yellow-500 text-xs">★</span>
                    </div>
                    <button
                      className="text-xs text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/couch/${couch.id}`);
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

export default CouchMap;
