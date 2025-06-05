// This is a fallback data source to use when Supabase is unavailable
// It contains mock data for the application to function offline

import { GamingTable } from "./gamingTableData";

export const MOCK_GAMING_TABLES: GamingTable[] = [
  {
    id: "gt-001",
    name: "Adventure Quest RPG Table",
    description: "Large gaming table perfect for RPG sessions. Features built-in dice trays and cup holders.",
    images: ["https://picsum.photos/seed/gt-001/800/600"],
    capacity: 8,
    price_per_hour: 15,
    equipment: ["Dice sets", "RPG manuals", "Battle maps"],
    host_id: "host-001",
    host_name: "Dragon's Den Gaming",
    location: {
      address: "123 Boardgame Blvd, Brooklyn, NY 10001",
      coordinates: [-73.9812, 40.7378]
    },
    availability: {
      status: "available",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      hours: "12:00-22:00"
    },
    rating: 4.8,
    reviews_count: 56,
    amenities: ["Free WiFi", "Snacks available", "Air conditioning"]
  },
  {
    id: "gt-002",
    name: "Tournament Chess & Strategy",
    description: "Professional chess table with tournament-grade equipment. Perfect for chess tournaments or casual play.",
    images: ["https://picsum.photos/seed/gt-002/800/600"],
    capacity: 2,
    price_per_hour: 10,
    equipment: ["Tournament chess set", "Chess clock", "Strategy game collection"],
    host_id: "host-002",
    host_name: "Checkmate Club",
    location: {
      address: "45 Strategy Street, Manhattan, NY 10012",
      coordinates: [-73.9965, 40.7295]
    },
    availability: {
      status: "available",
      days: ["Tuesday", "Thursday", "Saturday", "Sunday"],
      hours: "14:00-20:00"
    },
    rating: 4.5,
    reviews_count: 32,
    amenities: ["Coffee service", "Quiet environment", "Chess coaching available"]
  },
  {
    id: "gt-003",
    name: "Family Game Night Table",
    description: "Spacious table ideal for family board games. Child-friendly with a wide selection of games for all ages.",
    images: ["https://picsum.photos/seed/gt-003/800/600"],
    capacity: 6,
    price_per_hour: 12,
    equipment: ["Family board games", "Card games", "Drawing supplies"],
    host_id: "host-003",
    host_name: "Family Fun Center",
    location: {
      address: "78 Joy Avenue, Queens, NY 11101",
      coordinates: [-73.9456, 40.7474]
    },
    availability: {
      status: "booked",
      days: ["Wednesday", "Friday", "Saturday", "Sunday"],
      hours: "10:00-18:00"
    },
    rating: 4.9,
    reviews_count: 87,
    amenities: ["Kid-friendly snacks", "Play area for toddlers", "Family restrooms"]
  },
  {
    id: "gt-004",
    name: "Miniatures Wargaming Battlefield",
    description: "Large custom battlefield for miniatures wargaming with interchangeable terrain features.",
    images: ["https://picsum.photos/seed/gt-004/800/600"],
    capacity: 4,
    price_per_hour: 18,
    equipment: ["Terrain sets", "Measuring tools", "Rulebooks"],
    host_id: "host-004",
    host_name: "Battlefield Hobbies",
    location: {
      address: "230 Tactics Terrace, Bronx, NY 10451",
      coordinates: [-73.9278, 40.8298]
    },
    availability: {
      status: "available",
      days: ["Monday", "Wednesday", "Friday", "Saturday"],
      hours: "15:00-23:00"
    },
    rating: 4.7,
    reviews_count: 43,
    amenities: ["Painting station", "Model storage", "Reference library"]
  },
  {
    id: "gt-005",
    name: "Poker Night Professional Table",
    description: "Professional-grade poker table with comfortable seating and high-quality chips.",
    images: ["https://picsum.photos/seed/gt-005/800/600"],
    capacity: 8,
    price_per_hour: 25,
    equipment: ["Professional chip set", "Card decks", "Dealer button"],
    host_id: "host-005",
    host_name: "Royal Flush Casino",
    location: {
      address: "555 Card Street, Staten Island, NY 10301",
      coordinates: [-74.0776, 40.6413]
    },
    availability: {
      status: "available",
      days: ["Thursday", "Friday", "Saturday"],
      hours: "18:00-02:00"
    },
    rating: 4.6,
    reviews_count: 29,
    amenities: ["Bar service", "Smoking area", "Private room"]
  }
];
