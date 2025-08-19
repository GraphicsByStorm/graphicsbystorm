// src/lib/icons/tech.ts
export type IconEntry = { icon: string; title: string };

export const TECH_ICONS: Record<string, IconEntry> = {
  Photoshop:            { icon: 'simple-icons:adobephotoshop',   title: 'Adobe Photoshop' },
  Illustrator:          { icon: 'simple-icons:adobeillustrator', title: 'Adobe Illustrator' },
  InDesign:             { icon: 'simple-icons:adobeindesign',    title: 'Adobe InDesign' },

  'Affinity Photo':     { icon: 'simple-icons:affinityphoto',     title: 'Affinity Photo' },
  'Affinity Designer':  { icon: 'simple-icons:affinitydesigner',  title: 'Affinity Designer' },
  'Affinity Publisher': { icon: 'simple-icons:affinitypublisher', title: 'Affinity Publisher' },

  Figma:                { icon: 'simple-icons:figma',       title: 'Figma' },
  Svelte:               { icon: 'simple-icons:svelte',      title: 'Svelte' },
  SvelteKit:            { icon: 'simple-icons:svelte',      title: 'SvelteKit' }, // reuse Svelte glyph
  Astro:                { icon: 'simple-icons:astro',       title: 'Astro' },
  GitHub:               { icon: 'simple-icons:github',      title: 'GitHub' },
  'Tailwind CSS':       { icon: 'simple-icons:tailwindcss', title: 'Tailwind CSS' },
  TypeScript:           { icon: 'simple-icons:typescript',  title: 'TypeScript' },
  Prisma:               { icon: 'simple-icons:prisma',      title: 'Prisma' },
  Firebase:             { icon: 'simple-icons:firebase',    title: 'Firebase' },
};

// Normalize common variants you use
const ALIAS: Record<string, string> = {
  TailwindCss: 'Tailwind CSS',
  tailwindcss: 'Tailwind CSS',
  Github: 'GitHub',
  github: 'GitHub',
  Sveltekit: 'SvelteKit',
  sveltekit: 'SvelteKit',
};

export function iconFor(name: string): IconEntry | undefined {
  const key = ALIAS[name] ?? name;
  return TECH_ICONS[key];
}
