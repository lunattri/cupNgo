export type Cafe = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  vibes: ("cozy" | "quiet" | "airy" | "artsy" | "study")[];
  image: string;
};

export const cafes: Cafe[] = [
  {
    id: "neo-bloor",
    name: "Neo Coffee Bar - Bloor",
    address: "770 Bloor St W, Toronto, ON",
    lat: 43.6647,
    lng: -79.4208,
    vibes: ["cozy", "study"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "balzac-distillery",
    name: "Balzac's Distillery",
    address: "1 Trinity St, Toronto, ON",
    lat: 43.6504,
    lng: -79.3596,
    vibes: ["artsy", "airy"],
    image: "https://images.unsplash.com/photo-1453614512568-c4024d13c247?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "boxcar",
    name: "Boxcar Social Harbourfront",
    address: "235 Queens Quay W, Toronto, ON",
    lat: 43.6391,
    lng: -79.3812,
    vibes: ["quiet", "airy"],
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "dineen",
    name: "Dineen Coffee Co.",
    address: "140 Yonge St, Toronto, ON",
    lat: 43.6517,
    lng: -79.3798,
    vibes: ["cozy", "artsy"],
    image: "https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=1200&auto=format&fit=crop",
  },
];


