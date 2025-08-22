// src/lib/data/workMeta.ts
import type { WorkItem } from "./work";

/**
 * Long-form rubric content surfaced in the Lightbox + case-study pages.
 * Each field is optional; render only if present.
 */
export type CaseStudyDetails = {
  /** Working Knowledge of Software & Digital Tools */
  tools?: string;
  /** Elements & Principles of Design */
  design?: string;
  /** Creative Self-Expression & Originality */
  creativity?: string;
  /** Thoughtful & Appropriate Critique Skills */
  critique?: string;
  /** Evidence of Following Directions */
  directions?: string;
  /** Craftsmanship & Attention to Detail */
  craftsmanship?: string;
};

/** Metadata overrides/augments keyed by slug */
export type WorkMeta = Partial<WorkItem> & { details?: CaseStudyDetails };

/**
 * Metadata for each case study keyed by slug.
 * Use this with a folder-scan approach (images from /public/images/work/[slug])
 * or simply as a central source of truth for titles, tags, summaries, etc.
 */
export const WORK_META: Record<string, WorkMeta> = {
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
    cover: "/images/work/fritz/cover.png",
    details: {
      tools:
        "Photoshop for panel/overlay raster work and non-destructive adjustments; Illustrator for crisp vector marks and scalable avatars. Smart Objects and export presets ensure platform-ready assets.",
      design:
        "Panel grids and strong typographic contrast maintain hierarchy at small sizes; texture adds energy while controlled values preserve legibility across light/dark Twitch themes.",
      creativity:
        "An ‘edgy’ brand tone expressed through digital-noise textures and angled motif lines; iterations explored stroke weight and contrast to retain clarity in tiny UI contexts.",
      critique:
        "After peer critique, increased stroke contrast and simplified micro-text on panels improved readability on stream. Alignment issues were corrected against a modular grid.",
      directions:
        "Followed Twitch image specs for banners, avatars, panels, and overlay regions; exports tested on multiple device pixel ratios and window scales.",
      craftsmanship:
        "Type snap-to-pixel and consistent spacing across panels; color and sharpening tuned for compression. Assets organized and named for client reuse."
    }
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
    cover: "/images/work/cosmic-rvy/cover.png",
    details: {
      tools:
        "Illustrator for primary mark construction, geometric cleanup, and kerning tests; Photoshop for texture finishing and social template production.",
      design:
        "High-saturation neon palette balanced with generous negative space; letter-spacing and stroke weights tuned for avatar sizes; consistent logo area-of-isolation across layouts.",
      creativity:
        "Arcade/cosmic references used tastefully—glow effects and star-field textures provide vibe without obscuring type or symbol forms.",
      critique:
        "Tracking refined on wordmark after review; over-glow reduced to pull back values and preserve midtone detail.",
      directions:
        "Exported in required aspect ratios and sizes for banners/avatars; ensured accessibility contrast on text overlays.",
      craftsmanship:
        "Vector paths cleaned to avoid rendering bumps; texture grain applied at print-safe and screen-safe frequencies."
    }
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
    cover: "/images/work/elite-ak/cover.png",
    details: {
      tools:
        "Photoshop for compositing, light/shadow painting, and type; Illustrator for any vector iconography used in CTA and logo lockups.",
      design:
        "Spotlight emphasis and centered composition create immediate focus; clear information hierarchy separates title, prize, and call-to-action.",
      creativity:
        "Iterated on depth via rim lights and atmosphere; subtle particle overlays add motion without degrading text clarity.",
      critique:
        "CTA size/padding increased per critique; weapon angle adjusted for better silhouette and brand/logo alignment.",
      directions:
        "Social-safe dimensions and margins applied; layers organized for rapid versioning and platform-specific crops.",
      craftsmanship:
        "Sharpening applied on a stamped layer post-scale; halos and clipping refined to avoid banding and edge fringing."
    }
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
    cover: "/images/work/pit-viper/cover.png",
    details: {
      tools:
        "Photoshop compositing with masked renders, directional blur accents, and gradient mapping to unify palette.",
      design:
        "Diagonal axis implies speed; heavy display type sits on darker value field for immediate recognition; depth guided by layered gradients and shadow falloff.",
      creativity:
        "Leans into high-drama esports language—angled bars and particle noise express intensity without sacrificing legibility.",
      critique:
        "Deepened shadows and simplified background texture per critique to improve focus on the weapon and title.",
      directions:
        "Checked safe areas for platform crops; optimized exports for feed compression and varying pixel densities.",
      craftsmanship:
        "Edge halos removed via careful blend modes; noise added to prevent gradient banding."
    }
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
    cover: "/images/work/awoke/cover.png",
    details: {
      tools:
        "Illustrator used for geometric construction and perspective cleanup; Photoshop for context mockups and print simulations.",
      design:
        "Balance of warm/cool palette provides energy; negative space shapes define motion; strict grid usage yields consistent placements across sizes.",
      creativity:
        "Dimensional rendering suggests speed and competitiveness while preserving a simple, reproducible shape language.",
      critique:
        "Micro-adjusted perspective and stroke joins based on feedback; small-shape noise reduced to avoid shimmer at distance.",
      directions:
        "Color palette and clear-space rules documented; exports prepared for print and digital with spot/color variants.",
      craftsmanship:
        "Vector joins cleaned; logo tested against dark/light backgrounds and on textured environments."
    }
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
    cover: "/images/work/obsidian/cover.png",
    details: {
      tools:
        "Photoshop for header template, glitch texture and color tuning; Illustrator for monogram vector and alignment testing. Smart Objects used for quick iteration.",
      design:
        "Symmetric layout provides balance; value plate behind monogram raises contrast; controlled texture adds rhythm without harming readability.",
      creativity:
        "O/T monogram with subtle S curve fuses identity; glitch field nods to gaming/tech while remaining restrained.",
      critique:
        "Introduced a faint opaque plate to improve mark separation; adjusted slogan weight to sit below the name in hierarchy.",
      directions:
        "Sized and exported per Twitter/X header specs; checked mobile/desktop crops for critical content safety.",
      craftsmanship:
        "Alignment verified against grid; edges anti-aliased cleanly; glow/texture kept within value bounds to avoid bleed."
    }
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
    cover: "/images/work/format-guide/cover.png",
    details: {
      tools:
        "Illustrator for icon set; InDesign for paragraph/character styles, anchored objects, TOC, and hyperlinking; exported interactive PDF for web and print-ready variant.",
      design:
        "Consistent typographic scale and spacing establish hierarchy; icon repetition aids pattern recognition; color and contrast tuned for readability.",
      creativity:
        "Icons customized to the brand; tone aimed at non-design clients to demystify file types and appropriate usage.",
      critique:
        "Converted to interactive PDF per critique so examples link directly to resources; improved layout rhythm between sections.",
      directions:
        "Meets deliverable requirements for both print and screen; file packages include fonts/links and outlined/embedded-safe variants.",
      craftsmanship:
        "Icons pixel-snapped; margins and gutters normalized; contrast checked for accessibility; link targets validated."
    }
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
    cover: "/images/work/upper-crust/cover.png",
    details: {
      tools:
        "Illustrator for the mark and variants; InDesign for multi-page layout templates, paragraph styles, and print packaging.",
      design:
        "Madeline-inspired icon paired with refined serif; burgundy/gold/cream CMYK palette signals premium, heritage cues; grid-led spacing ensures unity across pieces.",
      creativity:
        "Cultural nod expressed through icon form and palette while maintaining modern restraint suitable for a premium bakery brand.",
      critique:
        "Adjusted pillar alignment and type spacing per feedback to tighten rhythm and improve optical balance.",
      directions:
        "Delivered print-ready with bleeds, slug, and color profiles; provided stationery sizes and safe-area rules.",
      craftsmanship:
        "Vector edges cleaned; proofed CMYK values; consistent logo placement and typographic hierarchy across collateral."
    }
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
    cover: "/images/work/sopamanxx/cover.png",
    details: {
      tools:
        "Photoshop groups and Smart Objects for re-skinning titles/renders; adjustment layers for unified palette; sharpening tailored for 72-dpi outputs.",
      design:
        "Diagonal flow increases energy; heavy title weight and black plate preserve legibility on small/mobile; foreground/background separation guided by value structure.",
      creativity:
        "Bold lighting and glitch accents reflect creator personality while remaining readable at feed scale.",
      critique:
        "Added black underlay and increased letterspacing based on feedback; tested at reduced sizes to confirm readability.",
      directions:
        "Built at 1280×720 with safe margins; exports verified against YouTube compression and theme backgrounds.",
      craftsmanship:
        "Layer naming and color coding aid reuse; final sharpen applied post-scale to avoid halos."
    }
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
    cover: "/images/work/depresso/cover.png",
    details: {
      tools:
        "Illustrator vectors for cups and typography; Photoshop texture overlays and print export at 300 dpi with proper bleed/margins.",
      design:
        "Title scale and contrast drive hierarchy; expressive faces and controlled whitespace set rhythm; repeating forms provide unity and variety.",
      creativity:
        "Humorous concept realized with character-driven cup designs; texture adds warmth without muddying type.",
      critique:
        "Adjusted cup scale and face opacity after critique to balance weight and improve focus on the title.",
      directions:
        "Prepared social and print variants with appropriate color management and file handling (embedded/outlined fonts as needed).",
      craftsmanship:
        "Edges stay crisp at print size; spacing adheres to grid; texture frequency tuned to avoid moiré and banding."
    }
  }
};
