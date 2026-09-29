import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    summary: z.string().max(120), // one line, shown on cards
    disciplines: z.array(z.enum(["web", "mobile", "side"])).min(1),
    type: z.enum(["client", "personal"]),
    year: z.number(),
    role: z.string(), // e.g. "Solo developer", "Frontend lead"
    stack: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number().default(99), // lower = earlier
    cover: z.string().optional(), // /public path; falls back to blob
    links: z
      .object({
        live: z.url().optional(),
        repo: z.url().optional(),
        store: z.url().optional(),
      })
      .default({}),
    nda: z.boolean().default(false), // shows "Details anonymised" note
  }),
});

export const collections = { projects };
