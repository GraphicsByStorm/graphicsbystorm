declare module 'svelte-simple-icons' {
  import type { SvelteComponentTyped } from 'svelte';
  export type ComponentType = new (...args: any[]) =>
    SvelteComponentTyped<{ size?: number | string; color?: string; title?: string }>;

  export const SiAdobephotoshop: ComponentType;
  export const SiAdobeillustrator: ComponentType;
  export const SiAdobeindesign: ComponentType;
  export const SiAffinityphoto: ComponentType;
  export const SiAffinitydesigner: ComponentType;
  export const SiAffinitypublisher: ComponentType;
  export const SiFigma: ComponentType;
  export const SiSvelte: ComponentType;
  export const SiAstro: ComponentType;
  export const SiGithub: ComponentType;
  export const SiTailwindcss: ComponentType;
  export const SiTypescript: ComponentType;
  export const SiPrisma: ComponentType;
  export const SiFirebase: ComponentType;
}
