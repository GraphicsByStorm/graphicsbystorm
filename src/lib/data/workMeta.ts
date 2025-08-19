// src/lib/data/workMeta.ts
import type { WorkItem } from "./work";

/**
 * Metadata for each case study keyed by slug.
 * Use this with a folder-scan approach (images from /public/images/work/[slug])
 * or simply as a central source of truth for titles, tags, summaries, etc.
 */
export const WORK_META: Record<string, Partial<WorkItem>> = {
  "fritz-streaming-social": {
    title: "Fritz Streaming & Social Package",
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
    cover: "/images/work/fritz/cover.png"
  },

  "cosmic-rvy": {
    title: "Cosmic RVY Social Package",
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
    cover: "/images/work/cosmic-rvy/cover.png"
  },

  "elite-build-ak47-promo": {
    title: "Elite Build AK-47 Giveaway Promo",
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
    cover: "/images/work/elite-ak/cover.png"
  },

  "pit-viper-awp-promo": {
    title: "Pit Viper AWP Giveaway Promo",
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
    cover: "/images/work/pit-viper/cover.png"
  },

  "awoke-gg-branding": {
    title: "AWOKE.GG Branding",
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
    cover: "/images/work/awoke/cover.png"
  },

  "obsidian-tides-twitter": {
    title: "Obsidian Tides Twitter Header",
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
    cover: "/images/work/obsidian/cover.png"
  },

  "client-file-format-guide": {
    title: "Client File-Format Guide",
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
    cover: "/images/work/format-guide/cover.png"
  },

  "upper-crust-branding": {
    title: "Upper Crust Branding Suite",
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
    cover: "/images/work/upper-crust/cover.png"
  },

  "sopamanxx-thumbnail": {
    title: "Sopamanxx YouTube Thumbnail",
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
    cover: "/images/work/sopamanxx/cover.png"
  },

  "depresso-espresso-poster": {
    title: "Depresso Espresso Poster",
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
    cover: "/images/work/depresso/cover.png"
  }
};
