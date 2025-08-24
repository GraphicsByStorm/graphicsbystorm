<script lang="ts">
import type { WorkItem } from "$lib/data/work";
import Lightbox from '$svelte/components/Lightbox.svelte';
  import { slide } from "svelte/transition";

type CaseStudyDetails = {
    tools?: string; design?: string; creativity?: string;
    critique?: string; directions?: string; craftsmanship?: string;
};
type WorkItemWithMeta = WorkItem & {
    details?: CaseStudyDetails;
    coverPosition?: "top" | "contain" | "cover";
    date?: string;
    year?: number;
};

let { items = $bindable<WorkItemWithMeta[] | null>(null) } = $props();

const all = $derived((items ?? []) as WorkItemWithMeta[]);

let modalOpen = $state(false);
let activeIndex = $state<number | null>(null);
let slideIndex = $state(0);

let lastScrollX = $state(0), lastScrollY = $state(0);
let lastFocus: HTMLElement | null = null;
let wasOpen = $state(false);

function openModal(i: number, ev?: MouseEvent) {
    if (typeof window !== "undefined") {
      lastScrollX = window.scrollX || 0;
      lastScrollY = window.scrollY || 0;
    }
    lastFocus = (ev?.currentTarget as HTMLElement) ?? (document.activeElement as HTMLElement | null);
    activeIndex = i;
    slideIndex = 0;
    // compute transform-origin from click
    if (ev) {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // relative to viewport center for a nice feel
      originX = Math.min(1, Math.max(0, ev.clientX / vw));
      originY = Math.min(1, Math.max(0, ev.clientY / vh));
    } else {
      originX = 0.5; originY = 0.5;
    }
    modalOpen = true;
    queueMicrotask(() => document.getElementById("work-dialog")?.focus());
  }

  function restoreAfterClose() {
    if (typeof window !== "undefined") {
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
      restoreAfterClose();
      activeIndex = null;
    }
    wasOpen = modalOpen;
  });
</script>

<section id="work" class="section bg-[var(--surface-1, #0b0b0b)]">
    <div class="w-7/8 mx-auto px-4 py-12 sm:py-14 lg:py-16">

        <div class="flex flex-col divide-y divide-white/10 w-full border border-white/10 bg-white/[0.3]">
            {#each all as item, i (item.slug)}
                <button 
                    type="button"
                    class="group text-left focus:outline-none"
                    onclick={(e) => openModal(i as number, e as MouseEvent)}
                    aria-label={`Open ${item.title} gallery`}    
                >
                    <div class="grid mx-4 items-center gap-3 px-4 py-4 sm:gap-5 sm:px-6 sm:py-5 lg:grid-cols-[1fr_auto]">
                        <div class="min-w-0">
                            <h3 class="truncate text-[clamp(1.05rem,1.2vw,1.25rem)] font-extrabold tracking-tight text-white">
                                {item.title}
                            </h3>
                            {#if item.blurb}
                                <p class="mt-1 line-clamp-2 text-[.95rem] text-neutral-300">
                                    {item.blurb}
                                </p>
                            {/if}

                            <div class="mt-2 flex flex-wrap items-center gap-2">
                                {#if item.year}
                                    <span class="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                                        {item.year}
                                    </span>
                                {/if}
                                {#each item.tags as t (t)}
                                    <span class="inline-flex items-center rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] text-white/80">
                                        {t}
                                    </span>
                                {/each}
                            </div>
                        </div>

                        <div class="flex shrink-0 items-center gap-3">
                            <span class="hiden text-[.85rem] text-white/70 sm:inline">
                                Click to preview
                            </span>
                            <span class="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[.9rem] font-semibold text-[var(--color-brand-500,#E2A028)] underline decoration-[var(--color-brand-500,#E2A028)] underline-offset-4 transition group-hover:bg-white/10">
                                View full case study →
                            </span>
                        </div>
                    </div>
                </button>
            {/each}
        </div>
    </div>

    {#if modalOpen && activeIndex !== null}
        <div id="work-dialog" tabindex="-1">
            <Lightbox
                images={all[activeIndex].images}
                startIndex={slideIndex}
                bind:open={modalOpen}
                alt={all[activeIndex].title}
                title={all[activeIndex].title}
                summary={all[activeIndex].summary}
                slug={all[activeIndex].slug}
                coverPosition={all[activeIndex].coverPosition ?? 'contain'}
                originX={originX}
                originY={originY}
            />
        </div>
    {/if}
</section>

<style>
    .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
</style>