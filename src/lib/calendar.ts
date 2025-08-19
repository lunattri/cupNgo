export function googleCalendarLink(opts: {
  title: string;
  details?: string;
  location?: string;
  start: Date;
  end: Date;
}) {
  const iso = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: opts.title,
    details: opts.details ?? "",
    location: opts.location ?? "",
    dates: `${iso(opts.start)}/${iso(opts.end)}`,
  });
  return `https://www.google.com/calendar/render?${params.toString()}`;
}









