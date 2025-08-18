// src/lib/data/work.ts
export type WorkItem = {
  title: string;
  slug: string;
  blurb: string;        // 1-liner for cards
  summary: string;      // short paragraph for case study intro
  tags: string[];       // filter chips
  tools: string[];      // key apps/skills
  highlights: string[]; // bullets in case study
  cover: string;        // card image
  images: string[];     // gallery
};

export const WORKS: WorkItem[] = [
  {
    title: "Fritz Streaming & Social Package",
    slug: "fritz-streaming-social",
    blurb:
      "Cohesive Twitch kit—banner, avatar, panels, overlays—built for clarity at small sizes with an edgy, textured vibe.",
    summary:
      "A full streaming identity built in Photoshop and Illustrator. High-contrast type and clean panel grids keep information legible on Twitch, while subtle digital-noise textures preserve the channel’s dark, energetic feel.",
    tags: ["Social", "Branding", "Promo"],
    tools: ["Photoshop", "Illustrator"],
    highlights: [
      "Optimized exports for Twitch; crisp panels and overlays.",
      "Readability improvements after critique (stroke/contrast tweaks).",
      "Consistent hierarchy, alignment, and balance across assets."
    ],
    cover: "/images/work/fritz/cover.png",
    images: ["/images/work/fritz/01.png", "/images/work/fritz/02.png", "/images/work/fritz/03.png", "/images/work/fritz/04.png", "/images/work/fritz/05.png", "/images/work/fritz/06.png", "/images/work/fritz/07.png", "/images/work/fritz/08.png"]
  },
  {
    title: "Cosmic RVY Social Package",
    slug: "cosmic-rvy",
    blurb:
      "Retro-neon, cosmic/arcade brand system with scalable vector logo and refined letter-spacing.",
    summary:
      "Logo and social templates leveraging vector scalability and non-destructive editing. A retro-neon palette and balanced negative space keep the mark bold and legible from avatar to banner.",
    tags: ["Social", "Branding"],
    tools: ["Illustrator", "Photoshop"],
    highlights: [
      "Neon/arcade palette with controlled contrast and spacing.",
      "Typographic letter-spacing rebalanced after critique.",
      "Royalty-free textures and custom brushes for consistency."
    ],
    cover: "/images/work/cosmic-rvy/cover.png",
    images: ["/images/work/cosmic-rvy/01.png", "/images/work/cosmic-rvy/02.png"]
  },
  {
    title: "Elite Build AK-47 Giveaway Promo",
    slug: "elite-build-ak47-promo",
    blurb:
      "Layered giveaway creative with spotlight emphasis and corrected text hierarchy for instant recognition.",
    summary:
      "High-res skin renders, masked and blended over dramatic lighting. Central placement, spotlighting, and a refined hierarchy make the skin name and CTA unmistakable.",
    tags: ["Promo"],
    tools: ["Photoshop", "Illustrator"],
    highlights: [
      "Composition studies to balance weapon visibility and type.",
      "Hierarchy/positioning refined after feedback.",
      "Clean rasterization and consistent spacing for readability."
    ],
    cover: "/images/work/elite-ak/cover.png",
    images: ["/images/work/elite-ak/01.png"]
  },
  {
    title: "Pit Viper AWP Giveaway Promo",
    slug: "pit-viper-awp-promo",
    blurb:
      "Diagonal motion, bold type, and deeper gradients for a high-drama giveaway visual at screen-ready fidelity.",
    summary:
      "A motion-forward composition using diagonal alignment and texture to add speed. Strong heading contrast sits over a darker field; exported at high fidelity for crisp online display.",
    tags: ["Promo"],
    tools: ["Photoshop"],
    highlights: [
      "Stronger shadows/gradients for drama.",
      "Title visibility prioritized from the start.",
      "300 DPI export normalized for on-screen clarity."
    ],
    cover: "/images/work/pit-viper/cover.png",
    images: ["/images/work/pit-viper/01.png"]
  },
  {
    title: "AWOKE.GG Branding",
    slug: "awoke-gg-branding",
    blurb:
      "Dimensional logo with esports energy—balanced red/blue palette and clean, grid-led geometry.",
    summary:
      "A perspective-driven mark developed in Illustrator and mocked in Photoshop. The red/blue color story and negative space maintain unity and movement across applications.",
    tags: ["Branding", "Esports"],
    tools: ["Illustrator", "Photoshop"],
    highlights: [
      "3D perspective drawing with smart guides and grids.",
      "Energy-drink-meets-esports vibe via color psychology.",
      "Vector clarity and print-fidelity mockups."
    ],
    cover: "/images/work/awoke/cover.png",
    images: ["/images/work/awoke/01.png", "/images/work/awoke/02.png"]
  },
  {
    title: "Obsidian Tides Twitter Header",
    slug: "obsidian-tides-twitter",
    blurb:
      "Monogram (O/T with a subtle ‘S’) and glitch-textured backdrop built for legibility in platform constraints.",
    summary:
      "Photoshop + Illustrator build using smart objects and clipping masks, aligned on a grid. A subtle opaque layer behind the mark improves separation without breaking the aesthetic.",
    tags: ["Social", "Branding"],
    tools: ["Photoshop", "Illustrator"],
    highlights: [
      "Balanced hierarchy for name/slogan in symmetric layout.",
      "Monogram integrates O, T, and a subtle S curve.",
      "Dimensions/exports follow Twitter branding specs."
    ],
    cover: "/images/work/obsidian/cover.png",
    images: ["/images/work/obsidian/01.png", "/images/work/obsidian/02.png"]
  },
  {
    title: "Client File-Format Guide",
    slug: "client-file-format-guide",
    blurb:
      "Interactive PDF with custom icon set—clear, brand-aligned guidance on file types for clients.",
    summary:
      "An InDesign/Illustrator guide with anchored vector icons, consistent paragraph styles, and live hyperlinks, designed for both print and web delivery.",
    tags: ["Guide", "Docs"],
    tools: ["InDesign", "Illustrator"],
    highlights: [
      "Clean grid, typographic consistency, and usable contrast.",
      "Interactive links implemented per feedback.",
      "Pixel-snapped icons; a11y-minded contrast and spacing."
    ],
    cover: "/images/work/format-guide/cover.png",
    images: ["/images/work/format-guide/01.png", "/images/work/format-guide/02.png", "/images/work/format-guide/03.png", "/images/work/format-guide/04.png"]
  },
  {
    title: "Upper Crust Branding Suite",
    slug: "upper-crust-branding",
    blurb:
      "French-inspired madeline icon, elegant serif type, and a burgundy-gold-cream palette across stationery.",
    summary:
      "Identity + multi-page collateral built with consistent grid structures, print-safe settings, and a cultural nod through icon form and color symbolism.",
    tags: ["Branding"],
    tools: ["Illustrator", "InDesign"],
    highlights: [
      "Icon rooted in pastry form; modern + heritage balance.",
      "Typographic/spacing corrections after critique.",
      "Print-ready specs for letterhead, envelope, and cards."
    ],
    cover: "/images/work/upper-crust/cover.png",
    images: ["/images/work/upper-crust/01.png", "/images/work/upper-crust/02.png", "/images/work/upper-crust/03.png", "/images/work/upper-crust/04.png", "/images/work/upper-crust/05.png", "/images/work/upper-crust/06.png", "/images/work/upper-crust/07.png", "/images/work/upper-crust/08.png"]
  },
  {
    title: "Sopamanxx YouTube Thumbnail",
    slug: "sopamanxx-thumbnail",
    blurb:
      "High-contrast, diagonal layout with dramatic lighting and black underlay for punchy, mobile-safe type.",
    summary:
      "A reusable Photoshop stack using non-destructive type, adjustment layers, and sharpened rasterization. The diagonal composition adds tension that reads in a crowded feed.",
    tags: ["YouTube", "Promo"],
    tools: ["Photoshop"],
    highlights: [
      "Black opacity layer behind title for legibility (crit-driven).",
      "Mobile legibility checked at small sizes.",
      "Layer structure organized for fast reuse."
    ],
    cover: "/images/work/sopamanxx/cover.png",
    images: ["/images/work/sopamanxx/01.png", "/images/work/sopamanxx/02.png"]
  },
  {
    title: "Depresso Espresso Poster",
    slug: "depresso-espresso-poster",
    blurb:
      "Humor-led vector poster—expressive cups, tuned spacing, and 300 dpi texture for depth.",
    summary:
      "A meme-tone poster that plays with scale/contrast for the title while expressive faces and negative space guide rhythm. Vector shapes textured in Photoshop at print fidelity.",
    tags: ["Poster", "Promo"],
    tools: ["Illustrator", "Photoshop"],
    highlights: [
      "Cup sizes/opacity adjusted for balance (crit-driven).",
      "Faces blend with tone for depth; whitespace optimized.",
      "Print-ready: embedded fonts/outline-safe vectors."
    ],
    cover: "/images/work/depresso/cover.png",
    images: ["/images/work/depresso/01.png"]
  }
];
