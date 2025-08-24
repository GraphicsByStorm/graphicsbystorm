// src/lib/data/services.ts
export type PriceRange = {
  min: number;
  max: number;
  unit?: 'fixed' | 'per-item' | 'per-page' | 'per-minute' | 'per-concept' | 'per-sku' | 'per-pack';
};

export type Tier = {
  name: string;
  price: PriceRange;
  deliverables: string[];
  timeline: string;     // human-readable (e.g., "1–2 weeks")
  notes?: string;
};

export type Service = {
  slug: string;
  title: string;
  blurb: string;
  typicalRange: PriceRange; // headline/typical band
  tiers: Tier[];
  /** Optional per-row accent color (CSS color). Falls back to var(--color-brand-500). */
  accent?: string;
  /** Full-bleed background images for the hover strip (first is default; second crossfades on hover) */
  covers?: string[];
};

export const HOURLY_RATE = 30;   // ✅ your target
export const DAY_RATE = 240;     // ~8h at $30/hr

export function $$fmtUSD(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}
export function $$fmtRange(r: PriceRange): string {
  const base = r.min === r.max ? $$fmtUSD(r.min) : `${$$fmtUSD(r.min)}–${$$fmtUSD(r.max)}`;
  if (!r.unit || r.unit === 'fixed') return base;
  const unitLabel = ({
    'per-item': ' / item',
    'per-page': ' / page',
    'per-minute': ' / minute',
    'per-concept': ' / concept',
    'per-sku': ' / SKU',
    'per-pack': ' / pack',
  } as const)[r.unit];
  return base + unitLabel;
}

export const SERVICES: Service[] = [
  {
    slug: 'branding',
    title: 'Branding',
    blurb: 'Identity systems with critique-driven polish and real-world consistency.',
    typicalRange: { min: 900, max: 15000 },
    accent: 'var(--color-brand-500,#E2A028)',
    covers: [
      '/images/work/awoke/01.png',
      '/images/work/upper-crust/02.png'
    ],
    tiers: [
      {
        name: 'Starter',
        price: { min: 900, max: 1800, unit: 'fixed' }, // 30–60h
        deliverables: [
          'Primary logo + logomark',
          'Basic palette & type pair',
          'Mini style sheet (PDF)',
          '1–2 rounds of revisions'
        ],
        timeline: '2–3 weeks',
      },
      {
        name: 'Identity System',
        price: { min: 3600, max: 8400, unit: 'fixed' }, // 120–280h
        deliverables: [
          'Full logo suite + usage rules',
          'Palette, type, grid & spacing',
          'Social/stream avatars & banners',
          'Brand guide (12–20pp)'
        ],
        timeline: '3–5 weeks',
      },
      {
        name: 'Brand Kit Pro',
        price: { min: 7500, max: 15000, unit: 'fixed' }, // 250–500h
        deliverables: [
          'Identity System + templates',
          'Icon set / patterns (as needed)',
          'Presentation / pitch deck skin',
          'Brand guide (20–40pp)'
        ],
        timeline: '5–8 weeks',
        notes: `Includes weekly 1:1s; extra rounds billed at ${$$fmtUSD(HOURLY_RATE)}/hr.`,
      }
    ],
  },
  {
    slug: 'streaming-kits',
    title: 'Streaming Kits',
    blurb: 'Banners, avatars, overlays, panels—legible on Twitch at a glance.',
    typicalRange: { min: 300, max: 1800 },
    covers: [
      '/images/work/fritz/02.png',
      '/images/work/fritz/06.png'
    ],
    tiers: [
      {
        name: 'Essentials',
        price: { min: 300, max: 600, unit: 'fixed' }, // 10–20h
        deliverables: ['Avatar + banner', 'Panel set (5–8)', 'Offline screen'],
        timeline: '3–5 days',
      },
      {
        name: 'Creator Pack',
        price: { min: 600, max: 1200, unit: 'fixed' }, // 20–40h
        deliverables: ['Essentials + overlay set', 'Alerts (static)', 'Scene frames'],
        timeline: '1–2 weeks',
      },
      {
        name: 'Pro Pack',
        price: { min: 1050, max: 1800, unit: 'fixed' }, // 35–60h
        deliverables: ['Creator Pack + modular variants', 'Animated options (simple)'],
        timeline: '2–3 weeks',
      }
    ],
  },
  {
    slug: 'social-kits',
    title: 'Social Media Kits',
    blurb: 'Reusable templates tuned for engagement and platform constraints.',
    typicalRange: { min: 360, max: 1800 },
    covers: [
      '/images/work/cosmic-rvy/02.png',
      '/images/work/obsidian/02.png'
    ],
    tiers: [
      {
        name: 'Starter',
        price: { min: 360, max: 600, unit: 'fixed' }, // 12–20h
        deliverables: ['3–5 post templates', 'Story template', 'Cover/banner graphics'],
        timeline: '3–5 days',
      },
      {
        name: 'Campaign',
        price: { min: 750, max: 1200, unit: 'fixed' }, // 25–40h
        deliverables: ['8–12 templates', 'Post/story variants', 'Guidelines PDF (basic)'],
        timeline: '1–2 weeks',
      },
      {
        name: 'Team Pack',
        price: { min: 1200, max: 1800, unit: 'fixed' }, // 40–60h
        deliverables: ['Campaign + content system', 'Hand-off call & Looms'],
        timeline: '2 weeks',
      }
    ],
  },
  {
    slug: 'creative-ads',
    title: 'Creative Ads',
    blurb: 'Conversion-minded compositions that read instantly in busy feeds.',
    typicalRange: { min: 120, max: 4200 },
    covers: [
      '/images/work/pit-viper/01.png',
      '/images/work/elite-ak/01.png'
    ],
    tiers: [
      {
        name: 'Single Concept',
        price: { min: 120, max: 240, unit: 'per-concept' }, // 4–8h
        deliverables: ['1 concept', 'Export to 2–3 sizes', '1 round of edits'],
        timeline: '2–4 days',
      },
      {
        name: 'Small Campaign',
        price: { min: 1200, max: 2400, unit: 'fixed' }, // 40–80h
        deliverables: ['3–5 concepts', 'All sizes', 'A/B variations'],
        timeline: '1–2 weeks',
      },
      {
        name: 'Full Campaign',
        price: { min: 2400, max: 4200, unit: 'fixed' }, // 80–140h
        deliverables: ['5–8 concepts', 'Platform suites', 'QA & hand-off'],
        timeline: '2–3 weeks',
      }
    ],
  },
  {
    slug: 'merch-packaging',
    title: 'Merch / Packaging',
    blurb: 'Die-line-aware designs with strong hierarchy and print-safe specs.',
    typicalRange: { min: 600, max: 6000 },
    covers: [
      '/images/work/upper-crust/06.png',
      '/images/work/upper-crust/07.png'
    ],
    tiers: [
      {
        name: 'Single SKU',
        price: { min: 600, max: 1800, unit: 'per-sku' }, // 20–60h
        deliverables: ['1 dieline layout', 'Front/back variants', 'Print-ready files'],
        timeline: '1–2 weeks',
      },
      {
        name: 'Small Line',
        price: { min: 2400, max: 6000, unit: 'fixed' }, // 80–200h
        deliverables: ['3–6 SKUs', 'Colorways', 'Mockups & specs'],
        timeline: '2–4 weeks',
      }
    ],
  },
  {
    slug: 'ui-ux',
    title: 'UI/UX Design',
    blurb: 'Clean, modern interfaces with a bold, gritty edge where it fits.',
    typicalRange: { min: 240, max: 18000 },
    covers: [
      '/images/work/format-guide/01.png',
      '/images/work/format-guide/03.png'
    ],
    tiers: [
      {
        name: 'Page Design',
        price: { min: 240, max: 600, unit: 'per-page' }, // 8–20h / page
        deliverables: ['Wireframe → hi-fi design', 'Responsive states', 'Handoff pack'],
        timeline: '2–5 days / page',
      },
      {
        name: 'Mktg Site',
        price: { min: 3600, max: 7200, unit: 'fixed' }, // 120–240h
        deliverables: ['5–8 page system', 'Design tokens', 'Animations spec'],
        timeline: '2–4 weeks',
      },
      {
        name: 'App/Portal',
        price: { min: 7500, max: 18000, unit: 'fixed' }, // 250–600h
        deliverables: ['Flows & key screens', 'Component library', 'Specs & QA'],
        timeline: '4–8 weeks',
      }
    ],
  },
  {
    slug: 'thumbnails',
    title: 'YouTube Thumbnails',
    blurb: 'High-contrast, mobile-first thumbnails that win the click.',
    typicalRange: { min: 30, max: 720 },
    covers: [
      '/images/work/sopamanxx/01.png',
      '/images/work/sopamanxx/02.png'
    ],
    tiers: [
      {
        name: 'Single',
        price: { min: 30, max: 90, unit: 'per-item' }, // 1–3h
        deliverables: ['1 thumbnail concept', '2 exports (light/dark)'],
        timeline: '24–48 hours',
      },
      {
        name: 'Pack of 5',
        price: { min: 150, max: 360, unit: 'per-pack' }, // 5–12h
        deliverables: ['5 coordinated thumbs', 'Variation matrix'],
        timeline: '3–5 days',
      },
      {
        name: 'Pack of 10',
        price: { min: 300, max: 720, unit: 'per-pack' }, // 10–24h
        deliverables: ['10 thumbnails', 'Batch optimizations'],
        timeline: '1–2 weeks',
      }
    ],
  },
  {
    slug: 'fullstack-web',
    title: 'Full-stack Web',
    blurb: 'Svelte / SvelteKit / Astro / Tailwind / Prisma / Firebase—front to back.',
    typicalRange: { min: 1800, max: 66000 },
    covers: [
      '/images/work/format-guide/02.png',
      '/images/work/format-guide/04.png'
    ],
    tiers: [
      {
        name: 'Micro-site',
        price: { min: 1800, max: 5400, unit: 'fixed' }, // 60–180h
        deliverables: ['1–3 pages', 'CMS-lite or static', 'Deploy + analytics'],
        timeline: '1–3 weeks',
      },
      {
        name: 'Marketing Site',
        price: { min: 6000, max: 15000, unit: 'fixed' }, // 200–500h
        deliverables: ['5–10 pages', 'Content models', 'Basic integrations'],
        timeline: '3–6 weeks',
      },
      {
        name: 'SaaS / MVP',
        price: { min: 18000, max: 66000, unit: 'fixed' }, // 600–2200h
        deliverables: ['Auth, data models (Prisma)', 'UI system', 'Deploy + CI/CD'],
        timeline: '6–12+ weeks',
      }
    ],
  },
  {
    slug: 'video-editing',
    title: 'Video Editing',
    blurb: 'Music-synced gaming montages & professional edits for any content.',
    typicalRange: { min: 300, max: 4800 },
    covers: [
      '/images/work/sopamanxx/02.png',
      '/images/work/awoke/01.png'
    ],
    tiers: [
      {
        name: 'Montage (60–120s)',
        price: { min: 300, max: 900, unit: 'fixed' }, // 10–30h
        deliverables: ['Sync-to-beat edit', 'Color & FX polish', 'Social exports'],
        timeline: '3–7 days',
      },
      {
        name: '10-min Edit',
        price: { min: 600, max: 2400, unit: 'fixed' }, // 20–80h
        deliverables: ['Story sculpting', 'Motion graphics', 'Captions (optional)'],
        timeline: '1–2 weeks',
      },
      {
        name: 'Monthly Retainer',
        price: { min: 1500, max: 4800, unit: 'fixed' }, // 50–160h/mo
        deliverables: ['4–12 edits / month', 'Priority turnaround', 'Asset management'],
        timeline: 'Ongoing',
      }
    ],
  },
];

export const PRICING_NOTES = [
  `Includes weekly 1:1 reviews. Two rounds of revisions are typical; extra rounds billed at ${$$fmtUSD(HOURLY_RATE)}/hr.`,
  'Rush work +25–50%. Source files included where applicable.',
  'Exact quote depends on scope, assets, deadlines, and approvals.'
];
