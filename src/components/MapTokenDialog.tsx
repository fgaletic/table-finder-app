import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMapToken } from './MapTokenProvider';
import { toast } from 'sonner';
import { MapPin, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

interface MapTokenDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const MapTokenDialog: React.FC<MapTokenDialogProps> = ({ isOpen, onClose }) => {
  const { mapboxToken, setMapboxToken } = useMapToken();
  const [tokenInput, setTokenInput] = useState(mapboxToken);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'valid' | 'invalid' | null>(null);

  // Validate MapBox token by making a simple API call
  // NOTE: In production, consider server-side validation to avoid token exposure in URLs
  const validateToken = async (token: string): Promise<boolean> => {
    if (!token || !token.startsWith('pk.')) {
      return false;
    }

    try {
      // Using GET request for simplicity in demo - in production, use server-side validation
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/barcelona.json?access_token=${token}&limit=1`
      );
      return response.ok;
    } catch {
      return false;
    }
  };

  const handleValidateToken = async () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter a MapBox token');
      return;
    }

    setIsValidating(true);
    setValidationResult(null);

    const isValid = await validateToken(tokenInput.trim());
    
    setValidationResult(isValid ? 'valid' : 'invalid');
    setIsValidating(false);

    if (isValid) {
      toast.success('MapBox token validated successfully!');
    } else {
      toast.error('Invalid MapBox token. Please check your token and try again.');
    }
  };

  const handleSave = () => {
    if (!tokenInput.trim()) {
      toast.error('Please enter a MapBox token');
      return;
    }

    if (validationResult !== 'valid') {
      toast.error('Please validate your token before saving');
      return;
    }

    setMapboxToken(tokenInput.trim());
    toast.success('MapBox token saved! You can now use the Barcelona map.');
    onClose();
  };

  const handleClear = () => {
    setTokenInput('');
    setValidationResult(null);
    setMapboxToken('');
    toast.info('MapBox token cleared');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <DialogTitle>Configure MapBox Token</DialogTitle>
          </div>
          <DialogDescription>
            Add your MapBox access token to enable real Barcelona maps with accurate locations.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="token">MapBox Access Token</Label>
            <div className="relative">
              <Input
                id="token"
                type="password"
                placeholder="pk.eyJ1IjoieW91ci11c2VybmFtZSIsImEi..."
                value={tokenInput}
                onChange={(e) => {
                  setTokenInput(e.target.value);
                  setValidationResult(null);
                }}
                className="pr-10"
              />
              {validationResult && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {validationResult === 'valid' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleValidateToken}
              variant="outline"
              size="sm"
              disabled={isValidating || !tokenInput.trim()}
            >
              {isValidating ? 'Validating...' : 'Validate Token'}
            </Button>
            
            <Button
              onClick={handleClear}
              variant="outline"
              size="sm"
              disabled={!tokenInput}
            >
              Clear
            </Button>
          </div>

          {validationResult === 'valid' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Token is valid!</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Your MapBox token has been validated and can access Barcelona geocoding services.
              </p>
            </div>
          )}

          {validationResult === 'invalid' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Token validation failed</span>
              </div>
              <p className="text-xs text-red-700 mt-1">
                Please check that your token is correct and has the required scopes.
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h4 className="text-sm font-medium text-blue-900 mb-2">How to get a MapBox token:</h4>
            <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
              <li>Sign up at <a href="https://mapbox.com/signup" target="_blank" rel="noopener noreferrer" className="underline inline-flex items-center gap-1">mapbox.com <ExternalLink className="h-3 w-3" /></a></li>
              <li>Go to your account dashboard</li>
              <li>Create a token with these scopes:</li>
              <ul className="ml-4 mt-1 space-y-0.5 list-disc list-inside">
                <li>Styles:read</li>
                <li>Fonts:read</li>
                <li>Vision:read</li>
                <li>Geocoding:read</li>
              </ul>
            </ol>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={validationResult !== 'valid' || !tokenInput.trim()}
          >
            Save Token
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MapTokenDialog;
