
import { Link } from "react-router-dom";
import { Couch } from "@/services/couchData";
import { Badge } from "@/components/ui/badge";
import { sofa } from "lucide-react";

interface CouchListItemProps {
  couch: Couch;
}

const CouchListItem = ({ couch }: CouchListItemProps) => {
  const availabilityColor = {
    available: "bg-green-500",
    occupied: "bg-amber-500",
    maintenance: "bg-red-500",
  }[couch.availability.status];

  return (
    <Link to={`/couch/${couch.id}`} className="block">
      <div className="border rounded-lg overflow-hidden bg-card hover:bg-accent/50 transition-colors">
        <div className="flex">
          <div className="w-1/3 h-28 bg-muted flex items-center justify-center">
            {couch.images && couch.images[0] ? (
              <img 
                src={couch.images[0]} 
                alt={couch.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-muted-foreground">
                {sofa && <sofa className="h-8 w-8" />}
              </div>
            )}
          </div>
          <div className="w-2/3 p-3 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-medium text-sm line-clamp-1">{couch.name}</h3>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">{couch.rating}</span>
                  <span className="text-yellow-500 text-xs">★</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                {couch.location.address}
              </p>
            </div>
            
            <div className="flex justify-between items-end">
              <div className="flex flex-wrap gap-1.5">
                {couch.amenities.slice(0, 2).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-[10px] py-0">
                    {amenity}
                  </Badge>
                ))}
                {couch.amenities.length > 2 && (
                  <Badge variant="outline" className="text-[10px] py-0">
                    +{couch.amenities.length - 2}
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs">{couch.distance}m</span>
                <div className={`w-2 h-2 rounded-full ${availabilityColor}`}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CouchListItem;
