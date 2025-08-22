<script lang="ts">
  import type { WorkItem } from "$lib/data/work";
  import Lightbox from "$svelte/components/Lightbox.svelte";

  // Prop shape accepted from Astro (details comes from WORK_META)
  type CaseStudyDetails = {
    tools?: string; design?: string; creativity?: string;
    critique?: string; directions?: string; craftsmanship?: string;
  };
  type WorkItemWithMeta = WorkItem & { details?: CaseStudyDetails };

  // Accept pre-merged items from Astro (runes props)
  let { items = $bindable<WorkItemWithMeta[] | null>(null) } = $props();

  // Categories / filtering
  const categories = ["All","Branding","Social","Promo","YouTube","Poster","Guide","Docs","Esports"] as const;
  type Category = typeof categories[number];
  let active = $state<Category>("All");

  const all = $derived((items ?? []) as WorkItemWithMeta[]);
  const filtered = $derived(
    active === "All" ? all : all.filter((i) => i.tags.includes(active as string))
  );

  // Modal + focus/scroll restore
  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);
  let slideIndex = $state(0);
  let lastScrollX = $state(0), lastScrollY = $state(0);
  let lastFocus: HTMLElement | null = null; let wasOpen = $state(false);

  function openModal(i: number, el?: HTMLElement) {
    if (typeof window !== 'undefined') { lastScrollX = window.scrollX||0; lastScrollY = window.scrollY||0; }
    lastFocus = el ?? (document.activeElement as HTMLElement | null);
    activeIndex = i; slideIndex = 0; modalOpen = true;
    queueMicrotask(() => document.getElementById("work-dialog")?.focus());
  }
  function restoreAfterClose() {
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo(lastScrollX, lastScrollY);
        requestAnimationFrame(() => lastFocus?.focus?.());
      });
    } else { lastFocus?.focus?.(); }
  }
  $effect(() => { if (wasOpen && !modalOpen) { restoreAfterClose(); activeIndex = null; } wasOpen = modalOpen; });
</script>

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

    <!-- Cards -->
    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item, i (item.slug)}
        <button
          type="button"
          class="work-card block overflow-hidden text-left"
          onclick={(e) => openModal(i as number, e.currentTarget as HTMLElement)}
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

  {#if modalOpen && activeIndex !== null}
    <div id="work-dialog" tabindex="-1">
      <Lightbox
        images={filtered[activeIndex].images}
        startIndex={slideIndex}
        bind:open={modalOpen}
        alt={filtered[activeIndex].title}
        title={filtered[activeIndex].title}
        summary={filtered[activeIndex].summary}
        slug={filtered[activeIndex].slug}
        tags={filtered[activeIndex].tags}
        tools={filtered[activeIndex].tools}
        highlights={filtered[activeIndex].highlights}
        details={filtered[activeIndex].details}
      />
    </div>
  {/if}
</section>

<style>
  .chip{ padding:.3rem .6rem; border-radius:999px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.04); color:#e8eaed; font-size:.8rem; font-weight:700; }
  .chip-active{ background: color-mix(in oklab, var(--color-brand-500,#E2A028) 18%, transparent); border-color: rgba(255,255,255,.16); color:#fff; }
  .work-card{ border-radius:14px; border:1px solid rgba(255,255,255,.08); background:rgba(255,255,255,.04); transition: transform .12s ease, box-shadow .12s ease, background .12s ease; }
  .work-card:hover{ transform: translateY(-1px); background: rgba(255,255,255,.055); box-shadow: 0 8px 20px rgba(0,0,0,.32); }
  .line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
</style>
