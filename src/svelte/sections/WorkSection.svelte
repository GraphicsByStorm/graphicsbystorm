<script lang="ts">
  import type { WorkItem } from '$lib/data/work';
  import Lightbox from '$svelte/components/Lightbox.svelte';

  type WorkItemWithMeta = WorkItem & {
    year?: number;
    date?: string;
    coverPosition?: 'top' | 'contain' | 'cover';
  };

  let { items = $bindable([] as WorkItemWithMeta[]) } = $props();

  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);

  let hoveredIndex = $state<number | null>(null);

  let lastScrollX = $state(0), lastScrollY = $state(0);
  let lastFocus: HTMLElement | null = null;
  let wasOpen = $state(false);

  function restoreAfterClose() {
    if (typeof window !== 'undefined') {
      requestAnimationFrame(() => {
        window.scrollTo(lastScrollX, lastScrollY);
        requestAnimationFrame(() => lastFocus?.focus?.());
      });
    } else {
      lastFocus?.focus?.();
    }
  }

  $effect(() => {
    if (wasOpen && !modalOpen) {
      hoveredIndex = null;
      activeIndex = null;
      restoreAfterClose();
    }
    wasOpen = modalOpen;
  });

  const list = $derived((items ?? []) as WorkItemWithMeta[]);

  function openModal(i: number, el?: HTMLElement) {
    if (typeof window !== 'undefined') {
      lastScrollX = window.scrollX || 0;
      lastScrollY = window.scrollY || 0;
    }
    lastFocus = el ?? (document.activeElement as HTMLElement | null);
    hoveredIndex = null;
    (el as HTMLButtonElement | undefined)?.blur?.();

    activeIndex = i;
    modalOpen = true;
  }

  function bgStyle(item: WorkItemWithMeta): string {
    const pos = item.coverPosition === 'top' ? 'center top' : 'center center';
    return `background-image: url('${item.cover}'); background-position: ${pos};`;
  }
</script>

<section id="work" class="section bg-[var(--surface-1)]">
  <div class="mx-auto max-w-6xl px-4 pt-12 sm:pt-14 lg:pt-16">
    <h2 class="mb-4 section-hdr text-[clamp(1.35rem,2.2vw,1.75rem)]">Selected Work</h2>
  </div>

  <div class={"filmstrip-wrap " + (modalOpen ? "modal-open" : "")}>

    {#each list as item, i (item.slug)}
      <article
        class={"row-bleed group relative isolate block overflow-hidden border-b border-white/10 bg-black " + (hoveredIndex === i ? "is-hovered" : "")}
        onpointerenter={() => (hoveredIndex = i)}
        onpointerleave={() => (hoveredIndex = null)}
      >
        <div class="absolute inset-0 z-0 pointer-events-none bg-neutral-900 bg-no-repeat bg-cover"
             style={bgStyle(item)} />

        <div class="veil z-[4]"></div>

        <div class="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-4 sm:px-6 lg:pl-16 lg:pr-6">
          <div class="mx-auto max-w-6xl">
            <div class="flex items-center gap-3">
              <h3 class="truncate text-[13px] sm:text-[14px] font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)]">
                {item.title}
              </h3>

              <div class="hidden sm:flex flex-wrap items-center gap-1 transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)]">
                {#if item.year}<span class="badge">{item.year}</span>{/if}
                {#if item.date}<span class="badge">{item.date}</span>{/if}
                {#each item.tags as t (t)}<span class="badge">{t}</span>{/each}
              </div>

              {#if item.blurb}
                <p class="ml-auto hidden min-w-0 flex-1 truncate pr-24 text-[12px] text-neutral-200 transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)] md:block">
                  {item.blurb}
                </p>
              {/if}

              <div class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[var(--color-brand-500)] underline underline-offset-4 decoration-[var(--color-brand-500)] opacity-0 translate-x-1 transition duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                Preview & expand →
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="hit absolute inset-0 z-[99] cursor-pointer"
          onclick={(e) => openModal(i as number, e.currentTarget as HTMLElement)}
          aria-label={`Open ${item.title} preview`}
        />
      </article>
    {/each}
  </div>

  {#if modalOpen && activeIndex !== null}
    <Lightbox
      images={list[activeIndex].images}
      bind:open={modalOpen}
      alt={list[activeIndex].title}
      title={list[activeIndex].title}
    />
  {/if}
</section>
