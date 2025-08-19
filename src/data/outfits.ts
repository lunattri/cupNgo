export type Outfit = {
  suggestion: string;
  colors: string[];
  vibe: "cozy" | "quiet" | "airy" | "artsy" | "study";
};

export const outfits: Outfit[] = [
  { suggestion: "White tee, blue jeans, light cardigan", colors: ["white","blue"], vibe: "cozy" },
  { suggestion: "Monochrome neutrals with a soft sweater", colors: ["beige","white"], vibe: "quiet" },
  { suggestion: "White shirt and navy trousers", colors: ["white","navy"], vibe: "study" },
  { suggestion: "Breton stripes with denim", colors: ["white","blue"], vibe: "airy" },
  { suggestion: "Simple black top with an artful accessory", colors: ["black","gold"], vibe: "artsy" },
];









