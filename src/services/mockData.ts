// This is a fallback data source to use when Supabase is unavailable
// It contains mock data for the application to function offline

import { GamingTable } from "./gamingTableData";

export const MOCK_GAMING_TABLES: GamingTable[] = [
  {
    id: "gt-001",
    name: "Table Titans Gaming Lounge",
    description: "Premium gaming table in L'Eixample district with authentic Catalan design. The table features a neoprene surface, cup holders, and dice trays for the perfect 6-player gaming experience. Near Passeig de Gràcia.",
    images: ["https://picsum.photos/seed/gt-001/800/600"],
    capacity: 6,
    host_id: "host-001",
    venueAddress: "Carrer de Provença 165, Barcelona, 08036",
    location: {
      address: "Carrer de Provença 165, Barcelona, 08036",
      coordinates: [2.1533, 41.3891]
    },
    availability: {
      status: "available"
    },
    rating: 4.8,
    reviewCount: 56,
    amenities: ["Free WiFi", "Local craft beer selection", "Air conditioning", "100+ board games collection", "Catalan snacks", "Multilingual game hosts"],
    distance: 0
  },
  {
    id: "gt-002",
    name: "Euro Games Premium Table",
    description: "Intimate 4-player table situated in a quiet café in Eixample Dreta. Specializes in European strategy games with a collection curated by local game designers. Features built-in scoring tracks and storage for game pieces.",
    images: ["https://picsum.photos/seed/gt-002/800/600"],
    capacity: 4,
    host_id: "host-002",
    venueAddress: "Carrer de Balmes 119, Barcelona, 08008",
    location: {
      address: "Carrer de Balmes 119, Barcelona, 08008",
      coordinates: [2.1545, 41.3950]
    },
    availability: {
      status: "available"
    },
    rating: 4.6,
    reviewCount: 42,
    amenities: ["Specialty coffee & tea", "Quiet atmosphere", "Game tutorials in multiple languages", "Euro games collection", "Digital score trackers", "Organic snacks"],
    distance: 0
  },
  {
    id: "gt-003",
    name: "Family Game Zone",
    description: "Spacious 6-player table on Barcelona's iconic Diagonal avenue. Family-friendly space with games in multiple languages (Catalan, Spanish, English). Special Sunday afternoon sessions include traditional Catalan games and local snacks.",
    images: ["https://picsum.photos/seed/gt-003/800/600"],
    capacity: 6,
    host_id: "host-003",
    venueAddress: "Avinguda Diagonal 512, Barcelona, 08006",
    location: {
      address: "Avinguda Diagonal 512, Barcelona, 08006",
      coordinates: [2.1436, 41.3975]
    },
    availability: {
      status: "occupied",
      until: "2023-06-15T18:00:00"
    },
    rating: 4.9,
    reviewCount: 87,
    amenities: ["Traditional Catalan snacks", "Children's play area", "Family restrooms", "Games in Spanish/Catalan/English", "Drawing activities", "Weekend game workshops"],
    distance: 0
  },
  {
    id: "gt-004",
    name: "Strategy Masters Table",
    description: "Upscale 4-player table on the charming pedestrian street of Enric Granados. Perfect for serious strategy gamers with soundproof room and premium components. Hosts regular strategy game nights focusing on Mediterranean-themed games.",
    images: ["https://picsum.photos/seed/gt-004/800/600"],
    capacity: 4,
    host_id: "host-004",
    venueAddress: "Carrer d'Enric Granados 21, Barcelona, 08007",
    location: {
      address: "Carrer d'Enric Granados 21, Barcelona, 08007",
      coordinates: [2.1569, 41.3877]
    },
    availability: {
      status: "available"
    },
    rating: 4.7,
    reviewCount: 43,
    amenities: ["Mediterranean tapas menu", "Local wine selection", "Strategy game library", "Gaming accessories", "Rulebooks in 5 languages", "Private gaming room"],
    distance: 0
  },
  {
    id: "gt-005",
    name: "Classic RPG Gaming Table",
    description: "Immersive 6-player RPG table in Sant Gervasi-Galvany district with ambient lighting that changes based on game scenarios. Features professional sound system and digital mapping tools. Popular for D&D campaigns and one-shot adventures.",
    images: ["https://picsum.photos/seed/gt-005/800/600"],
    capacity: 6,
    host_id: "host-005",
    venueAddress: "Carrer de Muntaner 256, Barcelona, 08021",
    location: {
      address: "Carrer de Muntaner 256, Barcelona, 08021",
      coordinates: [2.1490, 41.3926]
    },
    availability: {
      status: "available"
    },
    rating: 4.9,
    reviewCount: 38,
    amenities: ["Fantasy-themed cocktails", "Immersive ambiance", "Character creation assistance", "Premium DM screen", "3D-printed terrain", "Custom miniatures", "Soundtrack system"],
    distance: 0
  },
  {
    id: "gt-006",
    name: "Tournament Ready Table",
    description: "Competition-grade 4-player table in the Sagrada Familia neighborhood. Features built-in tournament timers, score displays, and professional game components. Hosts weekly card game tournaments with local gaming community.",
    images: ["https://picsum.photos/seed/gt-006/800/600"],
    capacity: 4,
    host_id: "host-006",
    venueAddress: "Carrer de València 401, Barcelona, 08013",
    location: {
      address: "Carrer de València 401, Barcelona, 08013",
      coordinates: [2.1753, 41.4015]
    },
    availability: {
      status: "available"
    },
    rating: 4.7,
    reviewCount: 52,
    amenities: ["Gamer energy drinks", "Tournament organization", "Professional timers", "Official playmats", "Streaming setup", "Card sleeves", "Prize support"],
    distance: 0
  },
  {
    id: "gt-007",
    name: "Gothic Quarter Gaming Table",
    description: "Authentic 6-player medieval-style table in a 14th-century building in the heart of Barcelona's Gothic Quarter. Themed environment with stone walls, wooden beams, and period-appropriate decorations. Specializes in historical and fantasy games.",
    images: ["https://picsum.photos/seed/gt-007/800/600"],
    capacity: 6,
    host_id: "host-007",
    venueAddress: "Carrer del Call 10, Barcelona, 08002",
    location: {
      address: "Carrer del Call 10, Barcelona, 08002",
      coordinates: [2.1752, 41.3834]
    },
    availability: {
      status: "available"
    },
    rating: 4.8,
    reviewCount: 47,
    amenities: ["14th-century venue", "Medieval-inspired beverages", "Ambient music", "Historically accurate games", "Custom wooden pieces", "Candlelit gaming experience"],
    distance: 0
  },
  {
    id: "gt-008",
    name: "Beachside Gaming Table",
    description: "Breezy 4-player table in Barceloneta with views of the Mediterranean. Perfect for casual games while enjoying the sea air. Features adjustable sunshade and weatherproof game components. Popular with tourists and locals for light games and tapas.",
    images: ["https://picsum.photos/seed/gt-008/800/600"],
    capacity: 4,
    host_id: "host-008",
    venueAddress: "Passeig Joan de Borbó 39, Barcelona, 08003",
    location: {
      address: "Passeig Joan de Borbó 39, Barcelona, 08003",
      coordinates: [2.1885, 41.3792]
    },
    availability: {
      status: "available"
    },
    rating: 4.5,
    reviewCount: 63,
    amenities: ["Mediterranean Sea view", "Fresh seafood tapas", "Outdoor seating", "Beach-themed games", "Sangria service", "Quick party games"],
    distance: 0
  }
];