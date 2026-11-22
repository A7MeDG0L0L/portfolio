import { z } from 'astro/zod';

export const localeSchema = z.enum(['en', 'ar']);

export const profileSchema = z.object({
  name: z.string(),
  title: z.string(),
  location: z.string(),
  headline: z.string(),
  headlineAccent: z.string(),
  intro: z.string(),
  available: z.boolean(),
  availabilityText: z.string(),
  email: z.string().email(),
  whatsapp: z.string().regex(/^\+\d{8,15}$/),
  linkedin: z.string().url(),
  github: z.string().url(),
  ctaHire: z.string(),
  ctaHireHint: z.string(),
  ctaBuild: z.string(),
  ctaBuildHint: z.string(),
  waMessage: z.string(),
  focusLine: z.string(),
  wordmarks: z.array(z.string()),
  stats: z.array(z.object({ value: z.string(), label: z.string() })),
  quickLook: z.object({
    nowLabel: z.string(),
    nowTitle: z.string(),
    nowText: z.string(),
    aiTitle: z.string(),
    aiText: z.string(),
    companiesTitle: z.string(),
    companiesText: z.string(),
    clientsTitle: z.string(),
    clientsText: z.string(),
    stack: z.array(z.string()),
  }),
});

export const projectSchema = z.object({
  title: z.string(),
  short: z.string().max(12),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  type: z.enum(['app', 'package', 'approach']),
  company: z.string().optional(),
  dates: z.string().optional(),
  order: z.number().int(),
  icon: z.object({ label: z.string(), bg: z.string(), fg: z.string().optional() }),
  summary: z.string(),
  problem: z.string().optional(),
  highlights: z.array(z.string()).min(1),
  stack: z.array(z.string()),
  links: z
    .object({
      play: z.string().url().optional(),
      appStore: z.string().url().optional(),
      github: z.string().url().optional(),
      pubdev: z.string().url().optional(),
      web: z.string().url().optional(),
    })
    .default({}),
  metrics: z.array(z.object({ value: z.string(), label: z.string(), confirmedBy: z.literal('ahmed') })).default([]),
  screenshots: z.array(z.object({ src: z.string().min(1), alt: z.string().min(1) })).default([]),
  locale: localeSchema,
});

export const experienceSchema = z.object({
  roles: z.array(
    z.object({
      company: z.string(),
      title: z.string(),
      start: z.string().regex(/^\d{4}-\d{2}$/),
      end: z.string().regex(/^\d{4}-\d{2}$/).nullable(),
      bullets: z.array(z.string()),
      inTimeline: z.boolean(),
      url: z.string().url().optional(),
    }),
  ),
});

export const skillsSchema = z.object({
  groups: z.array(z.object({ name: z.string(), items: z.array(z.string()) })),
});

export const certificationsSchema = z.object({
  items: z.array(
    z.object({
      title: z.string(),
      issuer: z.string().optional(),
      start: z.string(),
      end: z.string(),
      description: z.string(),
      url: z.string().url().optional(),
    }),
  ),
});

export type ProfileData = z.infer<typeof profileSchema>;
export type ProjectData = z.infer<typeof projectSchema>;
export type ExperienceData = z.infer<typeof experienceSchema>;
export type SkillsData = z.infer<typeof skillsSchema>;
export type CertificationsData = z.infer<typeof certificationsSchema>;
