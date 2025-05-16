
import { supabase } from "@/integrations/supabase/client";
import { GamingTable } from "./gamingTableData";

export const fetchGamingTables = async (): Promise<GamingTable[]> => {
  try {
    const { data, error } = await supabase
      .from("gaming_tables")
      .select("*");
    
    if (error) {
      console.error("Error fetching gaming tables:", error);
      throw error;
    }
    
    // Process data into expected format with coordinates
    const tables = data?.map(table => ({
      ...table,
      location: {
        address: table.location_address || "Barcelona, Spain",
        coordinates: [table.longitude || 2.1734, table.latitude || 41.3851] as [number, number]
      },
      availability: {
        status: table.availability_status || "available",
        until: table.availability_until
      }
    })) || [];
    
    console.log(`Fetched ${tables.length} tables from Supabase`);
    
    // If no tables returned from Supabase, fall back to mock data
    if (tables.length === 0) {
      console.log("No tables from Supabase, using mock data");
      const { getGamingTables } = await import("./gamingTableData");
      return getGamingTables();
    }
    
    return tables;
  } catch (error) {
    console.error("Error in fetchGamingTables service:", error);
    // Fall back to mock data
    console.log("Error fetching from Supabase, using mock data");
    const { getGamingTables } = await import("./gamingTableData");
    return getGamingTables();
  }
};

export const fetchGamingTableById = async (id: string): Promise<GamingTable | null> => {
  try {
    const { data, error } = await supabase
      .from("gaming_tables")
      .select("*")
      .eq("id", id)
      .single();
    
    if (error) {
      console.error("Error fetching gaming table:", error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return {
      ...data,
      location: {
        address: data.location_address || "Barcelona, Spain",
        coordinates: [data.longitude || 2.1734, data.latitude || 41.3851] as [number, number]
      },
      availability: {
        status: data.availability_status || "available",
        until: data.availability_until
      }
    };
  } catch (error) {
    console.error("Error in fetchGamingTableById service:", error);
    // Fall back to mock data
    const { getGamingTableById } = await import("./gamingTableData");
    return getGamingTableById(id) || null;
  }
};
