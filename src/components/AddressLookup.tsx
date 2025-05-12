
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { geocodeAddress } from "@/services/geocodingService";
import { Loader2, MapPin, Search } from "lucide-react";
import { useMapToken } from "./MapTokenProvider";
import { toast } from "sonner";

interface AddressLookupProps {
  onSelectLocation: (address: string, coordinates: [number, number]) => void;
  placeholder?: string;
  defaultValue?: string;
}

export const AddressLookup = ({ 
  onSelectLocation, 
  placeholder = "Search for an address",
  defaultValue = ""
}: AddressLookupProps) => {
  const [address, setAddress] = useState(defaultValue);
  const [isLoading, setIsLoading] = useState(false);
  const { mapboxToken, showTokenDialog, isTokenValid } = useMapToken();

  const lookupAddress = async () => {
    if (!address.trim()) return;
    
    if (!mapboxToken) {
      toast.error("Mapbox token is required for address lookup");
      showTokenDialog();
      return;
    }
    
    if (!isTokenValid) {
      toast.error("Your Mapbox token appears to be invalid. Please update it.");
      showTokenDialog();
      return;
    }
    
    setIsLoading(true);
    try {
      const coordinates = await geocodeAddress(address, mapboxToken);
      if (coordinates) {
        onSelectLocation(address, coordinates);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      lookupAddress();
    }
  };

  return (
    <div className="relative w-full">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder={placeholder}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-9"
          />
        </div>
        <Button 
          onClick={lookupAddress} 
          disabled={isLoading || !address.trim()}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};

export default AddressLookup;
