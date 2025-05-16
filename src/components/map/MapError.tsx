
import { Button } from "@/components/ui/button";

interface MapErrorProps {
  errorMessage: string;
  onUpdateToken: () => void;
}

export const MapError = ({ errorMessage, onUpdateToken }: MapErrorProps) => {
  return (
    <div className="absolute top-14 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-700 px-4 py-2 rounded-md shadow-lg z-20 flex items-center">
      <span>{errorMessage}</span>
      <Button variant="link" onClick={onUpdateToken} className="ml-2 p-0 h-auto text-red-700">
        Update Token
      </Button>
    </div>
  );
};

export default MapError;
