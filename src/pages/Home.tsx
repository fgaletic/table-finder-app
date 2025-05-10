
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCouches, Couch } from "@/services/couchData";
import CouchListItem from "@/components/CouchListItem";
import CouchMap from "@/components/CouchMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderPicker } from "@/components/SliderPicker";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [maxDistance, setMaxDistance] = useState<number>(1500);
  const [minRating, setMinRating] = useState<number>(3);
  
  // Fetch couches data
  const { data: couches, isLoading, error, refetch } = useQuery({
    queryKey: ['couches'],
    queryFn: getCouches
  });

  const filteredCouches = couches?.filter(
    (couch) => (couch.distance || 0) <= maxDistance && couch.rating >= minRating
  ) || [];
  
  useEffect(() => {
    if (error) {
      toast.error("Failed to load couches data");
    }
  }, [error]);

  const handleRefresh = () => {
    toast.promise(refetch(), {
      loading: 'Refreshing couch data...',
      success: 'Found the latest available couches!',
      error: 'Failed to refresh data'
    });
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Find a Couch</h1>
        <Button size="sm" variant="outline" onClick={handleRefresh}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {/* Filters */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 bg-card p-4 rounded-lg shadow-sm">
        <div className="space-y-2">
          <label className="text-sm font-medium">Distance (meters)</label>
          <SliderPicker
            min={100}
            max={3000}
            step={100}
            value={maxDistance}
            onChange={setMaxDistance}
            formatter={(val) => `${val}m`}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Minimum Rating</label>
          <SliderPicker
            min={1}
            max={5}
            step={0.5}
            value={minRating}
            onChange={setMinRating}
            formatter={(val) => `${val} ★`}
          />
        </div>
      </div>

      {/* Mobile view mode selector */}
      <div className="block md:hidden">
        <Tabs defaultValue="map" onValueChange={(val) => setViewMode(val as "map" | "list")}>
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="map">Map</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content area */}
      <div className={`flex flex-col md:flex-row gap-6 ${isLoading ? "opacity-60" : ""}`}>
        {/* Map (Hidden on mobile when list view is selected) */}
        <div className={`h-[70vh] w-full md:w-3/5 rounded-lg overflow-hidden shadow-md ${viewMode === "list" ? "hidden md:block" : ""}`}>
          <CouchMap couches={filteredCouches} isLoading={isLoading} />
        </div>
        
        {/* List (Hidden on mobile when map view is selected) */}
        <div className={`w-full md:w-2/5 flex-shrink-0 ${viewMode === "map" ? "hidden md:block" : ""}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Couches</h2>
              <span className="text-sm text-muted-foreground">
                {filteredCouches.length} found
              </span>
            </div>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-muted animate-pulse-soft rounded-lg"></div>
                ))}
              </div>
            ) : filteredCouches.length > 0 ? (
              <div className="space-y-3">
                {filteredCouches.map((couch) => (
                  <CouchListItem key={couch.id} couch={couch} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No couches match your filters</p>
                <Button 
                  variant="link" 
                  onClick={() => {
                    setMaxDistance(3000);
                    setMinRating(1);
                  }}
                >
                  Reset filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
