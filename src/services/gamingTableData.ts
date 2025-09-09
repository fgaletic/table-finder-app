export interface GamingVenue {
  id: string;
  name: string;
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  images: string[];
  rating: number;
  reviewCount: number;
  description: string;
  amenities: string[];
  distance?: number; // in meters
  tables: GamingTable[]; // Tables within this venue
}

export interface GamingTable {
  id: string;
  name: string;
  description?: string; 
  images?: string[];    
  availability: {
    status: "available" | "occupied" | "maintenance";
    until?: string;
  };
  capacity?: number;    
  tableNumber?: string; 
  location?: {
    address: string;
    coordinates: [number, number]; 
  };
  amenities?: string[]; 
  distance?: number;
  rating?: number;
  reviewCount?: number;
  host_id?: string;
  venueAddress?: string;
}

const mockGamingVenues: GamingVenue[] = [
  {
    id: "v1",
    name: "Downtown Board Game Café",
    location: {
      address: "Carrer de Balmes 123, Barcelona, 08008",
      coordinates: [2.1545, 41.3950],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    reviewCount: 32,
    description: "A cozy café with a wide selection of board games and snacks.",
    amenities: ["Snacks", "WiFi", "Power Outlets"],
    distance: 350,
    tables: [
      {
        id: "v1-t1",
        name: "Window Table",
        tableNumber: "1",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Snacks", "WiFi", "Power Outlets"],
        location: {
          address: "Carrer de Balmes 123, Barcelona, 08008",
          coordinates: [2.1545, 41.3950],
        },
        distance: 350,
        rating: 4.8
      },
      {
        id: "v1-t2",
        name: "Private Room",
        tableNumber: "2",
        capacity: 8,
        availability: { status: "available" },
        amenities: ["Snacks", "WiFi", "Power Outlets"],
        location: {
          address: "Carrer de Balmes 123, Barcelona, 08008",
          coordinates: [2.1545, 41.3950],
        },
        distance: 350,
        rating: 4.8
      }
    ]
  },
  {
    id: "v2",
    name: "Mall Gaming Zone",
    location: {
      address: "Avinguda Diagonal 456, Barcelona, 08006",
      coordinates: [2.1436, 41.3975],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.2,
    reviewCount: 47,
    description: "A gaming zone in the mall's upper level with a variety of board games. Great for quick gaming sessions.",
    amenities: ["Game Rentals", "Snack Bar", "Tournaments"],
    distance: 620,
    tables: [
      {
        id: "v2-t1",
        name: "Center Table",
        tableNumber: "3",
        capacity: 6,
        availability: { status: "occupied", until: "3:30 PM" },
        amenities: ["Game Rentals", "Snack Bar", "Tournaments"],
        location: {
          address: "Avinguda Diagonal 456, Barcelona, 08006",
          coordinates: [2.1436, 41.3975],
        },
        distance: 620,
        rating: 4.2
      },
      {
        id: "v2-t2",
        name: "Corner Booth",
        tableNumber: "4",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Game Rentals", "Snack Bar", "Tournaments"],
        location: {
          address: "Avinguda Diagonal 456, Barcelona, 08006",
          coordinates: [2.1436, 41.3975],
        },
        distance: 620,
        rating: 4.2
      }
    ]
  },
  {
    id: "v3",
    name: "Student Center Gaming Lounge",
    location: {
      address: "Carrer de Muntaner 789, Barcelona, 08021",
      coordinates: [2.1490, 41.3926],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.5,
    reviewCount: 24,
    description: "A vibrant gaming lounge in the university's student center. Ideal for group board game sessions.",
    amenities: ["Free Game Library", "Student Discounts", "Events"],
    distance: 850,
    tables: [
      {
        id: "v3-t1",
        name: "Main Gaming Area",
        tableNumber: "5",
        capacity: 12,
        availability: { status: "maintenance", until: "Tomorrow" },
        amenities: ["Free Game Library", "Student Discounts", "Events"],
        location: {
          address: "Carrer de Muntaner 789, Barcelona, 08021",
          coordinates: [2.1490, 41.3926],
        },
        distance: 850,
        rating: 4.5
      },
      {
        id: "v3-t2",
        name: "Quiet Study Corner",
        tableNumber: "6",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Free Game Library", "Student Discounts", "Events"],
        location: {
          address: "Carrer de Muntaner 789, Barcelona, 08021",
          coordinates: [2.1490, 41.3926],
        },
        distance: 850,
        rating: 4.5
      }
    ]
  }
];

// Standalone tables not associated with venues
const standaloneGamingTables: GamingTable[] = [
  {
    id: "st1",
    name: "Library Lounge Table",
    description: "A spacious table in the public library's lounge, perfect for board games. Quiet environment with excellent lighting.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "L1",
    capacity: 4,
    amenities: ["Quiet", "Good Lighting"],
    location: {
      address: "Carrer de Provença 123, Barcelona, 08036",
      coordinates: [2.1533, 41.3891],
    },
    distance: 500,
    rating: 4.5
  },
  {
    id: "st2",
    name: "Hotel Lobby Gaming Table",
    description: "A luxurious gaming table in a boutique hotel's lobby. Perfect for a premium gaming experience.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "H1",
    capacity: 6,
    amenities: ["Premium", "Lobby Service"],
    location: {
      address: "Carrer d'Enric Granados 789, Barcelona, 08007",
      coordinates: [2.1569, 41.3877],
    },
    distance: 800,
    rating: 4.7
  }
];

const mockGamingTables: GamingTable[] = [
  {
    id: "1",
    name: "Downtown Board Game Café",
    description: "A cozy café with a wide selection of board games and snacks.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 1",
    distance: 350,
    rating: 4.8,
  },
  {
    id: "2",
    name: "Library Lounge Table",
    description: "A spacious table in the public library's lounge, perfect for board games. Quiet environment with excellent lighting.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 2",
    distance: 500,
    rating: 4.5,
  },
  {
    id: "3",
    name: "Mall Gaming Zone",
    description: "A gaming zone in the mall's upper level with a variety of board games. Great for quick gaming sessions.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "occupied",
      until: "3:30 PM",
    },
    tableNumber: "Table 3",
    distance: 1200,
    rating: 4.2,
  },
  {
    id: "4",
    name: "Hotel Lobby Gaming Table",
    description: "A luxurious gaming table in a boutique hotel's lobby. Perfect for a premium gaming experience.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 4",
    distance: 800,
    rating: 4.7,
  },
  {
    id: "5",
    name: "Student Center Gaming Lounge",
    description: "A vibrant gaming lounge in the university's student center. Ideal for group board game sessions.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "maintenance",
      until: "Tomorrow",
    },
    tableNumber: "Table 5",
    distance: 1500,
    rating: 4.3,
  },
];

export const getGamingTables = (): Promise<GamingTable[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockGamingTables);
    }, 500);
  });
};

export const getGamingTableById = (id: string): Promise<GamingTable | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const table = mockGamingTables.find((table) => table.id === id);
      resolve(table);
    }, 300);
  });
};

export const getAllAvailableTables = (): Promise<(GamingTable & { venueId?: string, venueName?: string })[]> => {
  return new Promise((resolve) => {
    const allTables: (GamingTable & { venueId?: string, venueName?: string })[] = [];

    // Venue tables
    mockGamingVenues.forEach(venue => {
      venue.tables.forEach(table => {
        allTables.push({
          ...table,
          venueId: venue.id,
          venueName: venue.name,
          venueAddress: venue.location.address,
          distance: venue.distance,
          rating: venue.rating
        });
      });
    });

    // Standalone tables
    standaloneGamingTables.forEach(table => {
      allTables.push(table);
    });

    setTimeout(() => resolve(allTables), 500);
  });
};
