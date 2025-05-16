
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface MapTokenRequestProps {
  hasToken: boolean;
  onRequestToken: () => void;
}

export const MapTokenRequest = ({ hasToken, onRequestToken }: MapTokenRequestProps) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 backdrop-blur-sm z-50 p-4">
      <div className="bg-background rounded-lg shadow-lg p-6 max-w-md text-center">
        <h3 className="text-lg font-semibold mb-2">
          {!hasToken ? "Mapbox Token Required" : "Invalid Mapbox Token"}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {!hasToken 
            ? "To display the map, please set your Mapbox token."
            : "Your current Mapbox token is invalid. Please update it."}
        </p>
        <div className="space-y-4">
          <Button onClick={onRequestToken} className="w-full">
            {!hasToken ? "Set Mapbox Token" : "Update Token"}
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
  );
};

export default MapTokenRequest;
