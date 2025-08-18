<script lang="ts">
  // Svelte 5 runes
  const categories = ["All", "Branding", "Web", "3D", "Motion"] as const;
  let active = $state<typeof categories[number]>("All");

  type Work = {
    title: string;
    slug: string;
    cover: string;
    blurb: string;
    tags: string[];
    images: string[];
  };

  // Placeholder data — replace with your real content/images
  let items = $state<Work[]>([
    { title: "Awoke.gg", slug: "awoke-gg", cover: "/images/work1.jpg", blurb: "Esports brand refresh.", tags: ["Branding"], images: ["/images/work1.jpg","/images/work1b.jpg"] },
    { title: "Motion Pack", slug: "motion-pack", cover: "/images/work2.jpg", blurb: "Promo animations.", tags: ["Motion"], images: ["/images/work2.jpg"] },
    { title: "3D Stills", slug: "3d-stills", cover: "/images/work3.jpg", blurb: "Product renders.", tags: ["3D"], images: ["/images/work3.jpg","/images/work3b.jpg"] },
  ]);

  const filtered = $derived(
    active === "All" ? items : items.filter((i) => i.tags.includes(active as string))
  );

  // Modal state
  let modalOpen = $state(false);
  let activeIndex = $state<number | null>(null);
  let slideIndex = $state(0);

  const openModal = (i: number) => { activeIndex = i; slideIndex = 0; modalOpen = true; };
  const closeModal = () => { modalOpen = false; activeIndex = null; };
  const next = () => { if (activeIndex === null) return; slideIndex = (slideIndex + 1) % filtered[activeIndex].images.length; };
  const prev = () => { if (activeIndex === null) return; slideIndex = (slideIndex - 1 + filtered[activeIndex].images.length) % filtered[activeIndex].images.length; };

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

  let touchX = 0;
  function onTouchStart(e: TouchEvent) { touchX = e.changedTouches[0].clientX; }
  function onTouchEnd(e: TouchEvent) {
    const dx = e.changedTouches[0].clientX - touchX;
    if (dx > 30) prev(); else if (dx < -30) next();
  }
</script>

<svelte:window onkeydown={onWindowKey} onwheel={onWindowWheel} />

<section id="work" class="section-wrap">
  <h2 class="heading-2 mb-4">Selected work</h2>

  <!-- Filter chips -->
  <div class="flex flex-wrap gap-2 mb-6">
    {#each categories as t}
      <button
        class={"chip chip-grunge " + (active === t ? "chip-active" : "")}
        onclick={() => (active = t)}
        aria-pressed={active === t}
        type="button"
      >
        {t}
      </button>
    {/each}
  </div>

  <!-- Grid -->
  <div class="grid grid-cols-12 gap-3 md:gap-4">
    {#each filtered as item, i}
      <button
        type="button"
        class="card-grunge hover-lift group relative overflow-hidden col-span-12 md:col-span-6 xl:col-span-4 tape-corner"
        onclick={() => openModal(i)}
      >
        <img src={item.cover} alt="" class="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
        <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        <div class="absolute bottom-3 left-3 text-sm text-neutral-200">{item.title}</div>
      </button>
    {/each}
  </div>

  <!-- Modal -->
  {#if modalOpen && activeIndex !== null}
    <div class="fixed inset-0 z-50 grid place-items-center" role="dialog" aria-modal="true" tabindex="-1">
      <button type="button" aria-label="Close dialog" class="absolute inset-0 bg-black/80" onclick={closeModal}></button>
      <div class="relative z-10 w-full max-w-5xl p-4 card-grunge" ontouchstart={onTouchStart} ontouchend={onTouchEnd}>
        <img
          src={filtered[activeIndex].images[slideIndex]}
          alt=""
          class="mx-auto max-h-[70svh] object-contain rounded-lg"
        />
        <button class="absolute top-4 right-4 btn-muted !px-0 !py-0 size-9 rounded-full" onclick={closeModal} aria-label="Close">✕</button>

        <div class="mt-4 flex justify-between items-center text-sm text-neutral-300">
          <button class="btn-ghost" onclick={prev}>Prev</button>
          <span>{slideIndex + 1} / {filtered[activeIndex].images.length}</span>
          <button class="btn-ghost" onclick={next}>Next</button>
        </div>

        <div class="mt-6">
          <h3 class="heading-2">{filtered[activeIndex].title}</h3>
          <p class="mt-2 text-neutral-300">{filtered[activeIndex].blurb}</p>
          <a class="ink-underline mt-3 inline-block" href={`/case-study/${filtered[activeIndex].slug}`}>Read full case study →</a>
        </div>
      </div>
    </div>
  {/if}
</section>
