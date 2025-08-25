// src/lib/data/workMeta.ts
import type { WorkItem } from "./work";
import {
  hexToRgb,
  rgbToHslString,
  rgbToString,
  rgbaString,
  descriptiveNameFromHex,
  parseGoogleFontsHref,
} from "$lib/utils/color";

/** Long-form rubric content shown in Lightbox + case-study pages */
export type CaseStudyDetails = {
  tools?: string; // Working Knowledge of Software & Digital Tools
  design?: string; // Elements & Principles of Design
  creativity?: string; // Creative Self-Expression & Originality
  critique?: string; // Thoughtful & Appropriate Critique Skills
  directions?: string; // Evidence of Following Directions
  craftsmanship?: string; // Craftsmanship & Attention to Detail
};

/** Typography metadata used on case-study pages */
export type TypographyMeta = {
  /** e.g., "Inter", "SF Pro", "Bookmania" (optional when `url` is provided) */
  family?: string;
  /** e.g., ["400","600","700"] or ["Regular","Semibold","Bold"] */
  weights?: string[];
  /** e.g., ["Google Fonts", "Adobe Fonts", "Local @font-face"] */
  sources?: string[];
  /** Additional notes on pairing, tracking, usage, etc. */
  notes?: string;
  /**
   * Optional CSS URL for auto-detection (e.g. Google Fonts):
   * "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap"
   */
  url?: string;
};

export type PaletteColor = {
  /** Friendly name like "Obsidian", "Accent", "Cream" (auto-generated if omitted) */
  name?: string;
  /** Primary color in HEX form (required) */
  hex: string;
  /** Optional RGB string, e.g. "226,160,40" */
  rgb?: string;
  /** Optional HSL string, e.g. "40,76%,52%" */
  hsl?: string;
  /** Optional RGBA string some components may read; safe to include */
  rgba?: string;
};

export type ProcessStep = {
  /** Milestone label, e.g. "Brief & Goals", "Monogram Study", "Handoff" */
  label: string;
  /** Optional note describing the milestone */
  note?: string;
  /** Optional bullets describing sub-points for the step */
  bullets?: string[];
};

/**
 * Extra per-slug metadata
 * - coverPosition: controls overlay image fit behavior for banner-like images
 * - year/date: shown in the overlay header pills if present
 * - typography/palette/process: optional design system + timeline metadata
 * - timeline: alias provided for older page code still reading `meta.timeline`
 */
type ExtraOverlayMeta = {
  coverPosition?: "top" | "contain" | "cover";
  year?: number;
  date?: string;
  typography?: TypographyMeta;
  palette?: PaletteColor[];
  process?: ProcessStep[];
  /** Back-compat alias (same shape as `process`) */
  timeline?: ProcessStep[];
};

/** Metadata overrides/augments keyed by slug */
export type WorkMeta = Partial<WorkItem> & {
  details?: CaseStudyDetails;
} & ExtraOverlayMeta;

/* -----------------------------------------------------------------------------
   WORK META (your entries preserved)
----------------------------------------------------------------------------- */

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
      "Consistent hierarchy, alignment, and balance across assets.",
    ],
    cover: "/images/work/fritz/cover.png",
    coverPosition: "contain",
    year: 2024,
    typography: {
      family: "Inter",
      weights: ["500", "600", "800"],
      sources: ["Google Fonts"],
      notes:
        "Inter provides high x-height and excellent small-size rendering for panel labels and overlay HUD text. Display moments use heavier weights with slight positive tracking to survive Twitch compression and variable stream scales.",
      // url: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap",
    },
    palette: [
      {
        name: "UI Obsidian",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Muted Charcoal",
        hex: "#1E1E1E",
        rgb: "30,30,30",
        hsl: "0,0%,12%",
        rgba: "30,30,30,1",
      },
      {
        name: "Brand Accent",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
      {
        name: "Panel Ink",
        hex: "#FFFFFF",
        rgb: "255,255,255",
        hsl: "0,0%,100%",
        rgba: "255,255,255,1",
      },
    ],
    process: [
      {
        label: "Brief & Constraints",
        note: "Clarified Twitch safe areas and panel behavior across desktop/mobile.",
      },
      {
        label: "Grid & Type Studies",
        note: "Explored modular panel grids and micro-type treatments for legibility.",
      },
      {
        label: "Texture & Tone",
        note: "Added controlled digital-noise layers that survive compression without muddying.",
      },
      {
        label: "Overlay Pass & QA",
        note: "Live test on stream; tweaked contrast and stroke weights per feedback.",
      },
      {
        label: "Export & Handoff",
        note: "Delivered organized asset pack with naming, sizes, and update notes.",
      },
    ],
    details: {
      tools:
        "The system relies on Photoshop for non-destructive raster layering (panels, overlays) and Illustrator for vector avatar marks. Smart Objects hold core marks and panel headers, which enables rapid theme variants without re-rasterizing. Export presets target Twitch panels/banners at multiple scales to minimize blur.",
      design:
        "A strict panel grid aligns labels, iconography, and spacing so each unit reads at a glance. Strong type contrast (weight + size + value) separates headers from descriptive text. Textures are intentionally subtle and live below type value so micro-contrast is preserved even after platform compression.",
      creativity:
        "The edgy tone is expressed through angled accent slashes and a restrained noise field that adds grit without distracting from informational content. Several iterations compared stroke weight around the avatar to balance presence against dense panel content.",
      critique:
        "Peer feedback revealed panel label shimmer at 100% scaling on some displays. We increased stroke contrast, nudged letterspacing, and normalized layer stacking order to reduce aliasing. A second QA pass focused on color values in dark mode to avoid low-contrast traps.",
      directions:
        "All assets adhere to Twitch banner/panel templates and allow safe cropping on variable aspect ratios. Deliverables include a README describing recommended OBS setups and replacement flows so the client can update panels independently.",
      craftsmanship:
        "Text layers snap to pixel to prevent blur; panel padding and icon spacing are consistent across the kit. Sharpening is applied at output size, and a final noise micro-layer prevents smooth gradient banding on stream.",
    },
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
      "Royalty-free textures and custom brushes for consistency.",
    ],
    cover: "/images/work/cosmic-rvy/cover.png",
    coverPosition: "contain",
    year: 2024,
    typography: {
      family: "Orbitron",
      weights: ["500", "700"],
      sources: ["Google Fonts"],
      notes:
        "A geometric, sci-fi face complements the arcade motif. Wordmark tracking was iterated for avatar sizes; heavier weights are reserved for hero lockups while captions and secondary labels use the 500 weight to avoid glow spill.",
    },
    palette: [
      {
        name: "Neon Pink",
        hex: "#FF4D8D",
        rgb: "255,77,141",
        hsl: "337,100%,65%",
        rgba: "255,77,141,1",
      },
      {
        name: "Cosmic Blue",
        hex: "#3DA9FC",
        rgb: "61,169,252",
        hsl: "205,97%,61%",
        rgba: "61,169,252,1",
      },
      {
        name: "Starfield Black",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Nebula Glow",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
    ],
    process: [
      {
        label: "Moodboard & References",
        note: "Synthesized 80s arcade + cosmic motifs; scoped color energy and UX readability.",
      },
      {
        label: "Logo Vectorization",
        note: "Refined path joins and letterforms for crisp scaling.",
      },
      {
        label: "Template Suite",
        note: "Established banner/post/story variants with consistent margins.",
      },
      {
        label: "Texture & Glow Pass",
        note: "Added glow halos with controlled values to reduce caption washout.",
      },
      {
        label: "Handoff",
        note: "Packaged vectors, textures, and editable PSDs with usage notes.",
      },
    ],
    details: {
      tools:
        "Illustrator handled mark construction and kerning tests; master outlines enable robust scaling without hinting artifacts. Photoshop contributed grain overlays, star fields, and glow treatment using layer styles and masked gradients for value control.",
      design:
        "Neon intensity is tempered by generous negative space to keep focus on letterforms. A constrained glow radius and dark field underpin legibility, and a system of margins ensures consistent safe areas across templates.",
      creativity:
        "The visual language channels arcade nostalgia without leaning on cliché: subtle star streaks and restrained chroma help the identity feel lively but contemporary. Iterations dialed in glow color to avoid pink/blue clipping.",
      critique:
        "Early tests revealed overglow washing out caption text; lowering halo opacity and tightening letter-spacing resolved the issue. The avatar mark gained a slightly thicker outline to survive tiny render sizes.",
      directions:
        "Platform dimensions were baked into the templates. Each output includes notes on export scales and a preflight checklist to prevent compression artifacts on upload.",
      craftsmanship:
        "Vector seams were cleaned to prevent hairline antialiasing. Texture grain uses a frequency that resists moiré on downscaling, with final outputs sharpened for the destination pixel density.",
    },
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
      "Clean rasterization and consistent spacing for readability.",
    ],
    cover: "/images/work/elite-ak/cover.png",
    coverPosition: "contain",
    year: 2024,
    typography: {
      family: "Anton",
      weights: ["400"],
      sources: ["Google Fonts"],
      notes:
        "Anton’s condensed forms concentrate visual weight, allowing large, high-impact titles without overwhelming the render. Micro-tracking adjustments preserve counters and reduce haloing on glow edges.",
    },
    palette: [
      {
        name: "Depth Black",
        hex: "#121212",
        rgb: "18,18,18",
        hsl: "0,0%,7%",
        rgba: "18,18,18,1",
      },
      {
        name: "Steel Gray",
        hex: "#2A2A2A",
        rgb: "42,42,42",
        hsl: "0,0%,16%",
        rgba: "42,42,42,1",
      },
      {
        name: "Highlight Amber",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
      {
        name: "Status White",
        hex: "#FFFFFF",
        rgb: "255,255,255",
        hsl: "0,0%,100%",
        rgba: "255,255,255,1",
      },
    ],
    process: [
      {
        label: "Brief & Asset Prep",
        note: "Collected renders; normalized lighting and perspective.",
      },
      {
        label: "Composition Studies",
        note: "Balanced weapon silhouette vs. text block weight.",
      },
      {
        label: "Lighting & Atmosphere",
        note: "Spotlight and rim-light passes to create focus.",
      },
      {
        label: "Hierarchy Refinement",
        note: "Re-ordered title/CTA; tuned paddings for instant scan.",
      },
      { label: "Output QA", note: "Checked social crops; sharpened per-size." },
    ],
    details: {
      tools:
        "Photoshop masks and blend-if settings drive believable compositing. Adjustment layers harmonize the render palette, and Illustrator supplies clean vector icons for CTAs and sponsor marks.",
      design:
        "A central spotlight carves a focal cone, keeping the viewer’s gaze on the weapon and title. Hierarchy is crystalized by scale, boldness, and a darker supporting field behind key text.",
      creativity:
        "To differentiate from typical giveaway tropes, subtle atmospheric dust and controlled bloom add drama without clutter. The render angle was tuned so the silhouette remains unmistakable at a glance.",
      critique:
        "Feedback indicated the CTA blended too closely with the weapon highlights. We increased padding, introduced a slightly darker plate, and shifted the hue to separate layers in value.",
      directions:
        "All exports follow platform aspect ratios and allow margin for captions/metadata overlays. File layers remain labeled and grouped for future re-skins.",
      craftsmanship:
        "Edges are hand-refined to avoid fringing. A gentle, output-size sharpening pass prevents halos, and gradient banding is mitigated via low-amplitude noise.",
    },
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
      "300 DPI export normalized for on-screen clarity.",
    ],
    cover: "/images/work/pit-viper/cover.png",
    coverPosition: "cover",
    year: 2024,
    typography: {
      family: "Oswald",
      weights: ["600", "700"],
      sources: ["Google Fonts"],
      notes:
        "A condensed grotesk with squared counters that holds up under angle and motion lines. Upper weights maintain integrity when composited over gradient fields and particle layers.",
    },
    palette: [
      {
        name: "Night Field",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Viper Green",
        hex: "#98FF98",
        rgb: "152,255,152",
        hsl: "120,100%,80%",
        rgba: "152,255,152,1",
      },
      {
        name: "Warning Amber",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
      {
        name: "Highlight White",
        hex: "#FFFFFF",
        rgb: "255,255,255",
        hsl: "0,0%,100%",
        rgba: "255,255,255,1",
      },
    ],
    process: [
      {
        label: "Axis & Angle",
        note: "Established a 12–15° diagonal for motion language.",
      },
      {
        label: "Compositing",
        note: "Blended masked weapon over gradient-mapped background.",
      },
      {
        label: "Type & Plate",
        note: "Added darker plate behind title to prevent washout.",
      },
      {
        label: "Texture Controls",
        note: "Reduced grain where it interfered with counters.",
      },
      {
        label: "Export & Checks",
        note: "Verified crop safety; applied tailored sharpening.",
      },
    ],
    details: {
      tools:
        "Photoshop drives the entire workflow: channel masks for clean extractions, gradient maps to unify renders, and motion/particle layers to imply speed without noise buildup.",
      design:
        "The diagonal composition creates forward momentum, with weighty display type pinning the layout. Value stacks are managed so the title reads first, then the weapon, then secondary info.",
      creativity:
        "Particle streams and thin angle bars are used sparingly to prevent visual fatigue. The color story leans into neon green as a high-energy accent balanced by a grounded black field.",
      critique:
        "Reviewers flagged an early version where grain clashed with counters; we reduced amplitude and pulled back the midtone. Type spacing was opened slightly to keep clarity at small feed sizes.",
      directions:
        "Templates were validated against platform guidelines; a notes file explains how to update renders and maintain motion axis alignment.",
      craftsmanship:
        "Edges are feather-tuned to avoid halos. Gradients include low-amplitude noise to suppress banding, and export sharpening differs for 1x vs. 2x to avoid over-crisping.",
    },
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
      "Vector clarity and print-fidelity mockups.",
    ],
    cover: "/images/work/awoke/cover.png",
    coverPosition: "contain",
    year: 2023,
    typography: {
      family: "Eurostile",
      weights: ["700"],
      sources: ["Local @font-face"],
      notes:
        "A square-grotesk with techno overtones that complements the perspective mark. Kerning and optical alignments were refined at large sizes to keep the logotype from visually tilting.",
    },
    palette: [
      {
        name: "Esports Red",
        hex: "#FF2D2D",
        rgb: "255,45,45",
        hsl: "0,100%,59%",
        rgba: "255,45,45,1",
      },
      {
        name: "Cool Blue",
        hex: "#2D8CFF",
        rgb: "45,140,255",
        hsl: "212,100%,59%",
        rgba: "45,140,255,1",
      },
      {
        name: "Depth Black",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Highlight White",
        hex: "#FFFFFF",
        rgb: "255,255,255",
        hsl: "0,0%,100%",
        rgba: "255,255,255,1",
      },
    ],
    process: [
      {
        label: "Brand Positioning",
        note: "Defined modern-meets-heritage positioning and target audience.",
      },
      {
        label: "Perspective Sketches",
        note: "Explored foreshortening without readability loss.",
      },
      {
        label: "Vector Cleanup",
        note: "Corrected joins; normalized inner angles to prevent dark spots.",
      },
      {
        label: "Color & Mockups",
        note: "Dialed red/blue balance; tested on apparel, web, and signage.",
      },
      {
        label: "Specs & Handoff",
        note: "Clear space, minimum size, and color variants documented.",
      },
    ],
    details: {
      tools:
        "Illustrator supported precise grid construction and perspective alignment; Photoshop aided in realistic mockups for social, apparel, and signage contexts.",
      design:
        "Negative space carves directional motion within the mark; opposing red/blue balance injects energy without creating chromatic vibration. Grid adherence ensures the shape reproduces cleanly across sizes.",
      creativity:
        "Rather than relying on aggressive spikes, dimensionality and implied speed communicate the esports vibe. The geometry opts for repeatable forms that scale down gracefully.",
      critique:
        "Perspective edges originally created dark congestion at certain angles—adjustments to inner joins and line terminals resolved the issue. Color balance shifted to prevent the blue from overpowering red at small sizes.",
      directions:
        "Brand specs include clear-space rules, minimum sizes, and color/usage variants. Assets are delivered in vector and raster, with spot-color versions for print.",
      craftsmanship:
        "Anchor points are minimized and distributed to avoid bumps on tight curves. The logo is tested over textured and flat backgrounds to ensure consistent edge quality.",
    },
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
      "Dimensions/exports follow Twitter branding specs.",
    ],
    cover: "/images/work/obsidian/cover.png",
    coverPosition: "top",
    year: 2023,
    typography: {
      family: "Inter",
      weights: ["600", "800"],
      sources: ["Google Fonts"],
      notes:
        "Inter’s clean geometry remains crisp in header crops. The slogan uses a lighter weight than the name to preserve hierarchy, and subtle tracking prevents dark massing around the monogram.",
    },
    // Hex-only entries intentionally left to demonstrate auto-enrichment:
    palette: [
      { hex: "#150f24" },
      { hex: "#401e70" },
      { hex: "#48bec0" },
      { hex: "#3a7fbe" },
      { hex: "#FFFFFF" },
    ],
    process: [
      {
        label: "Brief & Crop Safety",
        note: "Mapped desktop vs. mobile header crops to reserve safe zones.",
      },
      {
        label: "Monogram Exploration",
        note: "Integrated O/T with a subtle S curve inside the negative space.",
      },
      {
        label: "Texture Pass",
        note: "Glitch field tuned to avoid distracting banding behind type.",
      },
      {
        label: "Contrast Plate",
        note: "Introduced faint plate to separate mark from background.",
      },
      {
        label: "Export & Verification",
        note: "Checked rendering at multiple viewport widths and themes.",
      },
    ],
    details: {
      tools:
        "Photoshop’s template guided the safe zones while Illustrator handled the crisp monogram. Smart Objects enable quick color tweaks and export at various aspect scenarios.",
      design:
        "A symmetric layout yields perceived stability. The value plate behind the monogram boosts contrast, and the glitch texture is constrained in amplitude so text remains legible.",
      creativity:
        "The monogram solves a three-letter puzzle without looking contrived, and the background motion suggests a digital personality without devolving into noise.",
      critique:
        "Feedback indicated the slogan competed with the name; the hierarchy was corrected by reducing its weight and adding more spacing. The plate opacity was also tuned down to avoid looking like a solid box.",
      directions:
        "Exports follow Twitter/X specs with attention to center-safe content. Notes recommend double-checking device previews, as the platform’s crop can shift.",
      craftsmanship:
        "Edges stay smooth across background variance; all glow and grain pass thresholds that resist dithering and color banding after upload compression.",
    },
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
      "Pixel-snapped icons; a11y-minded contrast and spacing.",
    ],
    cover: "/images/work/format-guide/cover.png",
    coverPosition: "contain",
    year: 2023,
    typography: {
      family: "Source Sans 3",
      weights: ["400", "600"],
      sources: ["Google Fonts"],
      notes:
        "A humanist sans chosen for clear paragraph differentiation and approachable tone. Paragraph/character styles enforce hierarchy while keeping callouts discoverable in long-form reading.",
    },
    palette: [
      {
        name: "Paper",
        hex: "#F7EFE5",
        rgb: "247,239,229",
        hsl: "33,56%,93%",
        rgba: "247,239,229,1",
      },
      {
        name: "Ink",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Link Blue",
        hex: "#3DA9FC",
        rgb: "61,169,252",
        hsl: "205,97%,61%",
        rgba: "61,169,252,1",
      },
      {
        name: "Accent Amber",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
    ],
    process: [
      {
        label: "Outline & Grid",
        note: "Established 12-col grid and typographic rhythm.",
      },
      {
        label: "Icon Set Design",
        note: "Vector icons aligned to pixel grid for clarity at small sizes.",
      },
      {
        label: "Interactive Layers",
        note: "Added hyperlinks, anchors, and bookmarks for navigation.",
      },
      {
        label: "A11y Pass",
        note: "Contrast checks and logical reading order validated.",
      },
      {
        label: "Export Packages",
        note: "Produced interactive PDF and print-safe variants with embedded assets.",
      },
    ],
    details: {
      tools:
        "Illustrator produced the iconography with consistent stroke/shape logic. InDesign anchored the icons, drove styles, and exported both interactive and print variants with proper preflight.",
      design:
        "The grid and consistent paragraph scale keep dense information skimmable. Link color and icon repetition establish recognizable patterns without overwhelming the reader.",
      creativity:
        "Icons were tailored to the brand voice rather than stock symbols, striking a balance between clarity and character. Micro-illustrations support the message without feeling ornamental.",
      critique:
        "Feedback requested quicker scannability; we added jump links and a sticky contents section. Icon stroke weight was tweaked for balance against headings.",
      directions:
        "The guide respects both screen and print contexts. File packages include fonts/links and an instructions page for client-side updates.",
      craftsmanship:
        "Icons snap to the pixel grid; tables and callouts align to baseline. Exported PDFs retain crisp vector rendering and pass link validation.",
    },
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
      "Print-ready specs for letterhead, envelope, and cards.",
    ],
    cover: "/images/work/upper-crust/cover.png",
    coverPosition: "contain",
    year: 2023,
    typography: {
      family: "Cormorant Garamond",
      weights: ["500", "700"],
      sources: ["Google Fonts"],
      notes:
        "A refined serif with classical proportions reinforces the premium, heritage tone. Tight wordmarks are balanced with generous line spacing in body copy to maintain readability.",
    },
    palette: [
      {
        name: "Burgundy",
        hex: "#7B1E24",
        rgb: "123,30,36",
        hsl: "356,61%,30%",
        rgba: "123,30,36,1",
      },
      {
        name: "Gold",
        hex: "#C59A3C",
        rgb: "197,154,60",
        hsl: "42,55%,50%",
        rgba: "197,154,60,1",
      },
      {
        name: "Cream",
        hex: "#F7EFE5",
        rgb: "247,239,229",
        hsl: "33,56%,93%",
        rgba: "247,239,229,1",
      },
      {
        name: "Ink",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
    ],
    process: [
      {
        label: "Brand Positioning",
        note: "Defined modern-meets-heritage positioning and target audience.",
      },
      {
        label: "Icon Sketches",
        note: "Iterated madeline forms; tested for silhouette clarity.",
      },
      {
        label: "Vector Mark",
        note: "Refined curves, avoided tangents, established clear space.",
      },
      {
        label: "Collateral System",
        note: "Letterhead, envelope, and cards on a shared grid.",
      },
      {
        label: "Print Package",
        note: "CMYK profiles, bleeds, and paper recommendations included.",
      },
    ],
    details: {
      tools:
        "Illustrator handled mark construction and variants; InDesign set up reusable layout templates and print packaging with proper preflight.",
      design:
        "The mark and palette lean premium without cliché. A restrained typographic system establishes hierarchy, while whitespace and alignment provide calm, confident rhythm across collateral.",
      creativity:
        "The pastry-inspired symbol bridges cultural reference and modern geometry. Pairing it with a contemporary grid keeps the identity from veering into nostalgia.",
      critique:
        "Spacing adjustments around the icon reduced visual tension in the wordmark. Color relationships were tuned to avoid muddiness on uncoated stock.",
      directions:
        "Clear usage specs and file variants were delivered for emboss, foil, and standard print. Documentation notes how to maintain contrast on different substrates.",
      craftsmanship:
        "Curves are tangent-clean, with consistent stroke logic. Mockups match real print scale, ensuring logo legibility and ink density are predictable.",
    },
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
      "Layer structure organized for fast reuse.",
    ],
    cover: "/images/work/sopamanxx/cover.png",
    coverPosition: "cover",
    year: 2024,
    typography: {
      family: "Bebas Neue",
      weights: ["400"],
      sources: ["Google Fonts"],
      notes:
        "A condensed display face with generous caps that remains legible at tiny sizes. Slightly increased tracking and a black plate ensure counters hold up against busy renders.",
    },
    palette: [
      {
        name: "Plate Black",
        hex: "#000000",
        rgb: "0,0,0",
        hsl: "0,0%,0%",
        rgba: "0,0,0,1",
      },
      {
        name: "Highlight White",
        hex: "#FFFFFF",
        rgb: "255,255,255",
        hsl: "0,0%,100%",
        rgba: "255,255,255,1",
      },
      {
        name: "Accent Amber",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
      {
        name: "Feed Gray",
        hex: "#222222",
        rgb: "34,34,34",
        hsl: "0,0%,13%",
        rgba: "34,34,34,1",
      },
    ],
    process: [
      {
        label: "Brief & Hook",
        note: "Clarified content hook and title length for mobile.",
      },
      {
        label: "Layout Axis",
        note: "Established diagonal flow for energy and hierarchy.",
      },
      {
        label: "Lighting Pass",
        note: "Painted rim lights and glow accents to separate subject from background.",
      },
      {
        label: "Title Plate",
        note: "Introduced black plate and tuned spacing for small-screen legibility.",
      },
      {
        label: "Export & QA",
        note: "Checked 25–35% scaled mocks to simulate phone feed.",
      },
    ],
    details: {
      tools:
        "Photoshop groups are structured for quick re-skinning of titles and renders. Adjustment layers provide color consistency; a sharpen-on-output action avoids double sharpening during scaling.",
      design:
        "Hierarchy leads with the title block, supported by a black plate to guarantee contrast. Diagonal alignment and selective glow direct the eye without busying the frame.",
      creativity:
        "The treatment borrows from cinematic key art but remains practical for weekly content churn. Dramatic lighting adds personality while staying readable at thumbnail size.",
      critique:
        "Initial type thickness caused dark clumping; tracking was opened and weight reduced slightly. Saturation on the rim light was pulled back to prevent clipping.",
      directions:
        "Template notes specify minimum title size and safe margins. Export settings are included to align with YouTube’s compression behavior.",
      craftsmanship:
        "Layer naming and color coding make future iterations fast. The sharpen-last workflow prevents halos, and subtle noise keeps gradients smooth.",
    },
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
      "Print-ready: embedded fonts/outline-safe vectors.",
    ],
    cover: "/images/work/depresso/cover.png",
    coverPosition: "contain",
    year: 2023,
    typography: {
      family: "Cooper Black",
      weights: ["700"],
      sources: ["Local @font-face"],
      notes:
        "A friendly, heavy serif suits the comedic tone and anchors the composition. Title scale is disciplined to avoid crowding expressive graphics; subcopy uses lighter tracking to prevent blockiness.",
    },
    palette: [
      {
        name: "Coffee",
        hex: "#3B2F2F",
        rgb: "59,47,47",
        hsl: "0,12%,21%",
        rgba: "59,47,47,1",
      },
      {
        name: "Cream",
        hex: "#F1E3C6",
        rgb: "241,227,198",
        hsl: "38,58%,86%",
        rgba: "241,227,198,1",
      },
      {
        name: "Ink",
        hex: "#0B0B0B",
        rgb: "11,11,11",
        hsl: "0,0%,4%",
        rgba: "11,11,11,1",
      },
      {
        name: "Warm Accent",
        hex: "#E2A028",
        rgb: "226,160,40",
        hsl: "40,76%,52%",
        rgba: "226,160,40,1",
      },
    ],
    process: [
      {
        label: "Concept & Wordplay",
        note: "Sketched visual puns; chose expressive character angle.",
      },
      {
        label: "Vector Pass",
        note: "Constructed cups and faces with consistent stroke logic.",
      },
      {
        label: "Type & Rhythm",
        note: "Balanced title scale with whitespace to create pacing.",
      },
      {
        label: "Texture & Print Prep",
        note: "Applied subtle 300-dpi texture and set bleed/margins.",
      },
      {
        label: "Proof & Final",
        note: "Color-checked on coated/uncoated; exported press-ready.",
      },
    ],
    details: {
      tools:
        "Illustrator handled clean, reusable vectors; Photoshop added paper-like grain at print resolution. Files are organized for color editing with embedded/outlined options for service bureaus.",
      design:
        "Contrast in scale and value drives the gag while whitespace frames the action. Repetition of cups establishes pattern harmony, with subtle texture preventing a flat, clip-art feel.",
      creativity:
        "The humor reads even without copy thanks to expressive vector faces. The palette references café warmth without drifting into sepia kitsch.",
      critique:
        "Test prints revealed a crowding issue near the title; spacing and face opacities were tuned for clearer emphasis. Minor curve smoothing removed distracting kinks.",
      directions:
        "Deliverables include social crops and a print-ready PDF/X-1a. Documentation notes how to convert the file for screen-only usage with lighter grain.",
      craftsmanship:
        "All curves are tangent-clean and corner alignment is precise. Texture frequency avoids moiré; typography retains clarity at print sizes.",
    },
  },
};

/* -----------------------------------------------------------------------------
   Enrichment (static, Hostinger-safe)
   - Palette: from HEX → rgb/rgba/hsl + generated human-ish name (if missing)
   - Typography: if `url` provided and family/weights missing → parse from URL
   - Back-compat: mirror `process` → `timeline` if `timeline` absent
----------------------------------------------------------------------------- */

function enrichPalette(p?: PaletteColor[]): PaletteColor[] | undefined {
  if (!p) return p;
  return p.map((entry) => {
    const hex = entry.hex;
    const rgbArr = hexToRgb(hex) ?? [0, 0, 0];
    const rgb = entry.rgb ?? rgbToString(rgbArr);
    const rgba = entry.rgba ?? rgbaString(rgbArr, 1);
    const hsl = entry.hsl ?? rgbToHslString(rgbArr);
    const name = entry.name ?? descriptiveNameFromHex(hex);
    return { ...entry, name, rgb, rgba, hsl };
  });
}

function enrichTypography(t?: TypographyMeta): TypographyMeta | undefined {
  if (!t) return t;
  const out: TypographyMeta = { ...t };
  if (t.url && (!t.family || !t.weights?.length)) {
    const parsed = parseGoogleFontsHref(t.url);
    if (parsed) {
      out.family = out.family ?? parsed.family;
      out.weights = out.weights?.length ? out.weights : parsed.weights;
      out.sources = out.sources?.length ? out.sources : ["Google Fonts"];
    }
  }
  return out;
}

for (const slug of Object.keys(WORK_META)) {
  const m = WORK_META[slug];
  if (m.palette) m.palette = enrichPalette(m.palette);
  if (m.typography) m.typography = enrichTypography(m.typography);
  if (!m.timeline && m.process) m.timeline = m.process; // alias for older readers
}
