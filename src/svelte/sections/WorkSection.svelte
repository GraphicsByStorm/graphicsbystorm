<!-- src/svelte/components/WorkSection.svelte -->
<script lang="ts">
  import type { WorkItem } from "$lib/data/work";

  type WorkItemWithMeta = WorkItem & {
    year?: number;
    date?: string;
    coverPosition?: "top" | "contain" | "cover";
  };

  // ✅ Runes props (no `export let`, no `$props<T>`):
  let {
    items = $bindable([] as WorkItemWithMeta[]),
    heading = $bindable<string | undefined>(undefined),
  } = $props();

  const list = $derived((items ?? []) as WorkItemWithMeta[]);

  function bgStyle(item: WorkItemWithMeta): string {
    const pos = item.coverPosition === "top" ? "center top" : "center center";
    return `background-image:url('${item.cover}'); background-position:${pos}; background-size:cover;`;
  }

  function goto(slug: string) {
    location.href = `/case-study/${slug}`;
  }
</script>

<section id="work" class="section bg-[var(--surface-1)]">
  <div class="mx-auto max-w-6xl px-4 pt-12 sm:pt-14 lg:pt-16">
    <h2 class="mb-4 section-hdr text-[clamp(1.35rem,2.2vw,1.75rem)]">
      {heading ?? "Selected Work"}
    </h2>
  </div>

  <div class="filmstrip-wrap">
    {#each list as item (item.slug)}
      <article
        class="row-bleed group relative isolate block overflow-hidden border-b border-white/10 bg-black"
      >
        <div
          class="absolute inset-0 z-0 pointer-events-none bg-neutral-900 bg-no-repeat bg-cover"
          style={bgStyle(item)}
        ></div>

        <div class="veil z-[4]"></div>

        <div
          class="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 px-4 sm:px-6 lg:pl-16 lg:pr-6"
        >
          <div class="mx-auto max-w-6xl">
            <div class="flex items-center gap-3">
              <h3
                class="truncate text-[13px] sm:text-[14px] font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)]"
              >
                {item.title}
              </h3>

              <div
                class="hidden sm:flex flex-wrap items-center gap-1 transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)]"
              >
                {#if item.year}<span class="badge">{item.year}</span>{/if}
                {#if item.date}<span class="badge">{item.date}</span>{/if}
                {#each item.tags as t (t)}<span class="badge">{t}</span>{/each}
              </div>

              {#if item.blurb}
                <p
                  class="ml-auto hidden min-w-0 flex-1 truncate pr-24 text-[12px] text-neutral-200 transition-transform duration-300 group-hover:translate-y-[var(--hover-shift)] md:block"
                >
                  {item.blurb}
                </p>
              {/if}

              <div
                class="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[var(--color-brand-500)] underline underline-offset-4 decoration-[var(--color-brand-500)] opacity-0 translate-x-1 transition duration-300 ease-out group-hover:opacity-100 group-hover:translate-x-0"
              >
                View case study →
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          class="hit absolute inset-0 z-[99] cursor-pointer"
          onclick={() => goto(item.slug)}
          aria-label={`Open ${item.title} case study`}
        ></button>
      </article>
    {/each}
  </div>
</section>

<style>
  .section-hdr::before {
    content: "";
    display: inline-block;
    width: 6px;
    height: 12px;
    background: var(--color-brand-500, #e2a028);
    margin-right: 0.5rem;
  }
  .filmstrip-wrap {
    --hover-shift: -4px;
  }
  .row-bleed {
    width: 100vw;
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    height: 160px;
    transition: height 0.28s ease;
  }
  .row-bleed:hover {
    height: 240px;
  }
  .veil {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.35),
      rgba(0, 0, 0, 0.45)
    );
    transition: background 0.2s ease;
  }
  .row-bleed:hover .veil {
    background: linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.25),
      rgba(0, 0, 0, 0.35)
    );
  }
  .badge {
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(255, 255, 255, 0.06);
    color: #dfe3e7;
    font-weight: 700;
    font-size: 0.76rem;
    padding: 0.18rem 0.45rem;
  }
</style>
