<script lang="ts">
  import type { WorkItem } from "$lib/data/work";
  import { WORKS } from "$lib/data/work";

  const categories = ["All","Branding","Social","Promo","YouTube","Poster","Guide","Docs","Esports"] as const;
  type Category = typeof categories[number];

  const all: WorkItem[] = WORKS;
  let active = $state<Category>("All");

  const filtered = $derived(active === "All" ? all : all.filter((i) => i.tags.includes(active as string)));

  // Modal state (unchanged behavior)
  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);
  let slideIndex = $state(0);

  const openModal = (i: number) => { activeIndex = i; slideIndex = 0; modalOpen = true; queueMicrotask(() => document.getElementById("work-dialog")?.focus()); };
  const closeModal = () => { modalOpen = false; activeIndex = null; };

  const next = () => { if (activeIndex === null) return; const len = filtered[activeIndex].images.length; if (len) slideIndex = (slideIndex + 1) % len; };
  const prev = () => { if (activeIndex === null) return; const len = filtered[activeIndex].images.length; if (len) slideIndex = (slideIndex - 1 + len) % len; };

  function onWindowKey(e: KeyboardEvent) { if (!modalOpen) return; if (e.key === "Escape") closeModal(); if (e.key === "ArrowRight") next(); if (e.key === "ArrowLeft") prev(); }
  function onWindowWheel(e: WheelEvent) { if (!modalOpen) return; e.deltaY > 0 ? next() : prev(); }

  // Touch swipe
  let touchX = 0;
  function onTouchStart(e: TouchEvent) { touchX = e.changedTouches[0].clientX; }
  function onTouchEnd(e: TouchEvent) { const dx = e.changedTouches[0].clientX - touchX; if (dx > 30) prev(); else if (dx < -30) next(); }
</script>

<svelte:window onkeydown={onWindowKey} onwheel={onWindowWheel} />

<section id="work" class="section bg-[var(--surface-1,#0b0b0b)]">
  <div class="mx-auto max-w-6xl px-4 py-12 sm:py-14 lg:py-16">
    <div class="mb-4 flex items-center justify-between">
      <h2 class="text-[clamp(1.35rem,2.2vw,1.75rem)] font-extrabold tracking-tight text-white">
        <span class="mr-2 inline-block h-3 w-1.5 translate-y-[2px] rounded-full"
              style="background: var(--color-brand-500,#E2A028);"></span>
        Selected Work
      </h2>
    </div>

    <!-- Chips -->
    <div class="mb-5 flex flex-wrap gap-2">
      {#each categories as t}
        <button
          type="button"
          class={"chip " + (active === t ? "chip-active" : "")}
          onclick={() => (active = t)}
          aria-pressed={active === t}
        >
          {t}
        </button>
      {/each}
    </div>

    <!-- Cards (downsized like Services) -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item, i}
        <button
          type="button"
          class="work-card block overflow-hidden text-left"
          onclick={() => openModal(i)}
          aria-label={`Open ${item.title} gallery`}
        >
          <div class="aspect-[4/3] bg-neutral-850">
            <img src={item.cover} alt={item.title} class="size-full object-cover" loading="lazy" />
          </div>
          <div class="p-2.5">
            <div class="text-[.95rem] font-semibold text-neutral-50">{item.title}</div>
            <div class="text-[.8rem] text-neutral-400">{item.tags.join(" · ")}</div>
            {#if item.blurb}
              <p class="mt-1 text-[.88rem] text-neutral-300 line-clamp-2">{item.blurb}</p>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Modal (kept compact, brand-consistent) -->
  {#if modalOpen && activeIndex !== null}
    <div class="fixed inset-0 z-50 grid place-items-center" role="dialog" aria-modal="true" tabindex="-1">
      <button type="button" class="absolute inset-0 bg-black/80" onclick={closeModal} aria-label="Close dialog" ></button>
      <div
        id="work-dialog"
        class="relative z-10 w-full max-w-5xl p-4 rounded-xl border border-white/10 bg-[color-mix(in_oklab,#000_88%,var(--color-brand-500,#E2A028)_12%)] outline-none"
        tabindex="-1"
        ontouchstart={onTouchStart}
        ontouchend={onTouchEnd}
      >
        {#if filtered[activeIndex].images.length > 0}
          <img
            src={filtered[activeIndex].images[slideIndex]}
            alt=""
            class="mx-auto max-h-[70svh] object-contain rounded-lg select-none"
            draggable="false"
          />
        {/if}

        <button
          class="absolute top-3 right-3 inline-grid place-items-center size-8 rounded-full border border-white/15 bg-white/10 text-white/90 hover:bg-white/15"
          onclick={closeModal}
          aria-label="Close"
          type="button"
        >✕</button>

        <div class="mt-3 flex items-center justify-between text-[.85rem] text-neutral-300">
          <button class="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 hover:bg-white/15" onclick={prev} type="button">Prev</button>
          <span>{slideIndex + 1} / {filtered[activeIndex].images.length}</span>
          <button class="rounded-md border border-white/10 bg-white/10 px-2.5 py-1 hover:bg-white/15" onclick={next} type="button">Next</button>
        </div>

        <div class="mt-5">
          <h3 class="text-[1.05rem] font-extrabold text-white">{filtered[activeIndex].title}</h3>
          {#if filtered[activeIndex].summary}
            <p class="mt-1.5 text-[.95rem] leading-relaxed text-neutral-200/95 line-clamp-3">{filtered[activeIndex].summary}</p>
          {/if}
          <a class="mt-2 inline-block text-[.9rem] font-semibold text-white underline decoration-[var(--color-brand-500,#E2A028)] underline-offset-4 hover:opacity-90"
             href={`/case-study/${filtered[activeIndex].slug}`}>
            Read full case study →
          </a>
        </div>
      </div>
    </div>
  {/if}
</section>

<style>
  .chip {
    padding: .3rem .6rem;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.1);
    background: rgba(255,255,255,.04);
    color: #e8eaed;
    font-size: .8rem;
    font-weight: 700;
  }
  .chip-active {
    background: color-mix(in oklab, var(--color-brand-500,#E2A028) 18%, transparent);
    border-color: rgba(255,255,255,.16);
    color: #fff;
  }

  .work-card {
    border-radius: 14px;
    border: 1px solid rgba(255,255,255,.08);
    background: rgba(255,255,255,.04);
    transition: transform .12s ease, box-shadow .12s ease, background .12s ease;
  }
  .work-card:hover {
    transform: translateY(-1px);
    background: rgba(255,255,255,.055);
    box-shadow: 0 8px 20px rgba(0,0,0,.32);
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
