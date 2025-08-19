export type ToneKey = "bucky" | "saira" | "hai" | "bubbles" | "friday" | "taylor";
type AnyTone =
  | ToneKey
  | "friendly" | "dominant" | "chill" | "mean" | "assertive" | "formal" | "kind" | "enthusiastic" | "bratty";

function normalizeTone(tone: AnyTone): ToneKey {
  switch (tone) {
    case "friendly":
    case "kind":
      return "saira";
    case "dominant":
      return "hai";
    case "chill":
      return "bubbles";
    case "mean":
    case "bratty":
      return "friday";
    case "assertive":
    case "enthusiastic":
      return "bucky";
    case "formal":
      return "taylor";
    default:
      return tone as ToneKey;
  }
}

export function phraseCafe(tone: AnyTone, base: string) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky": return `Suit up. Hit ${base}. Mission accepted.`;
    case "saira": return `Float over to ${base} — you got this.`;
    case "hai": return `Get to ${base}. No delays.`;
    case "bubbles": return `Glide to ${base}, nice and easy.`;
    case "friday": return `Get yourself to ${base}, or else.`;
    case "taylor": return `Proceed to ${base} at your earliest convenience.`;
  }
}

export function phraseTime(tone: AnyTone, time: string) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky": return `Launch time: ${time}`;
    case "saira": return `Cozy start at ${time}`;
    case "hai": return `Start ${time}. Be ready.`;
    case "bubbles": return `Drift in around ${time}`;
    case "friday": return `${time}. Move.`;
    case "taylor": return `Scheduled for ${time}`;
  }
}

export function phraseOutfit(tone: AnyTone, outfit: string) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky": return `Uniform: ${outfit}`;
    case "saira": return `Wear: ${outfit} — cute and comfy.`;
    case "hai": return `Outfit: ${outfit}`;
    case "bubbles": return `Fit: ${outfit}, soft vibes.`;
    case "friday": return `Wear ${outfit}. Don’t argue.`;
    case "taylor": return `Attire: ${outfit}`;
  }
}

export function renderCafeText(tone: AnyTone, cafeName: string) {
  return phraseCafe(tone, cafeName);
}

export function renderTimeText(tone: AnyTone, start: Date, end: Date) {
  const startStr = start.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const endStr = end.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const windowStr = `${startStr}–${endStr}`;
  return phraseTime(tone, windowStr);
}

export function renderBooksHeader(tone: AnyTone, count: number) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky": return `Intel: ${count} reads queued`;
    case "saira": return `Your cozy picks (${count})`;
    case "hai": return `Approved reads (${count})`;
    case "bubbles": return `Soft reads (${count})`;
    case "friday": return `Read these (${count})`;
    case "taylor": return `Recommended literature (${count})`;
  }
}

export function renderOutfitText(tone: AnyTone, outfit: string) {
  return phraseOutfit(tone, outfit);
}

export function renderFunTipText(tone: AnyTone, tip: string) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky": return `Bonus objective: ${tip}`;
    case "saira": return `Little nudge: ${tip}`;
    case "hai": return `Directive: ${tip}`;
    case "bubbles": return `Tiny sparkle: ${tip}`;
    case "friday": return `Do it: ${tip}`;
    case "taylor": return `Note: ${tip}`;
  }
}

export { normalizeTone };

export function renderHeader(tone: AnyTone): string {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky":
      return "Gear up, hero! Today’s quest is waiting for you.";
    case "saira":
      return "Hey! Just a little reminder, you’ve got this 💛.";
    case "hai":
      return "Stop stalling. Do it now.";
    case "friday":
      return "Oh look, procrastination strikes again. Shocking.";
    case "bubbles":
      return "Hey, no rush. Just a gentle reminder ✨.";
    case "taylor":
      return "Recommended actions are prepared for your review.";
  }
}

export function getCtaLabels(tone: AnyTone) {
  const t = normalizeTone(tone);
  switch (t) {
    case "bucky":
      return { regenerate: "Re-roll mission", confirm: "Confirm mission", calendar: "Add mission to calendar" };
    case "saira":
      return { regenerate: "Try another", confirm: "Lock it in", calendar: "Add to calendar" };
    case "hai":
      return { regenerate: "Regenerate", confirm: "Confirm", calendar: "Add to calendar" };
    case "friday":
      return { regenerate: "Try again (maybe better)", confirm: "Fine, confirm", calendar: "Add to calendar" };
    case "bubbles":
      return { regenerate: "Flow again", confirm: "Confirm gently", calendar: "Add to calendar" };
    case "taylor":
      return { regenerate: "Regenerate plan", confirm: "Confirm plan", calendar: "Add to calendar" };
  }
}

