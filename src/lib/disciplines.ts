export const disciplines = {
  web: { label: "Web", color: "#00bae2", blob: ["#00bae2", "#fec5fb"], stack: "React · TypeScript · Tailwind" },
  mobile: { label: "Mobile", color: "#fec5fb", blob: ["#fec5fb", "#9d95ff"], stack: "Flutter · Dart" },
  side: { label: "Side Projects", color: "#9d95ff", blob: ["#9d95ff", "#00bae2"], stack: "Experiments & open source" },
} as const;

export type Discipline = keyof typeof disciplines;
export const disciplineKeys = Object.keys(disciplines) as Discipline[];
