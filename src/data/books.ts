export type Book = {
  title: string;
  author: string;
  vibe: "cozy" | "quiet" | "airy" | "artsy" | "study";
  image: string;
};

export const books: Book[] = [
  // Cozy
  { title: "The Little Paris Bookshop", author: "Nina George", vibe: "cozy", image: "" },
  { title: "A Man Called Ove", author: "Fredrik Backman", vibe: "cozy", image: "" },
  { title: "The House in the Cerulean Sea", author: "TJ Klune", vibe: "cozy", image: "" },
  { title: "Eleanor Oliphant Is Completely Fine", author: "Gail Honeyman", vibe: "cozy", image: "" },
  { title: "The Guernsey Literary and Potato Peel Pie Society", author: "Mary Ann Shaffer & Annie Barrows", vibe: "cozy", image: "" },
  { title: "Anne of Green Gables", author: "L. M. Montgomery", vibe: "cozy", image: "" },
  { title: "The Secret Garden", author: "Frances Hodgson Burnett", vibe: "cozy", image: "" },
  { title: "The Storied Life of A. J. Fikry", author: "Gabrielle Zevin", vibe: "cozy", image: "" },

  // Quiet
  { title: "Norwegian Wood", author: "Haruki Murakami", vibe: "quiet", image: "" },
  { title: "Stoner", author: "John Williams", vibe: "quiet", image: "" },
  { title: "The Remains of the Day", author: "Kazuo Ishiguro", vibe: "quiet", image: "" },
  { title: "Gilead", author: "Marilynne Robinson", vibe: "quiet", image: "" },
  { title: "A Month in the Country", author: "J. L. Carr", vibe: "quiet", image: "" },
  { title: "Outline", author: "Rachel Cusk", vibe: "quiet", image: "" },
  { title: "Pond", author: "Claire-Louise Bennett", vibe: "quiet", image: "" },
  { title: "The Snow Leopard", author: "Peter Matthiessen", vibe: "quiet", image: "" },

  // Airy
  { title: "Piranesi", author: "Susanna Clarke", vibe: "airy", image: "" },
  { title: "The Alchemist", author: "Paulo Coelho", vibe: "airy", image: "" },
  { title: "The Little Prince", author: "Antoine de Saint-Exupéry", vibe: "airy", image: "" },
  { title: "The Ocean at the End of the Lane", author: "Neil Gaiman", vibe: "airy", image: "" },
  { title: "Howl's Moving Castle", author: "Diana Wynne Jones", vibe: "airy", image: "" },
  { title: "A Wizard of Earthsea", author: "Ursula K. Le Guin", vibe: "airy", image: "" },

  // Artsy
  { title: "The Night Circus", author: "Erin Morgenstern", vibe: "artsy", image: "" },
  { title: "If on a winter's night a traveler", author: "Italo Calvino", vibe: "artsy", image: "" },
  { title: "Invisible Cities", author: "Italo Calvino", vibe: "artsy", image: "" },
  { title: "The Picture of Dorian Gray", author: "Oscar Wilde", vibe: "artsy", image: "" },
  { title: "The Goldfinch", author: "Donna Tartt", vibe: "artsy", image: "" },
  { title: "Just Kids", author: "Patti Smith", vibe: "artsy", image: "" },
  { title: "The Museum of Innocence", author: "Orhan Pamuk", vibe: "artsy", image: "" },
  { title: "Colorless Tsukuru Tazaki and His Years of Pilgrimage", author: "Haruki Murakami", vibe: "artsy", image: "" },

  // Study / Focus / Self-dev
  { title: "Atomic Habits", author: "James Clear", vibe: "study", image: "" },
  { title: "Deep Work", author: "Cal Newport", vibe: "study", image: "" },
  { title: "Digital Minimalism", author: "Cal Newport", vibe: "study", image: "" },
  { title: "Make Time", author: "Jake Knapp & John Zeratsky", vibe: "study", image: "" },
  { title: "Why We Sleep", author: "Matthew Walker", vibe: "study", image: "" },
  { title: "The Productivity Project", author: "Chris Bailey", vibe: "study", image: "" },
  { title: "Show Your Work!", author: "Austin Kleon", vibe: "study", image: "" },
  { title: "The War of Art", author: "Steven Pressfield", vibe: "study", image: "" },
];


