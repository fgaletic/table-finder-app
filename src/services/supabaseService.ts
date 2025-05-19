import { supabase } from "@/integrations/supabase/client";
import { GamingTable } from "./gamingTableData";
import { geocodeAddress } from "./geocodingService";

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

// Fetch all gaming tables from Supabase
export const fetchGamingTables = async () => {
  const { data, error } = await supabase
    .from("gaming_tables")
    .select("*");
  
  if (error) {
    console.error("Error fetching gaming tables:", error);
    throw error;
  }
  
  // Transform to match our existing GamingTable interface with proper type casting
  return data.map(table => ({
    id: table.id,
    name: table.name,
    description: table.description || "",
    location: {
      address: table.location_address,
      coordinates: [table.longitude, table.latitude] as [number, number],
    },
    images: table.images || ["/placeholder.svg"],
    availability: {
      status: (table.availability_status || "available") as "available" | "occupied" | "maintenance",
      until: table.availability_until,
    },
    capacity: table.capacity,
    amenities: table.amenities || [],
    rating: table.rating,
    reviewCount: table.review_count,
    distance: 0, // Will be calculated based on user location
    host_id: table.host_id,
    // We intentionally don't add fields like "venueId" or "venueName" here
    // to avoid biasing towards venues. Instead, host information can indicate
    // if this is a private table or part of a commercial venue
  }));
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
};

// Fetch a single gaming table with its host information
export const fetchGamingTableWithHost = async (id: string) => {
  // First fetch the gaming table
  const { data: tableData, error: tableError } = await supabase
    .from("gaming_tables")
    .select("*")
    .eq("id", id)
    .single();
  
  if (tableError) {
    console.error("Error fetching gaming table:", tableError);
    throw tableError;
  }
  
  // Then fetch the host information
  const { data: hostData, error: hostError } = await supabase
    .from("hosts")
    .select("*")
    .eq("id", tableData.host_id)
    .single();
  
  if (hostError) {
    console.error("Error fetching host information:", hostError);
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
        until: tableData.availability_until,
      },
      capacity: tableData.capacity,
      amenities: tableData.amenities || [],
      rating: tableData.rating,
      reviewCount: tableData.review_count,
      host_id: tableData.host_id,
    },
    host: hostData || null,
  };
};

// Book a gaming table
export const createBooking = async (booking: Omit<Booking, "id" | "created_at">) => {
  const { data, error } = await supabase
    .from("bookings")
    .insert([booking])
    .select();
  
  if (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
  
  return data[0];
};

// Send a message to a host
export const sendMessage = async (message: Message) => {
  const { data, error } = await supabase
    .from("messages")
    .insert([message])
    .select();
  
  if (error) {
    console.error("Error sending message:", error);
    throw error;
  }
  
  return data[0];
};
