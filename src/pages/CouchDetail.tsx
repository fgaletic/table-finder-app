import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCouchById } from "@/services/couchData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, MapPin, Calendar, Star, Sofa } from "lucide-react";
import { toast } from "sonner";

const CouchDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: couch, isLoading, error } = useQuery({
    queryKey: ['couch', id],
    queryFn: () => getCouchById(id || ""),
    enabled: !!id
  });
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground">Loading couch details...</p>
      </div>
    );
  }
  
  if (error || !couch) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold mb-4">Couch Not Found</h2>
        <p className="text-muted-foreground mb-8">
          Sorry, we couldn't find the couch you're looking for.
        </p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }
  
  const handleCheckAvailability = () => {
    if (couch.availability.status === "available") {
      toast.success("This couch is available! Hurry over before someone else takes it.");
    } else if (couch.availability.status === "occupied") {
      toast.info(`This couch is currently occupied until ${couch.availability.until}`);
    } else {
      toast.error("This couch is currently under maintenance.");
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">{couch.name}</h1>
      </div>
      
      {/* Image gallery */}
      <div className="bg-muted rounded-lg overflow-hidden h-64 flex items-center justify-center">
        {couch.images && couch.images.length > 0 ? (
          <img 
            src={couch.images[0]} 
            alt={couch.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-muted-foreground">
            <Sofa className="h-16 w-16" />
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
                  <span className="text-sm">{couch.location.address}</span>
                  <span className="text-sm">({couch.distance}m away)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="ml-1 font-medium">{couch.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({couch.reviewCount} reviews)
                  </span>
                </div>
              </div>
              
              <Badge 
                className={
                  couch.availability.status === "available" 
                    ? "bg-green-500" 
                    : couch.availability.status === "occupied" 
                    ? "bg-amber-500" 
                    : "bg-red-500"
                }
              >
                {couch.availability.status.charAt(0).toUpperCase() + couch.availability.status.slice(1)}
                {couch.availability.until && ` until ${couch.availability.until}`}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-muted-foreground">{couch.description}</p>
              </div>
              
              <div>
                <h2 className="text-lg font-medium mb-2">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {couch.amenities.map((amenity) => (
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
                    ${couch.availability.status === "available" 
                      ? "bg-green-500" 
                      : couch.availability.status === "occupied" 
                      ? "bg-amber-500" 
                      : "bg-red-500"
                    }`}
                >
                  <span className="capitalize font-medium">
                    {couch.availability.status}
                  </span>
                </div>
                {couch.availability.until && (
                  <div className="mt-2 text-sm text-muted-foreground flex items-center justify-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>Until {couch.availability.until}</span>
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
            <p>See something wrong with this couch?</p>
            <Link to="/profile" className="text-primary hover:underline">
              Report an issue
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouchDetail;
