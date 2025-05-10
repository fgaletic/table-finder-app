
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
  const [maxDistance, setMaxDistance] = useState<number>(1500);
  const [minRating, setMinRating] = useState<number>(3);

  // Fetch tables from Supabase
  const { data: tables, isLoading, error, refetch } = useQuery({
    queryKey: ["gamingTables"],
    queryFn: fetchGamingTables,
  });

  // Process tables to add distance based on user location
  const processedTables = useMemo(() => {
    if (!tables) return [];
    
    // Mock user location (New York City)
    const userLocation: [number, number] = [-74.0060, 40.7128];
    
    return tables.map(table => {
      // Calculate mock distance (replace with real calculation in production)
      const distance = calculateDistance(
        userLocation,
        table.location ? table.location.coordinates : [-74.0060, 40.7128]
      );
      
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

  const filteredTables = (processedTables || []).filter(
    (table) =>
      (table.distance || 0) <= maxDistance &&
      (table.rating || 0) >= minRating
  );

  useEffect(() => {
    if (error) {
      toast.error("Failed to load gaming tables data");
    }
  }, [error]);

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
        <h1 className="text-3xl font-bold tracking-tight">Find a Gaming Table</h1>
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
