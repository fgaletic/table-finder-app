
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

// Barcelona gaming venues - these are real coordinates and addresses in Barcelona
const mockGamingVenues: GamingVenue[] = [
  {
    id: "v1",
    name: "Kaburi Café",
    location: {
      address: "Carrer dels Escudellers, 54, 08002 Barcelona",
      coordinates: [2.1766, 41.3796],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    reviewCount: 94,
    description: "Popular board game café in the Gothic Quarter of Barcelona with over 700 games and a café menu.",
    amenities: ["Coffee & Snacks", "WiFi", "Over 700 Games"],
    distance: 250,
    tables: [
      {
        id: "v1-t1",
        name: "Window Table",
        tableNumber: "K1",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Coffee Service", "Game Library Access", "WiFi"],
        location: {
          address: "Carrer dels Escudellers, 54, 08002 Barcelona",
          coordinates: [2.1766, 41.3796],
        },
        distance: 250,
        rating: 4.8
      },
      {
        id: "v1-t2",
        name: "Private Room",
        tableNumber: "K2",
        capacity: 8,
        availability: { status: "occupied", until: "18:30" },
        amenities: ["Private Space", "Game Library Access", "WiFi"],
        location: {
          address: "Carrer dels Escudellers, 54, 08002 Barcelona",
          coordinates: [2.1766, 41.3796],
        },
        distance: 250,
        rating: 4.8
      }
    ]
  },
  {
    id: "v2",
    name: "Sandoichi Board Game Bar",
    location: {
      address: "Carrer del Rec, 10, 08003 Barcelona",
      coordinates: [2.1829, 41.3845],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.6,
    reviewCount: 75,
    description: "Japanese-inspired board game bar with snacks, drinks, and a large collection of games near El Born.",
    amenities: ["Japanese Snacks", "Cocktails", "Game Library"],
    distance: 520,
    tables: [
      {
        id: "v2-t1",
        name: "Tatami Table",
        tableNumber: "S1",
        capacity: 6,
        availability: { status: "available" },
        amenities: ["Japanese-style Seating", "Food Service", "Drink Menu"],
        location: {
          address: "Carrer del Rec, 10, 08003 Barcelona",
          coordinates: [2.1829, 41.3845],
        },
        distance: 520,
        rating: 4.6
      },
      {
        id: "v2-t2",
        name: "Bar Area",
        tableNumber: "S2",
        capacity: 4,
        availability: { status: "available" },
        amenities: ["Bar Seating", "Full Menu", "Game Library Access"],
        location: {
          address: "Carrer del Rec, 10, 08003 Barcelona",
          coordinates: [2.1829, 41.3845],
        },
        distance: 520,
        rating: 4.6
      }
    ]
  },
  {
    id: "v3",
    name: "Juego Barcelona",
    location: {
      address: "Carrer d'Astúries, 84, 08024 Barcelona",
      coordinates: [2.1542, 41.4046],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.7,
    reviewCount: 120,
    description: "Modern board game café in Gràcia with premium coffee, tapas, and a curated selection of tabletop games.",
    amenities: ["Tapas", "Local Craft Beer", "Premium Coffee"],
    distance: 1250,
    tables: [
      {
        id: "v3-t1",
        name: "Outdoor Terrace",
        tableNumber: "J1",
        capacity: 6,
        availability: { status: "available" },
        amenities: ["Outdoor Seating", "Full Menu", "Heaters in Winter"],
        location: {
          address: "Carrer d'Astúries, 84, 08024 Barcelona",
          coordinates: [2.1542, 41.4046],
        },
        distance: 1250,
        rating: 4.7
      },
      {
        id: "v3-t2",
        name: "Lounge Area",
        tableNumber: "J2",
        capacity: 8,
        availability: { status: "maintenance", until: "Tomorrow" },
        amenities: ["Comfortable Seating", "Coffee Service", "Game Library"],
        location: {
          address: "Carrer d'Astúries, 84, 08024 Barcelona",
          coordinates: [2.1542, 41.4046],
        },
        distance: 1250,
        rating: 4.7
      }
    ]
  }
];

// Barcelona standalone gaming tables not associated with venues
const standaloneGamingTables: GamingTable[] = [
  {
    id: "st1",
    name: "Plaça Reial Community Table",
    description: "Public table in the beautiful Plaza Real, perfect for casual gaming while enjoying the atmosphere of one of Barcelona's most famous squares.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "PR1",
    capacity: 4,
    amenities: ["Public Space", "Nearby Cafés", "Fountain View"],
    location: {
      address: "Plaça Reial, 08002 Barcelona",
      coordinates: [2.1761, 41.3797],
    },
    distance: 270,
    rating: 4.5
  },
  {
    id: "st2",
    name: "Sagrada Família Game Space",
    description: "Play with a view of Gaudí's masterpiece. A premium gaming experience near Barcelona's most iconic landmark.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "SF1",
    capacity: 6,
    amenities: ["Landmark View", "Tourist Area", "Photo Opportunities"],
    location: {
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      coordinates: [2.1744, 41.4036],
    },
    distance: 1800,
    rating: 4.7
  },
  {
    id: "st3",
    name: "Parc de la Ciutadella Gaming Table",
    description: "Enjoy board games in Barcelona's most central park, near the lake and the famous fountain.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "occupied", until: "17:00" },
    tableNumber: "PC1",
    capacity: 4,
    amenities: ["Park Setting", "Nearby Lake", "Natural Shade"],
    location: {
      address: "Passeig de Picasso, 21, 08003 Barcelona",
      coordinates: [2.1871, 41.3875],
    },
    distance: 750,
    rating: 4.3
  },
  {
    id: "st4",
    name: "Barceloneta Beach Gaming",
    description: "Play board games with a view of the Mediterranean Sea. A unique gaming experience near the beach.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: { status: "available" },
    tableNumber: "BB1",
    capacity: 6,
    amenities: ["Sea View", "Beach Access", "Outdoor Experience"],
    location: {
      address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
      coordinates: [2.1900, 41.3780],
    },
    distance: 850,
    rating: 4.4
  }
];

// Updated mock tables for Barcelona - this combines venues and standalone tables
const mockGamingTables: GamingTable[] = [
  {
    id: "1",
    name: "Kaburi Café",
    description: "Popular board game café in the Gothic Quarter of Barcelona with over 700 games and a café menu.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table K1",
    distance: 250,
    rating: 4.8,
    location: {
      address: "Carrer dels Escudellers, 54, 08002 Barcelona",
      coordinates: [2.1766, 41.3796],
    },
  },
  {
    id: "2",
    name: "Plaça Reial Community Table",
    description: "Public table in the beautiful Plaza Real, perfect for casual gaming while enjoying the atmosphere of one of Barcelona's most famous squares.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table PR1",
    distance: 270,
    rating: 4.5,
    location: {
      address: "Plaça Reial, 08002 Barcelona",
      coordinates: [2.1761, 41.3797],
    },
  },
  {
    id: "3",
    name: "Sandoichi Board Game Bar",
    description: "Japanese-inspired board game bar with snacks, drinks, and a large collection of games near El Born.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "occupied",
      until: "18:30",
    },
    tableNumber: "Table S1",
    distance: 520,
    rating: 4.6,
    location: {
      address: "Carrer del Rec, 10, 08003 Barcelona",
      coordinates: [2.1829, 41.3845],
    },
  },
  {
    id: "4",
    name: "Parc de la Ciutadella Gaming Table",
    description: "Enjoy board games in Barcelona's most central park, near the lake and the famous fountain.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "occupied",
      until: "17:00",
    },
    tableNumber: "Table PC1",
    distance: 750,
    rating: 4.3,
    location: {
      address: "Passeig de Picasso, 21, 08003 Barcelona",
      coordinates: [2.1871, 41.3875],
    },
  },
  {
    id: "5",
    name: "Barceloneta Beach Gaming",
    description: "Play board games with a view of the Mediterranean Sea. A unique gaming experience near the beach.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table BB1",
    distance: 850,
    rating: 4.4,
    location: {
      address: "Passeig Marítim de la Barceloneta, 08003 Barcelona",
      coordinates: [2.1900, 41.3780],
    },
  },
  {
    id: "6",
    name: "Sagrada Família Game Space",
    description: "Play with a view of Gaudí's masterpiece. A premium gaming experience near Barcelona's most iconic landmark.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "available",
    },
    tableNumber: "Table SF1",
    distance: 1800,
    rating: 4.7,
    location: {
      address: "Carrer de Mallorca, 401, 08013 Barcelona",
      coordinates: [2.1744, 41.4036],
    },
  },
  {
    id: "7",
    name: "Juego Barcelona",
    description: "Modern board game café in Gràcia with premium coffee, tapas, and a curated selection of tabletop games.",
    images: ["/placeholder.svg", "/placeholder.svg"],
    availability: {
      status: "maintenance",
      until: "Tomorrow",
    },
    tableNumber: "Table J1",
    distance: 1250,
    rating: 4.7,
    location: {
      address: "Carrer d'Astúries, 84, 08024 Barcelona",
      coordinates: [2.1542, 41.4046],
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
