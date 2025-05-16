
import { useState, useEffect } from "react";
import { GamingTable } from "@/services/gamingTableData";
import { Settings } from "lucide-react";
import { useMapToken } from "./MapTokenProvider";
import { Button } from "./ui/button";
import MapContainer from "./map/MapContainer";
import MapTokenRequest from "./map/MapTokenRequest";
import MapError from "./map/MapError";
import { toast } from "sonner";

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
  const { mapboxToken, showTokenDialog, isTokenValid } = useMapToken();
  const [mapError, setMapError] = useState<string | null>(null);
  
  // Log tables data for debugging
  useEffect(() => {
    console.log("GamingTableMap received tables:", gamingTables.length);
    console.log("First table sample:", gamingTables.length > 0 ? 
      JSON.stringify({
        id: gamingTables[0].id,
        name: gamingTables[0].name,
        location: gamingTables[0].location
      }) : "No tables");
    
    if (!mapboxToken) {
      console.log("No Mapbox token available. Map won't render.");
    } else if (!isTokenValid) {
      console.log("Mapbox token is invalid. Map won't render properly.");
    }
    
    // Check if tables have valid coordinates
    const tablesWithCoordinates = gamingTables.filter(
      table => table.location && table.location.coordinates
    );
    
    if (tablesWithCoordinates.length === 0 && gamingTables.length > 0) {
      toast.error("No tables have valid coordinates to display on the map.");
    }
  }, [gamingTables, mapboxToken, isTokenValid]);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg">
      {/* If no token is set or token is invalid, show token request banner */}
      {(!mapboxToken || !isTokenValid) && (
        <MapTokenRequest
          hasToken={!!mapboxToken}
          onRequestToken={showTokenDialog}
        />
      )}
      
      {/* Map error message */}
      {mapError && isTokenValid && (
        <MapError
          errorMessage={mapError}
          onUpdateToken={showTokenDialog}
        />
      )}
      
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-20">
          <div className="animate-pulse-soft text-primary">Loading map data...</div>
        </div>
      )}
      
      {/* Map container */}
      {mapboxToken && isTokenValid && (
        <MapContainer
          gamingTables={gamingTables}
          mapboxToken={mapboxToken}
          onError={setMapError}
        />
      )}
      
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
