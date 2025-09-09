// Barcelona-focused mock data for gaming tables
// Used as fallback when Supabase is unavailable
// Features authentic Barcelona addresses, neighborhoods, and cultural context

import { GamingTable } from "./gamingTableData";

export const BARCELONA_MOCK_GAMING_TABLES: GamingTable[] = [
  {
    id: "bcn-001",
    name: "Table Titans Gaming Lounge",
    description: "Premium gaming table in L'Eixample district with authentic Catalan design. The table features a neoprene surface, cup holders, and dice trays for the perfect 6-player gaming experience. Near Passeig de Gràcia.",
    images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop"],
    capacity: 6,
    host_id: "host-001",
    location: {
      address: "Carrer de Provença 165, L'Eixample, Barcelona, 08036",
      coordinates: [2.1533, 41.3891]
    },
    availability: {
      status: "available"
    },
    rating: 4.8,
    reviewCount: 56,
    amenities: [
      "Free WiFi", 
      "Local craft beer selection", 
      "Air conditioning", 
      "100+ board games collection", 
      "Catalan snacks", 
      "Multilingual game hosts"
    ],
    distance: 0
  },
  {
    id: "bcn-002",
    name: "Euro Games Premium Table",
    description: "Intimate 4-player table situated in a quiet café in Eixample Dreta. Specializes in European strategy games with a collection curated by local game designers. Features built-in scoring tracks and storage for game pieces.",
    images: ["https://images.unsplash.com/photo-1611371805429-8b5c1b2c34ba?w=800&h=600&fit=crop"],
    capacity: 4,
    host_id: "host-002",
    location: {
      address: "Carrer de Balmes 119, L'Eixample, Barcelona, 08008",
      coordinates: [2.1545, 41.3950]
    },
    availability: {
      status: "available"
    },
    rating: 4.6,
    reviewCount: 42,
    amenities: [
      "Specialty coffee & tea", 
      "Quiet atmosphere", 
      "Game tutorials in multiple languages", 
      "Euro games collection", 
      "Digital score trackers", 
      "Organic snacks"
    ],
    distance: 0
  },
  {
    id: "bcn-003",
    name: "Family Game Zone",
    description: "Spacious 6-player table on Barcelona's iconic Diagonal avenue. Family-friendly space with games in multiple languages (Catalan, Spanish, English). Special Sunday afternoon sessions include traditional Catalan games and local snacks.",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    capacity: 6,
    host_id: "host-003",
    location: {
      address: "Avinguda Diagonal 512, L'Eixample, Barcelona, 08006",
      coordinates: [2.1436, 41.3975]
    },
    availability: {
      status: "occupied",
      until: "2024-01-15T18:00:00"
    },
    rating: 4.9,
    reviewCount: 87,
    amenities: [
      "Traditional Catalan snacks", 
      "Children's play area", 
      "Family restrooms", 
      "Games in Spanish/Catalan/English", 
      "Drawing activities", 
      "Weekend game workshops"
    ],
    distance: 0
  },
  {
    id: "bcn-004",
    name: "Strategy Masters Table",
    description: "Upscale 4-player table on the charming pedestrian street of Enric Granados. Perfect for serious strategy gamers with soundproof room and premium components. Hosts regular strategy game nights focusing on Mediterranean-themed games.",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"],
    capacity: 4,
    host_id: "host-004",
    location: {
      address: "Carrer d'Enric Granados 21, L'Eixample, Barcelona, 08007",
      coordinates: [2.1569, 41.3877]
    },
    availability: {
      status: "available"
    },
    rating: 4.7,
    reviewCount: 43,
    amenities: [
      "Mediterranean tapas menu", 
      "Local wine selection", 
      "Strategy game library", 
      "Gaming accessories", 
      "Rulebooks in 5 languages", 
      "Private gaming room"
    ],
    distance: 0
  },
  {
    id: "bcn-005",
    name: "Classic RPG Gaming Table",
    description: "Immersive 6-player RPG table in Sant Gervasi-Galvany district with ambient lighting that changes based on game scenarios. Features professional sound system and digital mapping tools. Popular for D&D campaigns and one-shot adventures.",
    images: ["https://images.unsplash.com/photo-1578643463800-5b8e78b44570?w=800&h=600&fit=crop"],
    capacity: 6,
    host_id: "host-005",
    location: {
      address: "Carrer de Muntaner 256, Sant Gervasi-Galvany, Barcelona, 08021",
      coordinates: [2.1490, 41.3926]
    },
    availability: {
      status: "available"
    },
    rating: 4.9,
    reviewCount: 38,
    amenities: [
      "Fantasy-themed cocktails", 
      "Immersive ambiance", 
      "Character creation assistance", 
      "Premium DM screen", 
      "3D-printed terrain", 
      "Custom miniatures", 
      "Soundtrack system"
    ],
    distance: 0
  },
  {
    id: "bcn-006",
    name: "Tournament Ready Table",
    description: "Competition-grade 4-player table in the Sagrada Familia neighborhood. Features built-in tournament timers, score displays, and professional game components. Hosts weekly card game tournaments with local gaming community.",
    images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop"],
    capacity: 4,
    host_id: "host-006",
    location: {
      address: "Carrer de València 401, Sagrada Familia, Barcelona, 08013",
      coordinates: [2.1753, 41.4015]
    },
    availability: {
      status: "available"
    },
    rating: 4.7,
    reviewCount: 52,
    amenities: [
      "Gamer energy drinks", 
      "Tournament organization", 
      "Professional timers", 
      "Official playmats", 
      "Streaming setup", 
      "Card sleeves", 
      "Prize support"
    ],
    distance: 0
  },
  {
    id: "bcn-007",
    name: "Gothic Quarter Gaming Table",
    description: "Authentic 6-player medieval-style table in a 14th-century building in the heart of Barcelona's Gothic Quarter. Themed environment with stone walls, wooden beams, and period-appropriate decorations. Specializes in historical and fantasy games.",
    images: ["https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"],
    capacity: 6,
    host_id: "host-007",
    location: {
      address: "Carrer del Call 10, Barri Gòtic, Barcelona, 08002",
      coordinates: [2.1752, 41.3834]
    },
    availability: {
      status: "available"
    },
    rating: 4.8,
    reviewCount: 47,
    amenities: [
      "14th-century venue", 
      "Medieval-inspired beverages", 
      "Ambient music", 
      "Historically accurate games", 
      "Custom wooden pieces", 
      "Candlelit gaming experience"
    ],
    distance: 0
  },
  {
    id: "bcn-008",
    name: "Beachside Gaming Table",
    description: "Breezy 4-player table in Barceloneta with views of the Mediterranean Sea. Perfect for casual games while enjoying the sea air. Features adjustable sunshade and weatherproof game components. Popular with tourists and locals for light games and tapas.",
    images: ["https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop"],
    capacity: 4,
    host_id: "host-008",
    location: {
      address: "Passeig Joan de Borbó 39, La Barceloneta, Barcelona, 08003",
      coordinates: [2.1885, 41.3792]
    },
    availability: {
      status: "available"
    },
    rating: 4.5,
    reviewCount: 63,
    amenities: [
      "Mediterranean Sea view", 
      "Fresh seafood tapas", 
      "Outdoor seating", 
      "Beach-themed games", 
      "Sangria service", 
      "Quick party games"
    ],
    distance: 0
  }
];

// Mock hosts data for Barcelona
export const BARCELONA_MOCK_HOSTS = [
  {
    id: "host-001",
    name: "Marc Vilà",
    email: "marc@tabletitans.bcn",
    bio: "Board game enthusiast and café owner in L'Eixample. Speaks Catalan, Spanish, and English.",
    phone: "+34 93 123 4567",
    avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    is_business: true
  },
  {
    id: "host-002",
    name: "Laura González",
    email: "laura@eurogames.barcelona",
    bio: "Game designer and coffee roaster. Specializes in European strategy games.",
    avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b612b98c?w=150&h=150&fit=crop",
    is_business: false
  },
  {
    id: "host-003",
    name: "Família Espai Jocs",
    email: "info@familiaespai.cat",
    bio: "Family-run gaming space promoting multilingual gaming in Barcelona.",
    phone: "+34 93 234 5678",
    is_business: true
  },
  {
    id: "host-004",
    name: "David Martínez",
    email: "david@strategymasters.es",
    bio: "Wine sommelier and strategy game master. Curates Mediterranean-themed game nights.",
    avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    is_business: false
  },
  {
    id: "host-005",
    name: "Anna Ribas",
    email: "anna@rpgtavern.cat",
    bio: "Professional dungeon master and sound engineer. Creates immersive RPG experiences.",
    phone: "+34 93 345 6789",
    avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    is_business: true
  },
  {
    id: "host-006",
    name: "Tournaments BCN",
    email: "info@tournamentsbcn.com",
    bio: "Competitive gaming organization hosting weekly tournaments in Barcelona.",
    is_business: true
  },
  {
    id: "host-007",
    name: "Miquel Torres",
    email: "miquel@gotic.games",
    bio: "History professor and medieval games enthusiast. Owner of Gothic Quarter venue.",
    avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    is_business: false
  },
  {
    id: "host-008",
    name: "Platja Games",
    email: "hello@platjagames.barcelona",
    bio: "Beachside gaming café offering the best tapas and board games by the Mediterranean.",
    phone: "+34 93 456 7890",
    is_business: true
  }
];

/**
 * Get Barcelona gaming tables with proper distance calculation from city center
 */
export const getBarcelonaMockTables = (): Promise<GamingTable[]> => {
  return new Promise((resolve) => {
    // Barcelona city center (Plaça de Catalunya)
    const BARCELONA_CENTER: [number, number] = [2.1700, 41.3874];
    
    // Calculate distances from city center
    const tablesWithDistance = BARCELONA_MOCK_GAMING_TABLES.map(table => {
      const distance = calculateDistance(
        BARCELONA_CENTER,
        table.location?.coordinates || BARCELONA_CENTER
      );
      
      return {
        ...table,
        distance: Math.round(distance * 1000), // Convert km to meters
      };
    });
    
    // Simulate network delay
    setTimeout(() => {
      resolve(tablesWithDistance);
    }, 300);
  });
};

/**
 * Get a single Barcelona table by ID with host information
 */
export const getBarcelonaMockTableWithHost = (id: string): Promise<{
  table: GamingTable | null;
  host: typeof BARCELONA_MOCK_HOSTS[0] | null;
}> => {
  return new Promise((resolve) => {
    const table = BARCELONA_MOCK_GAMING_TABLES.find(t => t.id === id);
    const host = table 
      ? BARCELONA_MOCK_HOSTS.find(h => h.id === table.host_id) 
      : null;
    
    setTimeout(() => {
      resolve({
        table: table || null,
        host: host || null
      });
    }, 200);
  });
};

/**
 * Calculate distance between two coordinates using Haversine formula
 */
function calculateDistance(
  coords1: [number, number],
  coords2: [number, number]
): number {
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

/**
 * Barcelona neighborhoods covered by mock data
 */
export const BARCELONA_NEIGHBORHOODS_COVERED = [
  "L'Eixample",
  "Sant Gervasi-Galvany", 
  "Sagrada Familia",
  "Barri Gòtic",
  "La Barceloneta"
];

/**
 * Get summary stats about Barcelona mock data
 */
export const getBarcelonaMockStats = () => ({
  totalTables: BARCELONA_MOCK_GAMING_TABLES.length,
  totalHosts: BARCELONA_MOCK_HOSTS.length,
  neighborhoods: BARCELONA_NEIGHBORHOODS_COVERED.length,
  averageRating: BARCELONA_MOCK_GAMING_TABLES.reduce((sum, table) => sum + (table.rating || 0), 0) / BARCELONA_MOCK_GAMING_TABLES.length,
  availableTables: BARCELONA_MOCK_GAMING_TABLES.filter(t => t.availability.status === "available").length
});
