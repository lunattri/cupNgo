import { cafes } from "@/data/cafes";
import { books } from "@/data/books";
import { outfits } from "@/data/outfits";
import { activities } from "@/data/activities";
import { fetchBestBookCover } from "@/lib/covers";
import { searchCafesNear } from "@/lib/google";
import { searchCafesNearAggregated } from "@/lib/cafes";

export type Vibe =
  | "cozy"
  | "quiet"
  | "airy"
  | "artsy"
  | "study"
  | "chic"
  | "minimalist"
  | "crowded"
  | "not_busy"
  | "colorful";

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

export function generateTime(dateISO: string) {
  const base = new Date(dateISO);
  base.setHours(randomBetween(10, 17), [0, 15, 30, 45][randomBetween(0, 3)], 0, 0);
  const end = new Date(base.getTime() + 90 * 60 * 1000);
  return { start: base, end };
}

export type GeoPoint = { lat: number; lng: number };

function haversineKm(a: GeoPoint, b: GeoPoint): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

function normalizeVibe(v: Vibe): "cozy" | "quiet" | "airy" | "artsy" | "study" {
  switch (v) {
    case "chic":
    case "colorful":
      return "artsy";
    case "minimalist":
      return "quiet";
    case "crowded":
      return "airy";
    case "not_busy":
      return "quiet";
    default:
      return v as any;
  }
}

function moodToBookVibe(mood?: string): Vibe | null {
  switch (mood) {
    case "happy":
      return "airy"; // light, upbeat
    case "meh":
      return "quiet"; // gentle, low-friction
    case "sad_af":
      return "cozy"; // comforting read
    case "mild_sad":
      return "cozy";
    case "chill":
      return "airy";
    default:
      return null;
  }
}

export async function generatePlanAsync(
  dateISO: string,
  selectedVibes: (Vibe|"any")[],
  options?: { cafeId?: string; origin?: GeoPoint; start?: string; mood?: string }
) {
  const allVibes: Vibe[] = [
    "cozy","quiet","airy","artsy","study","chic","minimalist","crowded","not_busy","colorful"
  ];
  const picked = selectedVibes.includes("any") ? pick(allVibes) : pick(selectedVibes as Vibe[]);
  const chosenVibe = normalizeVibe(picked);

  let cafe: { name: string; address: string; image: string; lat?: number; lng?: number } | undefined =
    options?.cafeId ? (cafes.find(c => c.id === options?.cafeId) as any) : undefined;

  if (options?.origin) {
    // Prefer dynamic results near the user's origin using multiple sources
    try {
      const keyword = chosenVibe; // simple hint for providers
      const nearby = await searchCafesNearAggregated(options.origin, keyword, 7000);
      if (nearby.length > 0) {
        // Choose the closest
        nearby.sort((a, b) => haversineKm(options.origin!, a.location) - haversineKm(options.origin!, b.location));
        const first = nearby[0];
        cafe = {
          name: first.name,
          address: first.address,
          image: first.image || (cafes[0]?.image as any) || "",
          lat: first.location.lat,
          lng: first.location.lng,
        };
      }
    } catch {
      // ignore, fall back to local dataset
    }
  }

  if (!cafe) {
    const pool = cafes.filter(c => (c.vibes as any).includes(chosenVibe));
    cafe = pick(pool.length ? (pool as any) : (cafes as any));
  }

  const moodVibe = moodToBookVibe(options?.mood);
  const bookTargetVibe = moodVibe ?? chosenVibe;
  const bookPool = books.filter(b => b.vibe === bookTargetVibe);
  // pick 3 recommendations
  const pool = (bookPool.length ? bookPool : books).slice();
  const picks = [] as typeof books;
  while (picks.length < 3 && pool.length) {
    picks.push(pool.splice(Math.floor(Math.random()*pool.length),1)[0]);
  }
  const withCovers = await Promise.all(picks.map(async (b) => ({
    ...b,
    image: (await fetchBestBookCover(b.title, b.author)) || b.image,
  })));

  const outfitPool = outfits.filter(o => o.vibe === chosenVibe);
  const outfit = pick(outfitPool.length ? outfitPool : outfits);

  let start: Date;
  let end: Date;
  if (options?.start) {
    start = new Date(options.start);
    end = new Date(start.getTime() + 90 * 60 * 1000);
  } else {
    const t = generateTime(dateISO);
    start = t.start;
    end = t.end;
  }

  const funTips = [
    "Carry something pink today",
    "Add a hair clip before you leave",
    "Wear blue socks for luck",
    "Bring a sticky note to doodle",
    "Take a photo of your setup",
  ];
  const funTip = funTips[Math.floor(Math.random() * funTips.length)];

  const funActivity = activities[Math.floor(Math.random() * activities.length)];
  return { vibe: chosenVibe, cafe, books: withCovers, outfit, start, end, funTip, funActivity };
}


