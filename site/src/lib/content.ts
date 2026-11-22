import { getEntry, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/locales';

type DataCollection = 'profile' | 'experience' | 'skills' | 'certifications';

/** Loads a per-locale data entry; falls back to English if the locale file is missing. */
async function load<C extends DataCollection>(collection: C, locale: Locale): Promise<CollectionEntry<C>['data']> {
  const entry = ((await getEntry(collection, locale)) ?? (await getEntry(collection, 'en'))) as CollectionEntry<C> | undefined;
  if (!entry) throw new Error(`Missing content: ${collection}/en.json`);
  return entry.data;
}

export const getProfile = (locale: Locale) => load('profile', locale);
export const getExperience = (locale: Locale) => load('experience', locale);
export const getSkills = (locale: Locale) => load('skills', locale);
export const getCertifications = (locale: Locale) => load('certifications', locale);
