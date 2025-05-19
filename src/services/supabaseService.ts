
import { supabase } from "@/integrations/supabase/client";
import { GamingTable } from "./gamingTableData";

export const fetchGamingTables = async (): Promise<GamingTable[]> => {
  try {
    console.log("Fetching gaming tables from Supabase...");
    const { data, error } = await supabase
      .from("gaming_tables")
      .select("*");
    
    if (error) {
      console.error("Error fetching gaming tables:", error);
      throw error;
    }
    
    console.log("Raw data from Supabase:", data);
    
    // If no data returned from Supabase, fall back to mock data immediately
    if (!data || data.length === 0) {
      console.log("No tables from Supabase, using mock data");
      const { getGamingTables } = await import("./gamingTableData");
      return getGamingTables();
    }
    
    // Process data into expected format with coordinates
    const tables = data.map(table => {
      // Ensure we have valid coordinates
      const longitude = typeof table.longitude === 'number' ? table.longitude : 2.1734;
      const latitude = typeof table.latitude === 'number' ? table.latitude : 41.3851;
      
      // Convert availability status to the correct type
      const status = mapAvailabilityStatus(table.availability_status);
      
      const processedTable = {
        id: table.id,
        name: table.name,
        description: table.description,
        images: table.images || ["/placeholder.svg"],
        location: {
          address: table.location_address || "Barcelona, Spain",
          coordinates: [longitude, latitude] as [number, number]
        },
        availability: {
          status: status,
          until: table.availability_until
        },
        capacity: table.capacity || 4,
        amenities: table.amenities || ["WiFi"],
        rating: table.rating || 4.0,
        reviewCount: table.review_count || 10,
        host_id: table.host_id
      };
      
      return processedTable;
    });
    
    console.log(`Processed ${tables.length} tables from Supabase with coordinates`);
    
    // Log a sample of the first table for debugging
    if (tables.length > 0) {
      console.log("First table sample with coordinates:", 
        JSON.stringify({
          id: tables[0].id,
          name: tables[0].name,
          coordinates: tables[0].location.coordinates
        })
      );
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

// Helper function to map availability status to the correct type
const mapAvailabilityStatus = (status: string): "available" | "occupied" | "maintenance" => {
  if (status === "available" || status === "occupied" || status === "maintenance") {
    return status as "available" | "occupied" | "maintenance";
  }
  return "available"; // Default fallback
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
    
    // Ensure we have valid coordinates
    const longitude = typeof data.longitude === 'number' ? data.longitude : 2.1734;
    const latitude = typeof data.latitude === 'number' ? data.latitude : 41.3851;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      images: data.images || ["/placeholder.svg"],
      location: {
        address: data.location_address || "Barcelona, Spain",
        coordinates: [longitude, latitude] as [number, number]
      },
      availability: {
        status: mapAvailabilityStatus(data.availability_status),
        until: data.availability_until
      },
      capacity: data.capacity || 4,
      amenities: data.amenities || ["WiFi"],
      rating: data.rating || 4.0,
      reviewCount: data.review_count || 10,
      host_id: data.host_id
    };
  } catch (error) {
    console.error("Error in fetchGamingTableById service:", error);
    // Fall back to mock data
    const { getGamingTableById } = await import("./gamingTableData");
    return getGamingTableById(id);
  }
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
