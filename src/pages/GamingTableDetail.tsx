import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getGamingTableById } from "@/services/gamingTableData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Star, Dices } from "lucide-react";
import { toast } from "sonner";

const GamingTableDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: table, isLoading, error } = useQuery({
    queryKey: ['table', id],
    queryFn: () => getGamingTableById(id || ""),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading table details...</p>
      </div>
    );
  }
  
  if (error || !table) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Table Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the table you're looking for.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const handleCheckAvailability = () => {
    if (table.availability.status === "available") {
      toast.success("This table is available! Hurry over before someone else takes it.");
    } else if (table.availability.status === "occupied") {
      toast.info(`This table is currently occupied until ${table.availability.until}`);
    } else {
      toast.error("This table is currently under maintenance.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{table.name}</h1>
      </div>
      
      {/* Image gallery */}
      <div className="bg-muted rounded-lg overflow-hidden h-64 flex items-center justify-center">
        {table.images && table.images.length > 0 ? (
          <img 
            src={table.images[0]} 
            alt={table.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">
            <Dices className="h-16 w-16" />
          </div>
        )}
      </div>
      
      {/* Main info */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{table.location.address}</span>
                  <span className="text-sm">({table.distance}m away)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium">{table.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({table.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <Badge 
                className={
                  table.availability.status === "available" 
                    ? "bg-green-500" 
                    : table.availability.status === "occupied" 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }
              >
                {table.availability.status.charAt(0).toUpperCase() + table.availability.status.slice(1)}
                {table.availability.until && ` until ${table.availability.until}`}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-muted-foreground">{table.description}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {table.amenities.map((amenity) => (
                    <Badge key={amenity} variant="outline">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">Current Status</h3>
                <div 
                  className={`inline-flex items-center px-3 py-1 rounded-full text-white 
                    ${table.availability.status === "available" 
                      ? "bg-green-500" 
                      : table.availability.status === "occupied" 
                      ? "bg-amber-500" 
                      : "bg-red-500"
                    }`}
                >
                  <span className="capitalize font-medium">
                    {table.availability.status}
                  </span>
                </div>
                {table.availability.until && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Until {table.availability.until}</span>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full"
                onClick={handleCheckAvailability}
              >
                Check Availability
              </Button>
            </CardContent>
          </Card>
          
          <div className="p-4 bg-muted rounded-lg text-sm text-center text-muted-foreground">
            <p>See something wrong with this table?</p>
            <Link to="/profile" className="text-primary hover:underline">
              Report an issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamingTableDetail;