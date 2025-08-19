type GeoPoint = { lat: number; lng: number };

const PLACES_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BOOKS_KEY = process.env.GOOGLE_BOOKS_API_KEY;

export type GoogleCafe = {
  name: string;
  address: string;
  location: GeoPoint;
  image: string | null;
};

function buildPhotoUrl(photoRef: string, maxwidth: number = 800) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photoRef}&key=${PLACES_KEY}`;
}

export async function searchCafesNear(origin: GeoPoint, keyword: string, radiusMeters: number = 7000): Promise<GoogleCafe[]> {
  if (!PLACES_KEY) return [];
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${origin.lat},${origin.lng}`);
  url.searchParams.set("radius", String(radiusMeters));
  url.searchParams.set("type", "cafe");
  if (keyword) url.searchParams.set("keyword", keyword);
  url.searchParams.set("key", PLACES_KEY);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const results: GoogleCafe[] = (data.results || []).map((r: any) => ({
    name: r.name,
    address: r.vicinity || r.formatted_address || "",
    location: { lat: r.geometry?.location?.lat, lng: r.geometry?.location?.lng },
    image: r.photos?.[0]?.photo_reference ? buildPhotoUrl(r.photos[0].photo_reference) : null,
  }));
  return results;
}

export type GoogleBook = { title: string; author: string; image: string | null };

export async function searchBooksByQuery(query: string): Promise<GoogleBook[]> {
  const url = new URL("https://www.googleapis.com/books/v1/volumes");
  url.searchParams.set("q", query);
  url.searchParams.set("maxResults", "6");
  url.searchParams.set("printType", "books");
  url.searchParams.set("langRestrict", "en");
  if (BOOKS_KEY) url.searchParams.set("key", BOOKS_KEY);
  const res = await fetch(url.toString(), { cache: "force-cache" });
  if (!res.ok) return [];
  const data = await res.json();
  function best(linkObj: any): string | null {
    if (!linkObj) return null;
    const order = ["extraLarge","large","medium","small","thumbnail","smallThumbnail"];
    for (const k of order) {
      const v = linkObj[k];
      if (typeof v === "string" && v.length) return v.replace("http://","https://");
    }
    return null;
  }
  const items: GoogleBook[] = (data.items || []).map((it: any) => ({
    title: it.volumeInfo?.title || "",
    author: (it.volumeInfo?.authors || [""])[0],
    image: best(it.volumeInfo?.imageLinks),
  }));
  return items;
}

// Places Autocomplete
export type PlaceSuggestion = { description: string; place_id: string };

export async function autocompletePlaces(input: string): Promise<PlaceSuggestion[]> {
  if (!PLACES_KEY || !input) return [];
  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("types", "geocode");
  url.searchParams.set("key", PLACES_KEY);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return [];
  const data = await res.json();
  const preds = (data.predictions || []).map((p: any) => ({ description: p.description, place_id: p.place_id }));
  return preds;
}

export async function placeDetails(placeId: string): Promise<{ address: string; location: GeoPoint } | null> {
  if (!PLACES_KEY || !placeId) return null;
  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "geometry,formatted_address");
  url.searchParams.set("key", PLACES_KEY);
  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  const r = data.result;
  if (!r?.geometry?.location) return null;
  return {
    address: r.formatted_address || "",
    location: { lat: r.geometry.location.lat, lng: r.geometry.location.lng },
  };
}


