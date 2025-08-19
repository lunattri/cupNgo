export type ReminderTone =
  | "friendly"
  | "dominant"
  | "kind"
  | "chill"
  | "mean"
  | "enthusiastic"
  | "bratty"
  | "assertive"
  | "formal"
  | "bucky";

const toneTemplates: Record<ReminderTone, string[]> = {
  bucky: [
    // Heroic Challenge
    "Suit up, rookie! The arena’s waiting at {{cafe}} — destiny calls at {{time}}!",
    // Playful Rivalry
    "Oh, you think you’ve got the skills? Cute. Prove it at {{cafe}} by {{time}}.",
    // Victory Rush
    "Boom! Legends are made at {{cafe}}. Your moment hits at {{time}}!",
    // Defeat Flip
    "Ouch… maybe the villain won earlier. But heroes rise — {{cafe}}, {{time}}.",
    // Mysterious Tease
    "Something’s stirring in the shadows near {{cafe}}… meet it at {{time}}.",
    // Team Rally
    "We win as one — rally at {{cafe}} for {{time}}. Let’s make the city proud.",
    // Power-Up Push
    "You’re strong now — wait till you unlock your full potential at {{cafe}} {{time}}.",
    // Epic Countdown
    "Three… two… one… the fate of the world meets you at {{cafe}} by {{time}}!",
  ],
  friendly: [
    "Hey there! Just a quick nudge — {{time}} at {{cafe}}. You’ve got this!",
    "Friendly reminder coming your way — time to take care of it at {{cafe}} around {{time}} 😊",
  ],
  dominant: [
    "Do it now. No excuses.",
    "You know what needs to be done. Get it done.",
  ],
  kind: [
    "Just checking in — don’t forget about this. I believe in you. 💛",
    "A gentle reminder: your to‑do misses you.",
  ],
  chill: [
    "Hey, no rush, but {{time}} could be perfect for {{cafe}}.",
    "Whenever you’re ready — just don’t forget this plan.",
  ],
  mean: [
    "Seriously? Do it already.",
    "How many reminders do you need before you actually do this?",
  ],
  enthusiastic: [
    "Yesss! Time to tackle this! {{time}} at {{cafe}} 🚀",
    "You’re gonna crush this! Go, go, go!",
  ],
  bratty: [
    "Ugh, do I really have to remind you again?",
    "I swear, if you ignore this one more time… 🙄",
  ],
  assertive: [
    "This needs to be done now. Let’s make it happen.",
    "It’s time. Handle it.",
  ],
  formal: [
    "This is a courteous reminder to complete your pending task.",
    "Please be advised that it’s time to proceed with the scheduled action.",
  ],
};

export function renderReminder(tone: ReminderTone, cafe: string, time: Date): string {
  const variants = toneTemplates[tone] ?? toneTemplates.friendly;
  const tpl = variants[Math.floor(Math.random() * variants.length)];
  const timeStr = time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return tpl.replaceAll("{{cafe}}", cafe).replaceAll("{{time}}", timeStr);
}


