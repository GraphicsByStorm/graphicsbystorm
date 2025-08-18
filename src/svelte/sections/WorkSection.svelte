<script lang="ts">
  import type { WorkItem } from "$lib/data/work";
  import { WORKS } from "$lib/data/work";

  // Available filter chips (derived from your dataset)
  const categories = [
    "All",
    "Branding",
    "Social",
    "Promo",
    "YouTube",
    "Poster",
    "Guide",
    "Docs",
    "Esports"
  ] as const;

  type Category = typeof categories[number];

  // Source data (typed)
  const all: WorkItem[] = WORKS;

  // Active filter
  let active = $state<Category>("All");

  // Derived, filtered list
  const filtered = $derived(
    active === "All" ? all : all.filter((i) => i.tags.includes(active as string))
  );

  // Modal state
  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);
  let slideIndex = $state(0);

  // Open/close modal
  const openModal = (i: number) => {
    activeIndex = i;
    slideIndex = 0;
    modalOpen = true;
    // Focus the dialog wrapper once it mounts
    queueMicrotask(() => {
      const el = document.getElementById("work-dialog");
      if (el) el.focus();
    });
  };
  const closeModal = () => {
    modalOpen = false;
    activeIndex = null;
  };

  // Gallery navigation
  const next = () => {
    if (activeIndex === null) return;
    const len = filtered[activeIndex].images.length;
    if (len === 0) return;
    slideIndex = (slideIndex + 1) % len;
  };
  const prev = () => {
    if (activeIndex === null) return;
    const len = filtered[activeIndex].images.length;
    if (len === 0) return;
    slideIndex = (slideIndex - 1 + len) % len;
  };

  // Global keyboard + wheel while modal open
  function onWindowKey(e: KeyboardEvent) {
    if (!modalOpen) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  }
  function onWindowWheel(e: WheelEvent) {
    if (!modalOpen) return;
    e.deltaY > 0 ? next() : prev();
  }

  // Touch swipe for mobile
  let touchX = 0;
  function onTouchStart(e: TouchEvent) {
    touchX = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 30) prev();
    else if (dx < -30) next();
  }
</script>

<!-- Must be top-level -->
<svelte:window onkeydown={onWindowKey} onwheel={onWindowWheel} />

<section id="work" class="section torn-top torn-angle-right" style="--torn-color: var(--color-surface-950);">
  <div class="section-inner">
    <h2 class="heading-2 text-white mb-4">Selected work</h2>

    <!-- Filter chips -->
    <div class="flex flex-wrap gap-2 mb-6">
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

    <!-- Cards (same visual style as Shop) -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item, i}
        <button
          type="button"
          class="card hover-lift block overflow-hidden text-left"
          onclick={() => openModal(i)}
          aria-label={`Open ${item.title} gallery`}
        >
          <div class="aspect-[4/3] bg-neutral-800">
            <img src={item.cover} alt={item.title} class="size-full object-cover" />
          </div>
          <div class="p-3">
            <div class="text-sm text-neutral-100">{item.title}</div>
            <div class="text-neutral-400">{item.tags.join(" · ")}</div>
            {#if item.blurb}
              <p class="text-neutral-300 mt-1">{item.blurb}</p>
            {/if}
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Modal (no torn/texture classes here) -->
  {#if modalOpen && activeIndex !== null}
    <div class="fixed inset-0 z-50 grid place-items-center" role="dialog" aria-modal="true" tabindex="-1">
      <!-- backdrop -->
      <button
        type="button"
        class="absolute inset-0 bg-black/80"
        onclick={closeModal}
        aria-label="Close dialog"
      />
      <!-- dialog panel -->
      <div
        id="work-dialog"
        class="relative z-10 w-full max-w-5xl p-4 card outline-none"
        tabindex="-1"
        ontouchstart={onTouchStart}
        ontouchend={onTouchEnd}
      >
        {#if filtered[activeIndex].images.length > 0}
          <img
            src={filtered[activeIndex].images[slideIndex]}
            alt=""
            class="mx-auto max-h-[70svh] object-contain rounded-lg"
          />
        {/if}

        <button
          class="absolute top-4 right-4 btn-muted !px-0 !py-0 size-9 rounded-full"
          onclick={closeModal}
          aria-label="Close"
          type="button"
        >
          ✕
        </button>

        <div class="mt-4 flex justify-between items-center text-sm text-neutral-300">
          <button class="btn-ghost" onclick={prev} type="button">Prev</button>
          <span>
            {slideIndex + 1}
            /
            {filtered[activeIndex].images.length}
          </span>
          <button class="btn-ghost" onclick={next} type="button">Next</button>
        </div>

        <div class="mt-6">
          <h3 class="heading-2 text-white">{filtered[activeIndex].title}</h3>
          {#if filtered[activeIndex].summary}
            <p class="mt-2 text-neutral-200">{filtered[activeIndex].summary}</p>
          {/if}
          <a class="link-underline mt-3 inline-block" href={`/case-study/${filtered[activeIndex].slug}`}>
            Read full case study →
          </a>
        </div>
      </div>
    </div>
  {/if}
</section>
