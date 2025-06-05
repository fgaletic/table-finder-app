import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMapToken } from "./MapTokenProvider";
import { ExternalLink } from "lucide-react";

interface MapTokenDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MapTokenDialog = ({ open, onOpenChange }: MapTokenDialogProps) => {
  const { mapboxToken, setMapboxToken } = useMapToken();
  const [tokenInput, setTokenInput] = useState(mapboxToken);

  const handleSave = () => {
    setMapboxToken(tokenInput);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>MapBox API Token</DialogTitle>
          <DialogDescription>
            Set your MapBox API token to enable real map functionality.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <label htmlFor="token" className="text-sm font-medium">
                Your MapBox Token
              </label>          <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs flex items-center gap-1 text-blue-500 hover:text-blue-700"
              >
                Get a token <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <Input
              id="token"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsI..."
              className="font-mono text-xs"
            />
            <div className="text-xs text-muted-foreground mt-2 space-y-1">
              <p>Use a public token with the following scopes:</p>
              <ul className="list-disc list-inside ml-1">
                <li>Styles:read</li>
                <li>Fonts:read</li>
                <li>Vision:read</li>
                <li>Geocoding:read</li>
              </ul>
              <p className="text-xs mt-2">
                Create a free account at <a href="https://www.mapbox.com/signup" className="text-blue-500 underline hover:text-blue-700">mapbox.com</a>
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Token</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MapTokenDialog;
