import { searchCafesNear as googleSearch } from "@/lib/google";

export type GeoPoint = { lat: number; lng: number };

export type CafeCandidate = {
  name: string;
  address: string;
  location: GeoPoint;
  image: string | null;
  source: "google" | "yelp" | "foursquare" | "osm";
  rating?: number;
  url?: string;
};

async function searchCafesYelp(origin: GeoPoint, keyword: string, radiusMeters: number): Promise<CafeCandidate[]> {
  const apiKey = process.env.YELP_API_KEY;
  if (!apiKey) return [];
  const url = new URL("https://api.yelp.com/v3/businesses/search");
  url.searchParams.set("term", keyword ? `${keyword} cafe` : "cafe");
  url.searchParams.set("latitude", String(origin.lat));
  url.searchParams.set("longitude", String(origin.lng));
  url.searchParams.set("radius", String(Math.min(radiusMeters, 40000)));
  url.searchParams.set("categories", "cafes,coffee,coffeeshops");
  url.searchParams.set("limit", "20");
  try {
    const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${apiKey}` }, cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const items = (data.businesses || []) as any[];
    return items.map((b) => ({
      name: b.name || "",
      address: Array.isArray(b.location?.display_address) ? b.location.display_address.join(", ") : (b.location?.address1 || ""),
      location: { lat: b.coordinates?.latitude, lng: b.coordinates?.longitude },
      image: typeof b.image_url === "string" && b.image_url.length ? b.image_url : null,
      source: "yelp" as const,
      rating: typeof b.rating === "number" ? b.rating : undefined,
      url: typeof b.url === "string" ? b.url : undefined,
    })).filter((c) => Number.isFinite(c.location.lat) && Number.isFinite(c.location.lng));
  } catch {
    return [];
  }
}

async function searchCafesFoursquare(origin: GeoPoint, keyword: string, radiusMeters: number): Promise<CafeCandidate[]> {
  const apiKey = process.env.FOURSQUARE_API_KEY;
  if (!apiKey) return [];
  const url = new URL("https://api.foursquare.com/v3/places/search");
  url.searchParams.set("ll", `${origin.lat},${origin.lng}`);
  url.searchParams.set("radius", String(Math.min(radiusMeters, 100000)));
  // Coffee Shop (13032) and Café (13035)
  url.searchParams.set("categories", "13032,13035");
  if (keyword) url.searchParams.set("query", keyword);
  url.searchParams.set("limit", "20");
  try {
    const res = await fetch(url.toString(), { headers: { Authorization: apiKey, Accept: "application/json" }, cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const items = (data.results || []) as any[];
    return items.map((r) => ({
      name: r.name || "",
      address: r.location?.formatted_address || "",
      location: { lat: r.geocodes?.main?.latitude, lng: r.geocodes?.main?.longitude },
      image: null, // fetching photos requires another call; skip for now
      source: "foursquare" as const,
      rating: undefined,
      url: r.website || undefined,
    })).filter((c) => Number.isFinite(c.location.lat) && Number.isFinite(c.location.lng));
  } catch {
    return [];
  }
}

async function searchCafesOSM(origin: GeoPoint, keyword: string, radiusMeters: number): Promise<CafeCandidate[]> {
  // Overpass QL query for amenity=cafe around point
  // Keyword ignored due to OSM limitations
  const url = "https://overpass-api.de/api/interpreter";
  const query = `[out:json][timeout:12];node["amenity"="cafe"](around:${Math.min(radiusMeters, 20000)},${origin.lat},${origin.lng});out body 20;`;
  try {
    const res = await fetch(url, { method: "POST", body: query, headers: { "Content-Type": "text/plain" }, cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    const elements = (data.elements || []) as any[];
    return elements.map((n) => {
      const addressParts = [n.tags?.["addr:housenumber"], n.tags?.["addr:street"], n.tags?.["addr:city"], n.tags?.["addr:postcode"]]
        .filter(Boolean)
        .join(", ");
      return {
        name: n.tags?.name || "",
        address: addressParts,
        location: { lat: n.lat, lng: n.lon },
        image: null,
        source: "osm" as const,
        rating: undefined,
        url: undefined,
      } as CafeCandidate;
    }).filter((c) => Number.isFinite(c.location.lat) && Number.isFinite(c.location.lng));
  } catch {
    return [];
  }
}

export async function searchCafesNearAggregated(origin: GeoPoint, keyword: string, radiusMeters: number = 7000): Promise<CafeCandidate[]> {
  const [g, y, f, o] = await Promise.all([
    googleSearch(origin, keyword, radiusMeters).catch(() => []),
    searchCafesYelp(origin, keyword, radiusMeters).catch(() => []),
    searchCafesFoursquare(origin, keyword, radiusMeters).catch(() => []),
    searchCafesOSM(origin, keyword, radiusMeters).catch(() => []),
  ]);

  const fromGoogle: CafeCandidate[] = (g || []).map((c) => ({
    name: c.name,
    address: c.address,
    location: c.location,
    image: c.image,
    source: "google",
  }));

  // Deduplicate by name + proximity (~100m)
  const all = [...fromGoogle, ...y, ...f, ...o];
  const deduped: CafeCandidate[] = [];
  for (const c of all) {
    const exists = deduped.some((d) => {
      const sameName = d.name && c.name && d.name.toLowerCase() === c.name.toLowerCase();
      const dLat = d.location.lat - c.location.lat;
      const dLng = d.location.lng - c.location.lng;
      const meters = Math.sqrt(dLat * dLat + dLng * dLng) * 111_139; // rough
      return sameName || meters < 100;
    });
    if (!exists) deduped.push(c);
  }
  return deduped;
}


