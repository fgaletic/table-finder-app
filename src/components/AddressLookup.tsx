
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { geocodeAddress } from "@/services/geocodingService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Loader2, MapPin, Search } from "lucide-react";
import { useMapToken } from "@/components/MapTokenProvider";

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
  const [suggestions, setSuggestions] = useState<Array<{ place_name: string, center: [number, number] }>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { mapboxToken } = useMapToken(); // Get the MapBox token from context

  const lookupAddress = async () => {
    if (!address.trim()) return;
    
    setIsLoading(true);
    try {
      // Use the Mapbox geocoding API with our token from the provider
      const coordinates = await geocodeAddress(address, mapboxToken);
      if (coordinates) {
        onSelectLocation(address, coordinates);
        setIsOpen(false);
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
