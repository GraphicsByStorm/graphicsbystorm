export type SocialId = 'x' | 'github' | 'linkedin' | 'dribbble' | 'instagram' | 'email';
export type SocialLink = { id: SocialId; label: string; href: string; aria?: string };

export const SOCIAL_LINKS: SocialLink[] = [
  { id: 'x',        label: 'X (Twitter)', href: 'https://x.com/GraphicsByStorm' },
  { id: 'github',   label: 'GitHub',      href: 'https://github.com/GraphicsByStorm' },
  { id: 'linkedin', label: 'LinkedIn',    href: 'https://www.linkedin.com/in/StormyWentworth' },
  { id: 'dribbble', label: 'Dribbble',    href: 'https://dribbble.com/GraphicsByStorm' },
  { id: 'instagram',label: 'Instagram',   href: 'https://instagram.com/GraphicsByStorm' },
  { id: 'email',    label: 'Email',       href: 'mailto:business@graphicsbystorm.com' }
];