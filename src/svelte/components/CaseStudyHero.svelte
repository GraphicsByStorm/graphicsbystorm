<script lang="ts">
  // Props (Svelte 5 runes)
  let {
    images = [] as string[], // unused now, but harmless
    cover = "" as string,
    title = "" as string,
    summary = "" as string,
    tags = [] as string[],
    year = undefined as number | undefined,
    date = undefined as string | undefined,
    coverPosition = "cover" as "top" | "contain" | "cover",
  } = $props();

  // Build object-fit hint for the hero image
  function heroImgStyle(pos: "top" | "contain" | "cover"): string {
    if (pos === "top") return "object-fit: cover; object-position: top center;";
    if (pos === "contain") return "object-fit: contain; background:#0e0e0e;";
    return "object-fit: cover; object-position: center;";
  }
</script>

<!-- Edge-to-edge hero filmstrip (320px base, expands on hover/focus-within) -->
<section class="hero-bleed" style="--left-rail: var(--left-rail, 96px);">
  <article
    class="group relative isolate w-[100vw] overflow-hidden border-b border-white/10 bg-black/30 transition-colors hover:bg-black/40 focus-within:bg-black/40"
  >
    <!-- image layer -->
    {#if cover}
      <img
        src={cover}
        alt={title}
        class="absolute inset-0 h-full w-full"
        draggable="false"
        style={heroImgStyle(coverPosition)}
      />
    {/if}

    <!-- veil -->
    <div
      class="absolute inset-0 bg-black/35 transition-opacity duration-200 group-hover:bg-black/20"
    ></div>

    <!-- row content -->
    <div class="hero-row relative flex items-center gap-3">
      <!-- left brand tick -->
      <div
        class="mr-2 inline-block h-3 w-1.5"
        style="background: var(--color-brand-500,#E2A028);"
      ></div>

      <div class="min-w-0 flex-1">
        <h1
          class="truncate text-[14px] sm:text-[15px] font-extrabold tracking-tight text-white"
        >
          {title}
        </h1>

        {#if summary}
          <p class="mt-1 line-clamp-1 text-[12px] text-white/80">
            {summary}
          </p>
        {/if}

        {#if tags.length || year || date}
          <div class="mt-2 flex flex-wrap items-center gap-1.5">
            {#if year}<span class="hpill">{year}</span>{/if}
            {#if date}<span class="hpill weak">{date}</span>{/if}
            {#each tags as t (t)}<span class="hpill weak">{t}</span>{/each}
          </div>
        {/if}
      </div>
    </div>
  </article>
</section>

<style>
  /* Full-bleed helper */
  .hero-bleed {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }

  /* Row with left-rail clearance; 320px base, 520px expanded */
  .hero-row {
    padding-left: calc(var(--left-rail, 96px) + 1rem);
    padding-right: 1rem;

    height: 320px;
    transition:
      height 0.28s ease,
      padding 0.28s ease,
      transform 0.2s ease;
    display: flex;
    align-items: center;
    transform: translateY(8px); /* nudge down for legibility */
  }
  .group:hover .hero-row,
  .group:focus-within .hero-row {
    height: 520px;
    transform: translateY(0);
  }

  .hpill {
    display: inline-flex;
    align-items: center;
    padding: 0.18rem 0.45rem;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: color-mix(
      in oklab,
      var(--color-brand-500, #e2a028) 14%,
      transparent
    );
    color: #fff;
    font-weight: 800;
    font-size: 0.78rem;
  }
  .hpill.weak {
    background: rgba(255, 255, 255, 0.06);
    color: #dfe3e7;
    font-weight: 700;
  }

  /* One-line clamp */
  .line-clamp-1 {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
