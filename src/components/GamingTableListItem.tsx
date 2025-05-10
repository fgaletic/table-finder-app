
import { Link } from "react-router-dom";
import { GamingTable } from "@/services/gamingTableData";
import { Badge } from "@/components/ui/badge";
import { Dices } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface GamingTableListItemProps {
  table: GamingTable & { 
    venueId?: string;
    venueName?: string;
    distance?: number;
    rating?: number;
  };
}

const GamingTableListItem = ({ table }: GamingTableListItemProps) => {
  const availabilityColor = {
    available: "bg-green-500",
    occupied: "bg-amber-500",
    maintenance: "bg-red-500",
  }[table.availability.status];

  return (
    <Link to={`/gamingTable/${table.id}`} className="block">
      <div className="border rounded-lg overflow-hidden bg-card hover:bg-accent/50 transition-colors">
        <div className="flex">
          <div className="w-1/3 h-28 bg-muted flex items-center justify-center">
            {table.images && table.images[0] ? (
              <img
                src={table.images[0]}
                alt={table.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground">
                <Dices className="h-8 w-8" />
              </div>
            )}
          </div>
          <div className="w-2/3 p-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm line-clamp-1">{table.name}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{table.rating}</span>
                  <span className="text-yellow-500 text-xs">★</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {table.location?.address || table.venueAddress || "No address available"}
              </p>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-1.5">
                {table.capacity && (
                  <Badge variant="outline" className="text-[10px] py-0">
                    {table.capacity} players
                  </Badge>
                )}
                {table.amenities && table.amenities.slice(0, 1).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-[10px] py-0">
                    {amenity}
                  </Badge>
                ))}
                {table.amenities && table.amenities.length > 1 && (
                  <Badge variant="outline" className="text-[10px] py-0">
                    +{table.amenities.length - 1}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {table.distance !== undefined && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="text-xs cursor-help">{table.distance}m</span>
                    </TooltipTrigger>
                    <TooltipContent>Distance from your location</TooltipContent>
                  </Tooltip>
                )}
                <div className={`w-2 h-2 rounded-full ${availabilityColor}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GamingTableListItem;
