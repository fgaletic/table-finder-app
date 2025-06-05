// New and improved supabaseService with proper error handling and mock data fallbacks
import { supabase } from "@/integrations/supabase/client";
import { GamingTable } from "./gamingTableData";
import { geocodeAddress } from "./geocodingService";
import { MOCK_GAMING_TABLES } from "./mockData";
import { toast } from "sonner";

export interface Host {
  id: string;
  name: string;
  email: string;
  bio?: string;
  phone?: string;
  avatar_url?: string;
  is_business?: boolean; // Flag to indicate if the host is a business or private individual
}

export interface Booking {
  id: string;
  table_id: string;
  user_name: string;
  user_email: string;
  start_time: string;
  end_time: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

export interface Message {
  id?: string;
  sender_name: string;
  sender_email: string;
  host_id: string;
  table_id: string;
  message: string;
  created_at?: string;
}

// Network status tracking
let networkErrorCount = 0;
const MAX_NETWORK_ERRORS = 3;
const lastNetworkErrorTime = 0; // Changed let to const
const NETWORK_ERROR_COOLDOWN = 5 * 60 * 1000; // 5 minutes

/**
 * Checks if we should attempt to connect to Supabase or use Barcelona mock data directly
 * Uses an exponential backoff strategy to avoid repeated connection attempts
 */
const shouldUseSupabase = (): boolean => {
  const now = Date.now();
  
  // Reset error count if it's been more than the cooldown period
  if (now - lastNetworkErrorTime > NETWORK_ERROR_COOLDOWN) {
    networkErrorCount = 0;
    return true;
  }
  
  // If we've had too many errors recently, use mock data
  return networkErrorCount < MAX_NETWORK_ERRORS;
};

/**
 * Fetch all gaming tables from Supabase with robust error handling
 * Falls back to Barcelona mock data when network issues occur
 */
export const fetchGamingTables = async (): Promise<GamingTable[]> => {
  // Temporarily always return mock data for Barcelona focus
  console.info("Temporarily using Barcelona mock data for development");
  toast.info("Displaying mock Barcelona gaming tables.");
  return MOCK_GAMING_TABLES;
  
  // Check if we should even try to use Supabase based on recent network errors
  // if (!shouldUseSupabase()) {
  //   console.info("Using Barcelona mock data due to recent network issues");
  //   return MOCK_GAMING_TABLES;
  // }
  
  // try {
  //   const { data, error } = await supabase
  //     .from("gaming_tables")
  //     .select("*");
    
  //   if (error) {
  //     console.error("Error fetching gaming tables:", error);
  //     toast.error("Unable to connect to the database, using Barcelona mock data instead");
      
  //     // Track network errors
  //     networkErrorCount++;
  //     lastNetworkErrorTime = Date.now();
      
  //     return MOCK_GAMING_TABLES;
  //   }
    
  //   // Transform to match our existing GamingTable interface with proper type casting
  //   return data.map(table => ({
  //     id: table.id,
  //     name: table.name,
  //     description: table.description || "",
  //     location: {
  //       address: table.location_address,
  //       coordinates: [table.longitude, table.latitude] as [number, number],
  //     },
  //     images: table.images || ["/placeholder.svg"],
  //     availability: {
  //       status: (table.availability_status || "available") as "available" | "occupied" | "maintenance",
  //       days: table.availability_days || ["Monday", "Wednesday", "Friday"],
  //       hours: table.availability_hours || "12:00-22:00"
  //     },
  //     capacity: table.capacity,
  //     amenities: table.amenities || [],
  //     rating: table.rating,
  //     reviews_count: table.reviews_count || 0,
  //     price_per_hour: table.price_per_hour || 15,
  //     equipment: table.equipment || [],
  //     host_id: table.host_id,
  //     host_name: table.host_name
  //   }));
  // } catch (error) {
  //   console.error("Error fetching gaming tables:", error);
  //   toast.error("Unable to connect to the database, using offline data instead");
  //   return MOCK_GAMING_TABLES;
  // }
};

// New function to create a gaming table with address geocoding
export const createGamingTable = async (
  tableData: {
    name: string;
    description?: string;
    location_address: string;
    capacity?: number;
    amenities?: string[];
    images?: string[];
    host_id: string;
  }
) => {
  try {
    // Try to geocode the address
    const coordinates = await geocodeAddress(tableData.location_address);
    
    if (!coordinates) {
      throw new Error("Could not geocode the provided address. Please check and try again.");
    }
    
    const [longitude, latitude] = coordinates;
    
    const { data, error } = await supabase
      .from("gaming_tables")
      .insert([
        {
          ...tableData,
          longitude,
          latitude,
          availability_status: "available",
        },
      ])
      .select();
    
    if (error) {
      console.error("Error creating gaming table:", error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error creating gaming table:", error);
    toast.error("Failed to create gaming table. Please try again later.");
    throw error;
  }
};

// Fetch a single gaming table with its host information
export const fetchGamingTableWithHost = async (id: string) => {
  try {
    // First fetch the gaming table
    const { data: tableData, error: tableError } = await supabase
      .from("gaming_tables")
      .select("*")
      .eq("id", id)
      .single();
    
    if (tableError) {
      console.error("Error fetching gaming table:", tableError);
      toast.error("Unable to fetch gaming table, using offline data");
      
      // Find mock table with matching id
      const mockTable = MOCK_GAMING_TABLES.find(table => table.id === id);
      if (!mockTable) {
        throw new Error("Gaming table not found");
      }
      
      // Return mock data
      return {
        table: mockTable,
        host: {
          id: mockTable.host_id || "host-demo",
          name: mockTable.host_name || "Demo Host",
          email: "host@example.com",
          bio: "This is a demo host profile using offline data.",
          is_business: true
        }
      };
    }
    
    // Then fetch the host information
    let hostData;
    try {
      const { data: hostResult, error: hostError } = await supabase
        .from("hosts")
        .select("*")
        .eq("id", tableData.host_id)
        .single();
      
      if (hostError) {
        console.error("Error fetching host information:", hostError);
        // Create fallback host data
        hostData = {
          id: tableData.host_id,
          name: "Host Name Unavailable",
          email: "host@example.com",
          bio: "Host information is currently unavailable."
        };
      } else {
        hostData = hostResult;
      }
    } catch (hostFetchError) {
      console.error("Error in host fetch:", hostFetchError);
      hostData = {
        id: tableData.host_id,
        name: "Host Name Unavailable",
        email: "host@example.com",
        bio: "Host information is currently unavailable."
      };
    }
    
    // Transform to match our existing GamingTable interface and add host
    return {
      table: {
        id: tableData.id,
        name: tableData.name,
        description: tableData.description || "",
        location: {
          address: tableData.location_address,
          coordinates: [tableData.longitude, tableData.latitude] as [number, number],
        },
        images: tableData.images || ["/placeholder.svg"],
        availability: {
          status: (tableData.availability_status || "available") as "available" | "occupied" | "maintenance",
          days: tableData.availability_days || ["Monday", "Wednesday", "Friday"],
          hours: tableData.availability_hours || "12:00-22:00"
        },
        capacity: tableData.capacity,
        amenities: tableData.amenities || [],
        rating: tableData.rating,
        reviews_count: tableData.reviews_count || 0,
        price_per_hour: tableData.price_per_hour || 15,
        equipment: tableData.equipment || [],
        host_id: tableData.host_id,
        host_name: tableData.host_name
      },
      host: hostData,
    };
  } catch (error) {
    console.error("Error in fetchGamingTableWithHost:", error);
    toast.error("Unable to fetch gaming table, using offline data");
    
    // Find mock table with matching id as ultimate fallback
    const mockTable = MOCK_GAMING_TABLES.find(table => table.id === id);
    if (!mockTable) {
      throw new Error("Gaming table not found");
    }
    
    // Return mock data
    return {
      table: mockTable,
      host: {
        id: mockTable.host_id || "host-demo",
        name: mockTable.host_name || "Demo Host",
        email: "host@example.com",
        bio: "This is a demo host profile using offline data.",
        is_business: true
      }
    };
  }
};

// Book a gaming table
export const createBooking = async (booking: Omit<Booking, "id" | "created_at">) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([booking])
      .select();
    
    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error creating booking:", error);
    toast.error("Failed to create booking. Please try again later.");
    throw error;
  }
};

// Send a message to a host
export const sendMessage = async (message: Message) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([message])
      .select();
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error sending message:", error);
    toast.error("Failed to send message. Please try again later.");
    throw error;
  }
};
