import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  profileSchema,
  projectSchema,
  experienceSchema,
  skillsSchema,
  certificationsSchema,
} from '../../src/content/schemas';

const root = path.resolve(__dirname, '../../src/content');
const readJson = (p: string) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const profile = profileSchema.parse(readJson('profile/en.json'));
const experience = experienceSchema.parse(readJson('experience/en.json'));
const skills = skillsSchema.parse(readJson('skills/en.json'));
const certifications = certificationsSchema.parse(readJson('certifications/en.json'));
const projects = fs
  .readdirSync(path.join(root, 'projects'))
  .filter((f) => f.endsWith('.md') && !f.endsWith('.ar.md'))
  .map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(root, 'projects', f), 'utf8'));
    return { ...projectSchema.parse(data), body: content };
  })
  .sort((a, b) => a.order - b.order);

function strings(value: unknown, skipKeys: string[] = []): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap((v) => strings(v, skipKeys));
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([k, v]) => (skipKeys.includes(k) ? [] : strings(v, skipKeys)));
  }
  return [];
}

describe('English content', () => {
  it('experience has the 6 CV roles, newest first', () => {
    expect(experience.roles.map((r) => r.company)).toEqual([
      'Bluworks',
      'Aramex International LLC',
      'Tecfy.co',
      'The Sparks Foundation',
      'Freelance',
      'Khosomat.com',
    ]);
    expect(experience.roles[0].end).toBeNull();
    expect(experience.roles.map((r) => r.start)).toEqual(['2025-12', '2023-06', '2022-04', '2022-05', '2022-01', '2021-08']);
  });

  it('timeline excludes only the internship', () => {
    expect(experience.roles.filter((r) => r.inTimeline)).toHaveLength(5);
    expect(experience.roles.find((r) => r.company === 'The Sparks Foundation')?.inTimeline).toBe(false);
  });

  it('8 projects with the right types', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'shop-and-ship',
      'bluworks-tablet',
      'khosomat',
      'nasa-daily',
      'made-me-laugh',
      'simple-file-manager',
      'flutter-pdf-designer',
      'ai-dev',
    ]);
    const types = Object.fromEntries(projects.map((p) => [p.slug, p.type]));
    expect(types['simple-file-manager']).toBe('package');
    expect(types['flutter-pdf-designer']).toBe('package');
    expect(types['ai-dev']).toBe('approach');
    expect(projects.filter((p) => p.type === 'app')).toHaveLength(5);
    expect(projects.every((p) => p.locale === 'en')).toBe(true);
  });

  it('no unconfirmed numbers in copy', () => {
    const all = [
      ...strings(profile),
      ...strings(experience),
      ...strings(skills),
      ...strings(certifications),
      ...projects.flatMap((p) => strings(p, ['metrics'])),
    ];
    const offenders = all.filter((s) => /\d+\s?%|\b\d+x\b/i.test(s));
    expect(offenders).toEqual([]);
  });

  it('profile contact matches CV', () => {
    expect(profile.email).toBe('agalal819@gmail.com');
    expect(profile.whatsapp).toBe('+201119369127');
    expect(profile.github.endsWith('/A7MeDG0L0L')).toBe(true);
  });
});
