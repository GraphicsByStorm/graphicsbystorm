<script lang="ts">
  import type { WorkItem } from '$lib/data/work';
  import { WORK } from '$lib/data/work';

  const allTags: string[] = ['All', ...Array.from(new Set(WORK.flatMap(i => i.tags)))];
  let filter = $state<string>('All');
  const items = $state<WorkItem[]>(WORK);
  const filtered = $derived(filter === 'All' ? items : items.filter(i => i.tags.includes(filter)));

  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);
  let slideIndex = $state(0);

  function openModal(i: number) {
    activeIndex = i; slideIndex = 0; modalOpen = true;
    document.documentElement.style.overflow = 'hidden';
  }
  function closeModal() {
    modalOpen = false; activeIndex = null; document.documentElement.style.overflow = '';
  }
  function next() {
    if (activeIndex == null) return;
    const imgs = filtered[activeIndex].images;
    slideIndex = (slideIndex + 1) % imgs.length;
  }
  function prev() {
    if (activeIndex == null) return;
    const imgs = filtered[activeIndex].images;
    slideIndex = (slideIndex - 1 + imgs.length) % imgs.length;
  }

  // gestures & window events
  let touchX = 0;
  function onTouchStart(e: TouchEvent) { touchX = e.touches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
  }
  function onWindowWheel(e: WheelEvent) {
    if (!modalOpen) return;
    if (e.deltaY > 0) next(); else prev();
  }
  function onWindowKey(e: KeyboardEvent) {
    if (!modalOpen) return;
    if (e.key === 'Escape') return closeModal();
    if (e.key === 'ArrowRight') return next();
    if (e.key === 'ArrowLeft') return prev();
  }
</script>

<svelte:window onwheel={onWindowWheel} onkeydown={onWindowKey} />

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <div class="mb-6 flex flex-wrap gap-2">
    {#each allTags as t}
      <button
        class={`px-3 py-1 rounded-full border border-white/15 text-sm ${
          filter === t ? 'bg-white text-black' : 'text-neutral-300'
        }`}
        onclick={() => (filter = t)}
      >{t}</button>
    {/each}
  </div>

  <div class="grid grid-cols-12 gap-4">
    {#each filtered as item, i}
      <button
        type="button"
        class="group relative cursor-pointer rounded-xl overflow-hidden bg-neutral-900
               col-span-12 md:col-span-7 [&:nth-child(2n)]:md:col-span-5
               [&:nth-child(3n)]:md:col-span-4 [&:nth-child(4n)]:md:col-span-8"
        onclick={() => openModal(i)}
      >
        <img src={item.cover} alt="" class="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div class="absolute bottom-3 left-3 text-sm text-neutral-200">{item.title}</div>
      </button>
    {/each}
  </div>
</div>

{#if modalOpen && activeIndex !== null}
  <div
    class="fixed inset-0 z-50 grid place-items-center"
    role="dialog"
    aria-modal="true"
    tabindex="-1"
  >
    <!-- Backdrop: accessible button that closes the dialog -->
    <button
      type="button"
      aria-label="Close dialog"
      class="absolute inset-0 bg-black/80"
      onclick={closeModal}
    ></button>

    <!-- Dialog content (no onclick needed) -->
    <div
      class="relative z-10 max-w-5xl w-full p-4"
      ontouchstart={onTouchStart}
      ontouchend={onTouchEnd}
    >
      {#if filtered[activeIndex]}
        <img
          src={filtered[activeIndex].images[slideIndex]}
          alt=""
          class="mx-auto max-h-[70svh] object-contain rounded"
        />
        <button class="absolute top-4 right-4 h-9 w-9 rounded-full bg-white text-black" onclick={closeModal} aria-label="Close">✕</button>

        <div class="mt-4 flex justify-between items-center text-sm text-neutral-300">
          <button class="px-3 py-1 rounded border border-white/20" onclick={prev} aria-label="Previous image">Prev</button>
          <span>{slideIndex + 1} / {filtered[activeIndex].images.length}</span>
          <button class="px-3 py-1 rounded border border-white/20" onclick={next} aria-label="Next image">Next</button>
        </div>

        <div class="mt-6">
          <h3 class="text-xl font-semibold text-white">{filtered[activeIndex].title}</h3>
          <p class="mt-2 text-neutral-300">{filtered[activeIndex].blurb}</p>
          <a class="inline-block mt-4 underline" href={`/case-study/${filtered[activeIndex].slug}`}>Read full case study →</a>
        </div>
      {/if}
    </div>
  </div>
{/if}
