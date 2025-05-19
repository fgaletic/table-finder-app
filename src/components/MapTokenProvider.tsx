
import React, { createContext, useState, useContext, ReactNode } from "react";

interface MapTokenContextType {
  mapboxToken: string;
  setMapboxToken: (token: string) => void;
  isTokenSet: boolean;
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

  const setMapboxToken = (token: string) => {
    // Store token in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("mapboxToken", token);
    }
    setMapboxTokenState(token);
  };

  const isTokenSet = mapboxToken !== "";

  return (
    <MapTokenContext.Provider value={{ mapboxToken, setMapboxToken, isTokenSet }}>
      {children}
    </MapTokenContext.Provider>
  );
};

export default MapTokenProvider;
