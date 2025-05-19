
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

// Barcelona mock data - these are real coordinates and addresses in Barcelona
const mockGamingVenues: GamingVenue[] = [
  {
    id: "v1",
    name: "Barcelona Board Game Café",
    location: {
      address: "Carrer de Provença, 181, 08036 Barcelona",
      coordinates: [2.1547, 41.3873],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    reviewCount: 32,
    description: "A cozy café with a wide selection of board games and authentic Spanish snacks.",
    amenities: ["Coffee", "WiFi", "Power Outlets"],
    distance: 350,
    tables: [
      {
        id: "v1-t1",
        name: "Window Table",
        tableNumber: "1",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Coffee", "WiFi", "Power Outlets"],
        location: {
          address: "Carrer de Provença, 181, 08036 Barcelona",
          coordinates: [2.1547, 41.3873],
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
        amenities: ["Coffee", "WiFi", "Power Outlets"],
        location: {
          address: "Carrer de Provença, 181, 08036 Barcelona",
          coordinates: [2.1547, 41.3873],
        },
        distance: 350,
        rating: 4.8
      }
    ]
  },
  {
    id: "v2",
    name: "Plaça Catalunya Gaming Zone",
    location: {
      address: "Plaça de Catalunya, 08002 Barcelona",
      coordinates: [2.1700, 41.3874],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.2,
    reviewCount: 47,
    description: "A community gaming zone near the famous Plaça de Catalunya. Perfect for tourists and locals alike.",
    amenities: ["Game Rentals", "Snack Bar", "Tournaments"],
    distance: 620,
    tables: [
      {
        id: "v2-t1",
        name: "Center Table",
        tableNumber: "3",
        capacity: 6,
        availability: { status: "occupied", until: "15:30" },
        amenities: ["Game Rentals", "Snack Bar", "Tournaments"],
        location: {
          address: "Plaça de Catalunya, 08002 Barcelona",
          coordinates: [2.1700, 41.3874],
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
          address: "Plaça de Catalunya, 08002 Barcelona",
          coordinates: [2.1700, 41.3874],
        },
        distance: 620,
        rating: 4.2
      }
    ]
  },
  {
    id: "v3",
    name: "Barceloneta Beach Gaming",
    location: {
      address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
      coordinates: [2.1900, 41.3780],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.5,
    reviewCount: 24,
    description: "Play board games with a view of the Mediterranean Sea. A unique gaming experience near the beach.",
    amenities: ["Sea View", "Beach Access", "Events"],
    distance: 850,
    tables: [
      {
        id: "v3-t1",
        name: "Beach View Terrace",
        tableNumber: "5",
        capacity: 12,
        availability: { status: "maintenance", until: "Tomorrow" },
        amenities: ["Sea View", "Beach Access", "Events"],
        location: {
          address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
          coordinates: [2.1900, 41.3780],
        },
        distance: 850,
        rating: 4.5
      },
      {
        id: "v3-t2",
        name: "Indoor Lounge",
        tableNumber: "6",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Sea View", "Beach Access", "Events"],
        location: {
          address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
          coordinates: [2.1900, 41.3780],
        },
        distance: 850,
        rating: 4.5
      }
    ]
  }
];

// Standalone Barcelona tables not associated with venues
const standaloneGamingTables: GamingTable[] = [
  {
    id: "st1",
    name: "La Rambla Community Table",
    description: "A spacious table near the famous La Rambla street. Enjoy board games while watching the vibrant Barcelona life.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "L1",
    capacity: 4,
    amenities: ["Central Location", "Outdoor", "People Watching"],
    location: {
      address: "La Rambla, 08002 Barcelona",
      coordinates: [2.1734, 41.3800],
    },
    distance: 500,
    rating: 4.5
  },
  {
    id: "st2",
    name: "Sagrada Família Game Space",
    description: "Play with a view of Gaudí's masterpiece. A premium gaming experience near Barcelona's most iconic landmark.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "H1",
    capacity: 6,
    amenities: ["Landmark View", "Tourist Area", "Photo Opportunities"],
    location: {
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      coordinates: [2.1744, 41.4036],
    },
    distance: 800,
    rating: 4.7
  },
  {
    id: "st3",
    name: "Gothic Quarter Hidden Gem",
    description: "A charming table tucked away in Barcelona's historic Gothic Quarter. Experience the magic of old Barcelona.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "G1",
    capacity: 4,
    amenities: ["Historic Setting", "Quiet", "Authentic Experience"],
    location: {
      address: "Carrer del Bisbe, 08002 Barcelona",
      coordinates: [2.1764, 41.3843],
    },
    distance: 450,
    rating: 4.9
  },
  {
    id: "st4",
    name: "Montjuïc Castle Gaming Table",
    description: "Board gaming with panoramic views of Barcelona and the Mediterranean from Montjuïc Hill.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "occupied", until: "16:00" },
    tableNumber: "M1",
    capacity: 8,
    amenities: ["Panoramic View", "Castle Setting", "Outdoor"],
    location: {
      address: "Ctra. de Montjuïc, 66, 08038 Barcelona",
      coordinates: [2.1663, 41.3644],
    },
    distance: 1200,
    rating: 4.6
  }
];

// Updated mock tables for Barcelona
const mockGamingTables: GamingTable[] = [
  {
    id: "1",
    name: "Barcelona Board Game Café",
    description: "A cozy café with a wide selection of board games and authentic Spanish snacks.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 1",
    distance: 350,
    rating: 4.8,
    location: {
      address: "Carrer de Provença, 181, 08036 Barcelona",
      coordinates: [2.1547, 41.3873],
    },
  },
  {
    id: "2",
    name: "La Rambla Community Table",
    description: "A spacious table near the famous La Rambla street. Enjoy board games while watching the vibrant Barcelona life.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 2",
    distance: 500,
    rating: 4.5,
    location: {
      address: "La Rambla, 08002 Barcelona",
      coordinates: [2.1734, 41.3800],
    },
  },
  {
    id: "3",
    name: "Plaça Catalunya Gaming Zone",
    description: "A community gaming zone near the famous Plaça de Catalunya. Perfect for tourists and locals alike.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "occupied",
      until: "15:30",
    },
    tableNumber: "Table 3",
    distance: 620,
    rating: 4.2,
    location: {
      address: "Plaça de Catalunya, 08002 Barcelona",
      coordinates: [2.1700, 41.3874],
    },
  },
  {
    id: "4",
    name: "Sagrada Família Game Space",
    description: "Play with a view of Gaudí's masterpiece. A premium gaming experience near Barcelona's most iconic landmark.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table 4",
    distance: 800,
    rating: 4.7,
    location: {
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      coordinates: [2.1744, 41.4036],
    },
  },
  {
    id: "5",
    name: "Barceloneta Beach Gaming",
    description: "Play board games with a view of the Mediterranean Sea. A unique gaming experience near the beach.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "maintenance",
      until: "Tomorrow",
    },
    tableNumber: "Table 5",
    distance: 850,
    rating: 4.3,
    location: {
      address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
      coordinates: [2.1900, 41.3780],
    },
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
