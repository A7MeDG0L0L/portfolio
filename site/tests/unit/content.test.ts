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

  it('16 projects with the right types', () => {
    expect(projects.map((p) => p.slug)).toEqual([
      'bluworks',
      'bluworks-tablet',
      'shop-and-ship',
      'aramex-mobile',
      'aramex-freight',
      'aramex-global-shopper',
      'myus',
      'khosomat',
      'convertify',
      'xo-clash',
      'daily-tips',
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
    expect(projects.filter((p) => p.type === 'app')).toHaveLength(13);
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
    expect(profile.phone).toBe('+201119369127');
    expect(profile.phoneAlt).toBe('+201111199742');
    expect(profile.github.endsWith('/A7MeDG0L0L')).toBe(true);
  });
});

describe('Arabic content mirrors English facts', () => {
  const arProfile = profileSchema.parse(readJson('profile/ar.json'));
  const arExperience = experienceSchema.parse(readJson('experience/ar.json'));
  skillsSchema.parse(readJson('skills/ar.json'));
  certificationsSchema.parse(readJson('certifications/ar.json'));
  const arProjects = fs
    .readdirSync(path.join(root, 'projects'))
    .filter((f) => f.endsWith('.ar.md'))
    .map((f) => projectSchema.parse(matter(fs.readFileSync(path.join(root, 'projects', f), 'utf8')).data))
    .sort((a, b) => a.order - b.order);

  it('same projects, types, links and stack', () => {
    const pick = (p: (typeof projects)[number] | (typeof arProjects)[number]) => ({ slug: p.slug, type: p.type, order: p.order, links: p.links, stack: p.stack });
    expect(arProjects.map(pick)).toEqual(projects.map(pick));
    expect(arProjects.every((p) => p.locale === 'ar')).toBe(true);
  });
  it('same contact details', () => {
    for (const k of ['email', 'whatsapp', 'phone', 'phoneAlt', 'linkedin', 'github'] as const) expect(arProfile[k]).toBe(profile[k]);
  });
  it('same roles and dates', () => {
    const pick = (r: { start: string; end: string | null; inTimeline: boolean; bullets: string[] }) => [r.start, r.end, r.inTimeline, r.bullets.length];
    expect(arExperience.roles.map(pick)).toEqual(experience.roles.map(pick));
  });
});

describe('copy stays within the CV', () => {
  const files = (dir: string) => fs.readdirSync(path.join(root, dir)).map((f) => fs.readFileSync(path.join(root, dir, f), 'utf8'));
  const all = ['profile', 'experience', 'projects'].flatMap(files).join('\n');
  it('makes no claims the CV does not (iOS, startups, invented product features)', () => {
    for (const phrase of [/\biOS\b/, /\bstartups\b/i, /ناشئة/, /catalogue/i, /كتالوج/, /existing WooCommerce/i, /متجر WooCommerce قائم/]) {
      expect(all, String(phrase)).not.toMatch(phrase);
    }
  });
  it('keeps the Khosomat brand untranslated in Arabic', () => {
    expect(fs.readFileSync(path.join(root, 'experience/ar.json'), 'utf8')).not.toMatch(/تطبيق خصومات/);
  });
});

describe('artwork', () => {
  const pub = path.resolve(__dirname, '../../public');
  it('every project icon image and company logo exists in public/', () => {
    const imgs = [...projects.map((p) => p.icon.image).filter(Boolean), ...profile.logos.map((l) => l.src)] as string[];
    expect(imgs.length).toBeGreaterThanOrEqual(12);
    for (const src of imgs) expect(fs.existsSync(path.join(pub, src)), src).toBe(true);
  });
  it('published apps use their real store icon', () => {
    for (const slug of ['bluworks', 'aramex-mobile', 'aramex-freight', 'aramex-global-shopper', 'myus', 'shop-and-ship', 'bluworks-tablet', 'khosomat', 'convertify', 'xo-clash', 'daily-tips', 'nasa-daily', 'made-me-laugh']) {
      expect(projects.find((p) => p.slug === slug)?.icon.image, slug).toBe(`/icons/${slug}.png`);
    }
  });
});

describe('phone selection', () => {
  it('phone hides the extra Aramex apps and Made Me Laugh', () => {
    expect(projects.filter((p) => !p.inPhone).map((p) => p.slug)).toEqual(['aramex-freight', 'aramex-global-shopper', 'myus', 'made-me-laugh']);
  });
});
