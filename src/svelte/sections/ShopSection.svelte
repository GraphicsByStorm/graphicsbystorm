<script lang="ts">
  type Product = { title: string; slug: string; price: string; cover: string; tags: string[] };
  const tags = ["All", "Logos", "Stream Packs", "Overlays"] as const;
  let active = $state<typeof tags[number]>("All");

  let products = $state<Product[]>([
    { title: "Logo Pack A", slug: "logo-pack-a", price: "$260.00", cover: "/images/p1.jpg", tags: ["Logos"] },
    { title: "Stream Overlay", slug: "overlay-01", price: "$180.00", cover: "/images/p2.jpg", tags: ["Overlays", "Stream Packs"] },
    { title: "Logo Pack B", slug: "logo-pack-b", price: "$320.00", cover: "/images/p3.jpg", tags: ["Logos"] },
  ]);

  const filtered = $derived(
    active === "All" ? products : products.filter((p) => p.tags.includes(active as string))
  );
</script>

<section id="shop" class="section-wrap">
  <h2 class="heading-2 mb-4">Shop</h2>

  <div class="flex flex-wrap gap-2 mb-6">
    {#each tags as t}
      <button
        type="button"
        class={"chip chip-grunge " + (active === t ? "chip-active" : "")}
        onclick={() => (active = t)}
        aria-pressed={active === t}
      >
        {t}
      </button>
    {/each}
  </div>

  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {#each filtered as p}
      <a href={`/product/${p.slug}`} class="card-grunge hover-lift block overflow-hidden">
        <div class="aspect-[4/3] bg-neutral-800">
          <img src={p.cover} alt="" class="size-full object-cover" />
        </div>
        <div class="p-3">
          <div class="text-sm text-neutral-100">{p.title}</div>
          <div class="text-neutral-400">{p.price}</div>
        </div>
      </a>
    {/each}
  </div>
</section>
