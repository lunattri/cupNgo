export async function fetchOpenLibraryCover(title: string, author?: string): Promise<string | null> {
  try {
    const params = new URLSearchParams({ title });
    if (author) params.set("author", author);
    const res = await fetch(`https://openlibrary.org/search.json?${params.toString()}`, { cache: "force-cache" });
    if (!res.ok) return null;
    const data = await res.json();
    const first = data?.docs?.find((d: any) => d.cover_i) || data?.docs?.[0];
    if (!first || !first.cover_i) return null;
    return `https://covers.openlibrary.org/b/id/${first.cover_i}-L.jpg`;
  } catch {
    return null;
  }
}

export async function fetchBestBookCover(title: string, author?: string): Promise<string | null> {
  // Prefer high-res Google Books, fall back to Open Library
  try {
    const q = encodeURIComponent(`${title} ${author ?? ""}`.trim());
    const url = new URL("https://www.googleapis.com/books/v1/volumes");
    url.searchParams.set("q", q);
    url.searchParams.set("maxResults", "1");
    const res = await fetch(url.toString(), { cache: "force-cache" });
    if (res.ok) {
      const data = await res.json();
      const linkObj = data?.items?.[0]?.volumeInfo?.imageLinks;
      if (linkObj) {
        const order = ["extraLarge","large","medium","small","thumbnail","smallThumbnail"];
        for (const k of order) {
          const v = linkObj[k];
          if (typeof v === "string" && v.length) return v.replace("http://","https://");
        }
      }
    }
  } catch {}
  return await fetchOpenLibraryCover(title, author);
}








