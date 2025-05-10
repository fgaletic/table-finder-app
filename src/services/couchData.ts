
export interface Couch {
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
  availability: {
    status: "available" | "occupied" | "maintenance";
    until?: string;
  };
  distance?: number; // in meters
}

const mockCouches: Couch[] = [
  {
    id: "1",
    name: "Comfy Corner Couch",
    location: {
      address: "123 Main St, Downtown",
      coordinates: [-74.006, 40.7128], // NYC
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.8,
    reviewCount: 32,
    description: "A comfortable corner couch in a quiet café with good WiFi and power outlets nearby.",
    amenities: ["WiFi", "Power Outlet", "Coffee Shop", "Quiet"],
    availability: {
      status: "available"
    },
    distance: 350
  },
  {
    id: "2",
    name: "Library Lounge Sofa",
    location: {
      address: "45 Park Ave, Midtown",
      coordinates: [-73.985, 40.7135],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.5,
    reviewCount: 18,
    description: "A plush sofa in the public library's reading room. Very quiet with great natural light.",
    amenities: ["WiFi", "Quiet", "Natural Light", "Air Conditioning"],
    availability: {
      status: "available"
    },
    distance: 750
  },
  {
    id: "3",
    name: "Mall Rest Area Couch",
    location: {
      address: "100 Shopping Center Blvd",
      coordinates: [-73.975, 40.7140],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 3.9,
    reviewCount: 45,
    description: "A sturdy couch in the mall's upper level rest area. Good for short breaks between shopping.",
    amenities: ["WiFi", "Food Court Nearby", "Bathroom Nearby"],
    availability: {
      status: "occupied",
      until: "3:30 PM"
    },
    distance: 1200
  },
  {
    id: "4",
    name: "Hotel Lobby Sofa",
    location: {
      address: "200 Luxury Lane",
      coordinates: [-74.015, 40.7150],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.9,
    reviewCount: 27,
    description: "An elegant leather sofa in a boutique hotel lobby with free WiFi for visitors.",
    amenities: ["WiFi", "Power Outlet", "Air Conditioning", "Restroom Access", "Coffee Available"],
    availability: {
      status: "available"
    },
    distance: 600
  },
  {
    id: "5",
    name: "Student Center Lounge",
    location: {
      address: "500 Campus Drive",
      coordinates: [-74.025, 40.7100],
    },
    images: ["/placeholder.svg", "/placeholder.svg"],
    rating: 4.2,
    reviewCount: 52,
    description: "A well-used but comfortable sectional in the university student center. Lively atmosphere.",
    amenities: ["WiFi", "Power Outlet", "Cafeteria Nearby", "Vending Machines"],
    availability: {
      status: "maintenance",
      until: "Tomorrow"
    },
    distance: 900
  },
];

export const getCouches = (): Promise<Couch[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockCouches);
    }, 500);
  });
};

export const getCouchById = (id: string): Promise<Couch | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const couch = mockCouches.find(couch => couch.id === id);
      resolve(couch);
    }, 300);
  });
};
