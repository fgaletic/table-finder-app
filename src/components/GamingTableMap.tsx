
import { useState } from "react";
import { GamingTable } from "@/services/gamingTableData";
import { Settings } from "lucide-react";
import { useMapToken } from "./MapTokenProvider";
import { Button } from "./ui/button";
import MapContainer from "./map/MapContainer";
import MapTokenRequest from "./map/MapTokenRequest";
import MapError from "./map/MapError";

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
