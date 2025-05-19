
import React, { createContext, useState, useContext, ReactNode } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { toast } from "sonner";

interface MapTokenContextType {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  isTokenSet: boolean;
  showTokenDialog: () => void;
}

const MapTokenContext = createContext<MapTokenContextType | undefined>(undefined);

export const useMapToken = () => {
  const context = useContext(MapTokenContext);
  if (!context) {
    throw new Error("useMapToken must be used within a MapTokenProvider");
  }
  return context;
};

interface MapTokenProviderProps {
  children: ReactNode;
  defaultToken?: string;
}

// This is a fallback public token for demo purposes
// In production, you should use your own token or fetch from environment variables
const DEMO_TOKEN = "pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNsazE0dGVnbDBhYXYzZGticDdkZjRnb3YifQ.lb4OjDvAFznA3fCebOgSng";

export const MapTokenProvider = ({ 
  children, 
  defaultToken = DEMO_TOKEN 
}: MapTokenProviderProps) => {
  // Try to get token from localStorage first
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("mapboxToken") : null;
  
  const [mapboxToken, setMapboxTokenState] = useState<string>(storedToken || defaultToken);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const setMapboxToken = (token: string) => {
    // Store token in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("mapboxToken", token);
    }
    setMapboxTokenState(token);
    toast.success("Mapbox token updated successfully!");
  };

  const showTokenDialog = () => {
    setIsDialogOpen(true);
  };

  const isTokenSet = mapboxToken !== "";

  return (
    <MapTokenContext.Provider value={{ mapboxToken, setMapboxToken, isTokenSet, showTokenDialog }}>
      {children}
      <TokenDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        currentToken={mapboxToken}
        onSubmit={setMapboxToken}
      />
    </MapTokenContext.Provider>
  );
};

interface TokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentToken: string;
  onSubmit: (token: string) => void;
}

const TokenDialog = ({ isOpen, onClose, currentToken, onSubmit }: TokenDialogProps) => {
  const [token, setToken] = useState(currentToken);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(token);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Mapbox Token</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Enter your Mapbox public token. You can find this in your Mapbox account dashboard.
              </p>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter Mapbox token"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Note: Your token will be stored in localStorage. A demo token is provided but may have usage limits.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save Token</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MapTokenProvider;
