
import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { toast } from "sonner";
import { ExternalLink } from "lucide-react";

interface MapTokenContextType {
  mapboxToken: string | null;
  setMapboxToken: (token: string) => void;
  isTokenSet: boolean;
  isTokenValid: boolean;
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
}

export const MapTokenProvider = ({ 
  children
}: MapTokenProviderProps) => {
  // Try to get token from localStorage first
  const storedToken = typeof window !== "undefined" ? localStorage.getItem("mapboxToken") : null;
  
  const [mapboxToken, setMapboxTokenState] = useState<string | null>(storedToken);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(!storedToken);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);

  const setMapboxToken = (token: string) => {
    // Skip empty tokens
    if (!token.trim()) {
      toast.error("Please enter a valid Mapbox token");
      return;
    }
    
    // Store token in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("mapboxToken", token);
    }
    setMapboxTokenState(token);
    toast.success("Mapbox token updated successfully! Validating token...");
    
    // Attempt to validate the token
    validateMapboxToken(token);
  };

  // Function to validate mapbox token
  const validateMapboxToken = async (token: string) => {
    try {
      // Try to fetch a style to test the token
      const response = await fetch(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v11?access_token=${token}`
      );
      
      if (response.ok) {
        setIsTokenValid(true);
        toast.success("Mapbox token is valid!");
      } else {
        setIsTokenValid(false);
        toast.error("Invalid Mapbox token. Please check and try again.");
      }
    } catch (error) {
      setIsTokenValid(false);
      toast.error("Error validating Mapbox token. Please check your network connection.");
    }
  };

  // Validate token on mount
  useEffect(() => {
    if (mapboxToken) {
      validateMapboxToken(mapboxToken);
    }
  }, []);

  const showTokenDialog = () => {
    setIsDialogOpen(true);
  };

  const isTokenSet = !!mapboxToken;

  return (
    <MapTokenContext.Provider value={{ 
      mapboxToken, 
      setMapboxToken, 
      isTokenSet, 
      isTokenValid, 
      showTokenDialog 
    }}>
      {children}
      <TokenDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
        currentToken={mapboxToken || ""}
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Set Mapbox Token</DialogTitle>
          <DialogDescription>
            A Mapbox token is required to display maps in this application.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <p className="text-sm">
                Enter your Mapbox access token. You can get one for free by signing up at Mapbox.
              </p>
              <Input
                id="token"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNr..."
                className="w-full"
              />
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <a 
                  href="https://account.mapbox.com/access-tokens/"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-500 hover:underline"
                >
                  Get a free token from Mapbox
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Note: Your token will be stored in your browser's localStorage. Use a public (pk) token, never share your secret tokens.
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
