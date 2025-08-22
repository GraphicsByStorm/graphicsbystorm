# GraphicsByStorm — Portfolio (Astro + Svelte 5 + Tailwind)

A fast, static portfolio built with **Astro**, **Svelte 5 (runes)**, and **Tailwind CSS**.  
It features a unified **Work** grid, image **Lightbox** with scroll-lock, dynamic **case studies** with rubric sections, and creative **social links** using Iconify.

Repo: https://github.com/GraphicsByStorm/graphicsbystorm

---

## ✨ Highlights

- **Static by default** (`prerender = true`) for speed & SEO.
- **Svelte 5 (runes)** islands only where needed (e.g., `WorkSection.svelte`, `Lightbox.svelte`).
- **Consistent Lightbox**: wheel/touch to navigate, page scroll locked, returns focus & scroll to prior position on close.
- **Case Studies**: Overview, Highlights, rubric sections (tools/design/creativity/critique/directions/craftsmanship), sticky TOC & info sidebar, prev/next navigation.
- **Creative social links**: desktop rail + mobile bar with Iconify icons.
- **Zero-SSR pattern**: prefer `.astro` & `.ts`, hydrate Svelte sparingly with `client:visible`.

---

## 🧱 Tech Stack

- **Astro** (content routing & prerender)
- **Svelte 5 (runes)** for interactive islands
- **Tailwind CSS** for styling
- **Iconify** (`@iconify/svelte` + JSON icon packs)
- **TypeScript** everywhere

---

## 📦 Getting Started

> Requires **Node 18+** (Node 20+ recommended) and a package manager (npm/pnpm/bun).

    # clone
    git clone https://github.com/GraphicsByStorm/graphicsbystorm
    cd graphicsbystorm

    # install
    npm install
    # pnpm install
    # bun install

    # dev
    npm run dev

    # type-check (optional)
    npm run check

    # build static site
    npm run build

    # preview production build
    npm run preview

_If your `package.json` uses different script names, use those instead._

---

## 🗂 Project Structure (key parts)

    src/
      components/
        Lightbox.svelte            # modal viewer with scroll-lock + wheel/touch nav
        WorkSection.svelte         # grid of work cards + Lightbox trigger
      layouts/
        BaseLayout.astro           # imports Tailwind + theme; used by all pages
      lib/
        data/
          work.ts                  # Work catalog (cards + gallery paths)
          workMeta.ts              # Extended case-study metadata (rubric details)
          work.server.ts           # (optional) filesystem scanner for /public/images/work
      pages/
        work.astro                 # Work grid (Svelte island)
        case-study/[slug].astro    # Case-study page + getStaticPaths()
    public/
      images/
        work/
          <slug>/
            cover.png              # used as hero and card cover
            01.png …               # gallery images (any valid extensions)

> Path aliases like `$lib` and `$styles` are configured in `tsconfig.json` / `astro.config.mjs`.

---

## 🎨 Styling

- All routes should render inside **`BaseLayout.astro`**, which imports global CSS (`tailwind.css`, `theme.css`).
- If a page looks unstyled, it’s usually not using the base layout or the style import path is wrong.

---

## 🧩 Svelte 5 (runes) conventions

- Use runes APIs: `$state`, `$derived`, `$effect`, `$bindable`.
- Events use `onclick` (not `on:click`) in runes mode.

    <button onclick={() => (open = true)} />

---

## 🖼 Lightbox Behavior

- Opened from `WorkSection.svelte`.
- Locks page scroll (`overflow: hidden`) and focuses the overlay for a11y.
- **Wheel** (vertical/horizontal) and **touch swipe** move between images.
- Image size capped to **viewport** and **natural resolution** (prevents HiDPI blur).
- On close, restores **scroll position** and returns focus to the originating card.

---

## 🧭 Case Studies

Dynamic route: `src/pages/case-study/[slug].astro`

- `export const getStaticPaths = () => WORKS.map(w => ({ params: { slug: w.slug } }))`
- `export const prerender = true`

Sections:

- **Hero** with title, tags, optional cover.
- **Overview** (summary from `work.ts`).
- **Highlights** (bullet list from `work.ts`).
- **Rubric** cards from `workMeta.ts → details.*`:
  - tools, design, creativity, critique, directions, craftsmanship
- **Gallery** grid (links, or can be wired to `Lightbox`).
- **Sticky TOC** + **Project Info** (tools/tags).
- **Prev/Next** navigation.

---

## ➕ Adding New Work

1) **Create images** under `public/images/work/<slug>/`  
   Recommended files:

        public/images/work/<slug>/cover.png
        public/images/work/<slug>/01.png
        public/images/work/<slug>/02.png

   If a `cover.*` exists, it’s used as the hero and card cover.

2) **Add an entry to `src/lib/data/work.ts`**

        export const WORKS = [
          {
            title: "New Project",
            slug: "new-project",
            blurb: "Short one-liner for the card.",
            summary: "Short paragraph used in Overview.",
            tags: ["Branding"],
            tools: ["Illustrator", "Photoshop"],
            highlights: ["Key win 1", "Key win 2"],
            cover: "/images/work/new-project/cover.png",
            images: [
              "/images/work/new-project/01.png",
              "/images/work/new-project/02.png"
            ]
          }
        ];

3) **(Optional) Add rubric details in `src/lib/data/workMeta.ts`**

        export const WORK_META = {
          "new-project": {
            details: {
              tools: "Explain tool choices and technique depth.",
              design: "Elements/principles used with examples.",
              creativity: "Ideation & originality; ethics if relevant.",
              critique: "How feedback was given/received and applied.",
              directions: "How specs were met or revised and why.",
              craftsmanship: "Resolution, color, type, grids, exports."
            }
          }
        } as const;

That’s it — it appears on `/work` and the case study builds at `/case-study/new-project`.

---

## 🔗 Social Links & Icons

- Social data: `src/lib/social.ts` (e.g., `SOCIAL_LINKS` with `{ id, label, href }`).
- Icon mapping: `src/lib/social-icons.ts` maps `id → icon name` (e.g., `'simple-icons:github'`).
- UI: desktop **left rail** and mobile **bottom bar** using `@iconify/svelte`.

Install a pack (if missing):

    npm i -D @iconify-json/simple-icons
    # examples: 'simple-icons:x', 'simple-icons:github', 'simple-icons:linkedin'

---

## 🧪 Accessibility & UX

- High-contrast palette and restrained motion.
- Proper focus management in modals; Escape/Arrow keys work.
- Touch and wheel navigation for galleries.
- Images use `decoding="async"` and loading hints.
- Sticky TOC improves section navigation.

---

## 🚀 Build & Deploy

- **Static hosting** anywhere (Netlify, Vercel, GitHub Pages, Cloudflare Pages).
- Build and deploy the contents of `dist/`.

    npm run build
    # deploy ./dist with your provider

> If you need server headers/auth/geo for a route, set `export const prerender = false` on that page or configure `output: "server"` in `astro.config.mjs`.

---

## 🧰 Troubleshooting

- **Icons don’t render** → ensure the icon pack is installed and names match.
- **Page looks unstyled** → confirm the page uses `BaseLayout.astro` (imports Tailwind & theme).
- **`getStaticPaths` required** → `[slug].astro` must export `getStaticPaths`.
- **Svelte runes errors** → use `onclick` (not `on:click`), ensure Svelte 5+.

---

## 📝 Contributing

- Use TypeScript.
- Prefer `.astro` pages and `.ts` utilities; hydrate Svelte only where interactivity is essential.
- Keep case-study content **concise, employer-focused**, and fill rubric sections in `workMeta.ts`.

---

## 📄 License

See **LICENSE** for details.
