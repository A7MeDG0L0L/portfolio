import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';

export type Project = CollectionEntry<'projects'>;

export async function getProjects(locale: Locale): Promise<Project[]> {
  const all = await getCollection('projects', (p) => p.data.locale === locale);
  return all.sort((a, b) => a.data.order - b.data.order);
}

export function hasCaseStudyPage(p: Project): boolean {
  return p.data.type !== 'approach';
}
