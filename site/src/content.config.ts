import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { profileSchema, projectSchema, experienceSchema, skillsSchema, certificationsSchema } from './content/schemas';

const data = (dir: string) => glob({ pattern: '*.json', base: `./src/content/${dir}` });

export const collections = {
  profile: defineCollection({ loader: data('profile'), schema: profileSchema }),
  experience: defineCollection({ loader: data('experience'), schema: experienceSchema }),
  skills: defineCollection({ loader: data('skills'), schema: skillsSchema }),
  certifications: defineCollection({ loader: data('certifications'), schema: certificationsSchema }),
  projects: defineCollection({
    loader: glob({ pattern: '*.md', base: './src/content/projects', generateId: ({ entry }) => entry.replace(/\.md$/, '') }),
    schema: projectSchema,
  }),
};
