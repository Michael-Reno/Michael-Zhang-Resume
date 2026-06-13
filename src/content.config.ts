import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// --- experience (markdown collection) -------------------------------------
const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    title: z.string(), // e.g. "Senior Drupal Developer"
    org: z.string(), // e.g. "Queensland Police Service"
    start: z.string(), // "2023-03"
    end: z.string().optional(), // absent = current role
    order: z.number(), // sort key, newest = highest
    tags: z.array(z.string()),
    highlight: z.string(), // one-line summary for the timeline card
  }),
});

// --- projects (markdown collection) ---------------------------------------
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    url: z.string().url().optional(),
    role: z.string(),
    stack: z.array(z.string()),
    category: z.enum(['government', 'ai-lab']),
    order: z.number(),
    summary: z.string(),
  }),
});

// --- resume.json (single-object json collection) --------------------------
// The file loader expects an array/record of entries, so wrap the single
// object under a stable id of "resume".
const resumeSchema = z.object({
  basics: z.object({
    name: z.string(),
    legalName: z.string().optional(),
    label: z.string(),
    labelSecondary: z.string().optional(),
    location: z.string(),
    citizenship: z.string().optional(),
    clearance: z.string().optional(),
    availability: z.string().optional(),
    email: z.string(),
    phone: z.string().optional(),
    phoneNote: z.string().optional(),
    summary: z.string(),
    links: z.array(z.object({ label: z.string(), url: z.string() })),
  }),
  badges: z.array(z.string()),
  typedRoles: z.array(z.string()),
  skills: z.array(z.object({ category: z.string(), items: z.array(z.string()) })),
  aiTransition: z.object({
    heading: z.string(),
    intro: z.string(),
    introNote: z.string().optional(),
  }),
  education: z.array(
    z.object({ degree: z.string(), institution: z.string(), year: z.string() })
  ),
  languages: z.array(z.object({ language: z.string(), level: z.string() })),
  referees: z.object({ note: z.string() }).optional(),
});

const resume = defineCollection({
  loader: file('src/content/resume.json', {
    parser: (text) => ({ resume: JSON.parse(text) }),
  }),
  schema: resumeSchema,
});

export const collections = { experience, projects, resume };
