export interface Hero {
  name: string;
  cost: number;
  bps: number;
  emoji: string;
  description: string;
}

export interface Achievement {
  name: string;
  description: string;
  type: 'burgers' | 'clicks' | 'heroes' | 'bps';
  target: number;
  reward?: string;
  completed?: boolean;
}

export const INITIAL_CLICK_POWER = 1;

export const HEROES: Hero[] = [
  {
    name: "Arachnid Lad",
    cost: 50,
    bps: 0.2,
    emoji: "🕷️",
    description: "Your friendly neighborhood burger flipper"
  },
  {
    name: "Thore",
    cost: 150,
    bps: 0.7,
    emoji: "⚡",
    description: "God of Thunder and Grilling"
  },
  {
    name: "Optimus Subprime",
    cost: 400,
    bps: 1.5,
    emoji: "🤖",
    description: "Transforms burgers in disguise"
  },
  {
    name: "Compy Comrade",
    cost: 1000,
    bps: 3,
    emoji: "🦖",
    description: "First Avenger of the Grill"
  },
  {
    name: "Irony Man",
    cost: 2000,
    bps: 6,
    emoji: "🔥",
    description: "Genius, billionaire, playboy, burger chef"
  },
  {
    name: "The Incredible Bulk",
    cost: 5000,
    bps: 10,
    emoji: "💚",
    description: "You wouldn't like him when he's hungry"
  },
  {
    name: "Doctor Sandwich",
    cost: 10000,
    bps: 20,
    emoji: "🥪",
    description: "Master of the mystic meats"
  },
  {
    name: "Black Window",
    cost: 25000,
    bps: 50,
    emoji: "🕸️",
    description: "Deadly efficient burger assassin"
  },
  {
    name: "Hawkeye Burger",
    cost: 50000,
    bps: 100,
    emoji: "🏹",
    description: "Never misses a perfect patty flip"
  },
  {
    name: "Nick Furry",
    cost: 100000,
    bps: 200,
    emoji: "👁️",
    description: "Director of B.U.R.G.E.R."
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    name: "First Burger",
    description: "Grill your first burger",
    type: "burgers",
    target: 1,
    reward: "The beginning of greatness!"
  },
  {
    name: "Click Maniac",
    description: "Accumulate 100 burgers",
    type: "burgers",
    target: 100,
    reward: "You're getting the hang of this!"
  },
  {
    name: "Buy Arachnid Lad",
    description: "Hire your first hero",
    type: "heroes",
    target: 1,
    reward: "Teamwork makes the dream work!"
  },
  {
    name: "Buy All Heroes Once",
    description: "Own at least one of each hero",
    type: "heroes",
    target: 5,
    reward: "Diverse team assembled!"
  },
  {
    name: "Burger Tycoon",
    description: "Accumulate 10,000 burgers",
    type: "burgers",
    target: 10000,
    reward: "The grill master emerges!"
  },
  {
    name: "Hire Irony Man",
    description: "Hire the most expensive hero",
    type: "burgers",
    target: 10000,
    reward: "Premium hero acquired!"
  },
  {
    name: "Assemble the League",
    description: "Own 5 of each hero type",
    type: "heroes",
    target: 25,
    reward: "Full league assembled!"
  },
  {
    name: "McBillionaire",
    description: "Accumulate 100,000 burgers",
    type: "burgers",
    target: 100000,
    reward: "Financial burger empire!"
  },
  {
    name: "Derp Collector",
    description: "Own 25 heroes total",
    type: "heroes",
    target: 25,
    reward: "Hero collection master!"
  },
  {
    name: "Efficiency God",
    description: "Reach 50 BPS",
    type: "bps",
    target: 50,
    reward: "Production line perfected!"
  }
];

export const HIDDEN_ACHIEVEMENTS: Achievement[] = [
  {
    name: "Cape Batguy Who?",
    description: "Secret achievement unlocked!",
    type: "burgers",
    target: 420,
    reward: "Easter egg discovered!"
  },
  {
    name: "Burger Overload",
    description: "Nice number of burgers!",
    type: "burgers",
    target: 6969,
    reward: "Meme achievement unlocked!"
  },
  {
    name: "Too Many Heroes",
    description: "You have a lot of heroes!",
    type: "heroes",
    target: 50,
    reward: "Hero hoarder status achieved!"
  },
  {
    name: "You Actually Played This Long?",
    description: "Seriously impressive dedication",
    type: "burgers",
    target: 99999,
    reward: "Persistence pays off!"
  },
  {
    name: "Face That Guy",
    description: "Unlock the final boss battle",
    type: "burgers",
    target: 500000,
    reward: "The final challenge awaits!"
  },
  {
    name: "Defeated That Guy",
    description: "Beat the ultimate boss",
    type: "burgers",
    target: 1000000,
    reward: "True game completion!"
  }
];

export interface Boss {
  name: string;
  maxHealth: number;
  currentHealth: number;
  isActive: boolean;
  isDefeated: boolean;
  damagePerClick: number;
  unlockRequirement: number;
}

export const THAT_GUY_BOSS: Boss = {
  name: "That Guy",
  maxHealth: 1000000,
  currentHealth: 1000000,
  isActive: false,
  isDefeated: false,
  damagePerClick: 1,
  unlockRequirement: 500000
};
