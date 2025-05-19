
import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { GamingTable } from "@/services/gamingTableData";
import { fetchGamingTables } from "@/services/supabaseService";
import GamingTableListItem from "@/components/GamingTableListItem";
import GamingTableMap from "@/components/GamingTableMap";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SliderPicker } from "@/components/SliderPicker";
import { RefreshCw } from "lucide-react";
import { toast } from "sonner";

const Home = () => {
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [maxDistance, setMaxDistance] = useState<number>(3000); // Increased from 1500 to 3000
  const [minRating, setMinRating] = useState<number>(1); // Lowered from 3 to 1 for initial load

  // Fetch tables from Supabase
  const { data: tables, isLoading, error, refetch } = useQuery({
    queryKey: ["gamingTables"],
    queryFn: fetchGamingTables,
  });

  // Display error toast if fetching fails
  useEffect(() => {
    if (error) {
      toast.error("Failed to load gaming tables data. Please try refreshing.");
      console.error("Error fetching tables:", error);
    }
  }, [error]);

  // Log tables data when received
  useEffect(() => {
    console.log(`Home component received ${tables?.length || 0} tables from query`);
    if (tables?.length) {
      console.log("Sample table with location:", JSON.stringify({
        id: tables[0].id,
        name: tables[0].name,
        location: tables[0].location
      }));
    } else {
      console.log("No tables data received in Home component");
    }
  }, [tables]);

  // Process tables to add distance based on user location
  const processedTables = useMemo(() => {
    if (!tables || tables.length === 0) {
      console.log("No tables data received in Home component for processing");
      return [];
    }
    
    console.log(`Processing ${tables.length} tables in Home component`);
    
    // Barcelona city center coordinates (longitude, latitude)
    const userLocation: [number, number] = [2.1734, 41.3851]; // Barcelona coordinates
    
    return tables.map(table => {
      if (!table.location || !table.location.coordinates) {
        console.log("Table missing coordinates:", table.id, table.name);
        return { ...table, distance: 3000 }; // Default high distance for tables without coordinates
      }
      
      // Calculate distance
      const distance = calculateDistance(
        userLocation,
        table.location.coordinates
      );
      
      console.log(`Table ${table.name} distance: ${Math.round(distance * 1000)}m`);
      
      return {
        ...table,
        distance: Math.round(distance * 1000), // Convert km to meters
      } as GamingTable & { distance: number };
    });
  }, [tables]);

  // Calculate distance between two points in km
  function calculateDistance(
    coords1: [number, number],
    coords2: [number, number]
  ): number {
    // This is a simplified version (Haversine formula)
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(coords2[1] - coords1[1]);
    const dLon = deg2rad(coords2[0] - coords1[0]);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(coords1[1])) * Math.cos(deg2rad(coords2[1])) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  const filteredTables = useMemo(() => {
    const filtered = (processedTables || []).filter(
      (table) => {
        // Only filter by distance if the table has a distance property
        const passesDistanceFilter = !table.distance || table.distance <= maxDistance;
        // Only filter by rating if the table has a rating property
        const passesRatingFilter = !table.rating || table.rating >= minRating;
        
        return passesDistanceFilter && passesRatingFilter;
      }
    );
    
    console.log("Filtering tables:", {
      total: processedTables.length,
      filtered: filtered.length,
      maxDistance,
      minRating
    });
    
    return filtered;
  }, [processedTables, maxDistance, minRating]);

  useEffect(() => {
    console.log("Filtered tables count:", filteredTables.length);
    if (filteredTables.length > 0) {
      console.log("First filtered table:", filteredTables[0].name);
    } else {
      console.log("No tables passed the filter criteria");
    }
  }, [filteredTables]);

  const handleRefresh = () => {
    toast.promise(refetch(), {
      loading: "Refreshing gaming table data...",
      success: "Found the latest available gaming tables!",
      error: "Failed to refresh data",
    });
  };

  return (
    <div className="flex flex-col space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Find a Gaming Table in Barcelona</h1>
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
      <div className="md:hidden">
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "map" | "list")}>
          <TabsList className="w-full">
            <TabsTrigger value="map" className="w-1/2">Map</TabsTrigger>
            <TabsTrigger value="list" className="w-1/2">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className={`flex flex-col md:flex-row gap-6 ${isLoading ? "opacity-60" : ""}`}>
        <div className={`h-[70vh] w-full md:w-3/5 rounded-lg overflow-hidden shadow-md ${viewMode === "list" ? "hidden md:block" : ""}`}>
          <GamingTableMap gamingTables={filteredTables} isLoading={isLoading} />
        </div>
        <div className={`w-full md:w-2/5 flex-shrink-0 ${viewMode === "map" ? "hidden md:block" : ""}`}>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Available Gaming Tables</h2>
              <span className="text-sm text-muted-foreground">{filteredTables.length} found</span>
            </div>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-28 bg-muted animate-pulse-soft rounded-lg"></div>
                ))}
              </div>
            ) : filteredTables.length > 0 ? (
              <div className="space-y-3">
                {filteredTables.map((table) => (
                  <GamingTableListItem key={table.id} table={table} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No gaming tables match your filters</p>
                <Button variant="link" onClick={() => { setMaxDistance(3000); setMinRating(1); }}>
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
