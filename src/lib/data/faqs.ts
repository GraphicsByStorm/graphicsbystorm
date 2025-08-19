export type FAQ = { slug: string; q: string; a: string };
export type FAQGroup = { title: string; items: FAQ[] };

// quick helper so IDs stay stable
const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const FAQ_GROUPS: FAQGroup[] = [
  {
    title: 'Process & Collaboration',
    items: [
      {
        q: 'How do we start?',
        a: `Send a quick brief via the contact form (“Start a project”). We’ll schedule Discovery, confirm scope & price, and take a deposit to reserve your slot.`,
        slug: slugify('How do we start?')
      },
      {
        q: 'What does collaboration look like?',
        a: `Weekly 1:1 check-ins with async progress in between. My availability is Mon–Wed & Fri 5–8 PM ET; I keep communication crisp and decision-focused.`,
        slug: slugify('What does collaboration look like?')
      },
      {
        q: 'How many revisions are included?',
        a: `Two rounds are standard at each major stage (concepts & final). Extra iterations are welcomed and billed hourly so quality never gets rushed.`,
        slug: slugify('How many revisions are included?')
      },
      {
        q: 'Do you build websites end-to-end?',
        a: `Yes—Svelte/SvelteKit/Astro + Tailwind, Prisma, and Firebase where it fits. I can scope design through implementation, deployment, and basic analytics.`,
        slug: slugify('Do you build websites end-to-end?')
      },
      {
        q: 'Do you offer ongoing support?',
        a: `Yes—retainers are available for video editing, social kits, and iterative design/dev. Tell me your cadence and I’ll tailor a plan.`,
        slug: slugify('Do you offer ongoing support?')
      }
    ]
  },
  {
    title: 'Pricing, Timeline & Ownership',
    items: [
      {
        q: 'How do you price projects?',
        a: `Most work is quoted as a fixed project price after Discovery, based on scope and timeline. My baseline rate is $30/hr. Typical ranges are shown in Services; your quote includes scope, deliverables, and schedule.`,
        slug: slugify('How do you price projects?')
      },
      {
        q: 'What’s the usual turnaround?',
        a: `Small engagements: 3–5 days. Typical projects: 1–3 weeks. Larger branding/web: 3–8+ weeks. Rush work is available (+25–50%) if my calendar allows.`,
        slug: slugify('What’s the usual turnaround?')
      },
      {
        q: 'What deliverables do I receive?',
        a: `Final exports (PNG/JPG/SVG/WEBP as relevant), source files (AI/PSD/Affinity/InDesign where applicable), and a File-Format Guide with contact info for support.`,
        slug: slugify('What deliverables do I receive?')
      },
      {
        q: 'Who owns the work?',
        a: `Upon final payment you receive full rights to the approved deliverables. Third-party assets (fonts, stock) remain under their own licenses.`,
        slug: slugify('Who owns the work?')
      },
      {
        q: 'What files do you hand off for print and web?',
        a: `Print: PDF/X with bleeds & dielines; packaged InDesign where needed. Web: optimized SVG/PNG/JPG/WEBP and componentized assets ready for dev.`,
        slug: slugify('What files do you hand off for print and web?')
      }
    ]
  }
];
