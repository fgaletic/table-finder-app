
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
        status: mapAvailabilityStatus(table.availability_status),
        until: table.availability_until
      },
      amenities: table.amenities || []
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
        status: mapAvailabilityStatus(data.availability_status),
        until: data.availability_until
      },
      amenities: data.amenities || []
    };
  } catch (error) {
    console.error("Error in fetchGamingTableById service:", error);
    // Fall back to mock data
    const { getGamingTableById } = await import("./gamingTableData");
    return getGamingTableById(id);
  }
};

// Helper function to map availability status to the correct type
const mapAvailabilityStatus = (status: string): "available" | "occupied" | "maintenance" => {
  if (status === "available" || status === "occupied" || status === "maintenance") {
    return status;
  }
  return "available"; // Default fallback
};

// New function to fetch a table with its host information
export const fetchGamingTableWithHost = async (id: string) => {
  try {
    // Fetch the table
    const table = await fetchGamingTableById(id);
    
    if (!table) {
      console.error("Table not found");
      return { table: null, host: null };
    }
    
    // If the table has a host_id, fetch the host information
    if (table.host_id) {
      const { data: host, error } = await supabase
        .from("hosts")
        .select("*")
        .eq("id", table.host_id)
        .single();
      
      if (error) {
        console.error("Error fetching host:", error);
        return { table, host: null };
      }
      
      return { table, host };
    }
    
    return { table, host: null };
  } catch (error) {
    console.error("Error fetching table with host:", error);
    
    // Fall back to mock data
    const { getGamingTableById } = await import("./gamingTableData");
    const table = await getGamingTableById(id);
    
    if (!table) {
      return { table: null, host: null };
    }
    
    // Mock host data
    const host = {
      id: "host-1",
      name: "Barcelona Game Host",
      bio: "Board game enthusiast hosting tables across Barcelona.",
      email: "host@example.com",
      avatar_url: null,
      created_at: new Date().toISOString(),
      phone: null
    };
    
    return { table, host };
  }
};

export const createBooking = async (bookingData: {
  table_id: string;
  user_name: string;
  user_email: string;
  start_time: string;
  end_time: string;
  status: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("bookings")
      .insert([bookingData])
      .select();
    
    if (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
    
    console.log("Booking created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in createBooking service:", error);
    // Mock successful booking for demo purposes
    return {
      id: `booking-${Date.now()}`,
      ...bookingData,
      created_at: new Date().toISOString()
    };
  }
};

export const sendMessage = async (messageData: {
  host_id: string;
  table_id: string;
  sender_name: string;
  sender_email: string;
  message: string;
}) => {
  try {
    const { data, error } = await supabase
      .from("messages")
      .insert([{
        ...messageData,
        read: false
      }])
      .select();
    
    if (error) {
      console.error("Error sending message:", error);
      throw error;
    }
    
    console.log("Message sent successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in sendMessage service:", error);
    // Mock successful message for demo purposes
    return {
      id: `message-${Date.now()}`,
      ...messageData,
      read: false,
      created_at: new Date().toISOString()
    };
  }
};
