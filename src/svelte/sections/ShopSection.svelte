<script lang="ts">
  import type { Product } from '$lib/data/shop';
  import { PRODUCTS } from '$lib/data/shop';

  const allTags: string[] = ['All', ...Array.from(new Set(PRODUCTS.flatMap(p => p.tags)))];
  let filter = $state<string>('All');
  const products = $state<Product[]>(PRODUCTS);
  const filtered = $derived(filter === 'All' ? products : products.filter(p => p.tags.includes(filter)));
</script>

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

  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
    {#each filtered as p}
      <a href={`/product/${p.slug}`} class="block rounded-xl overflow-hidden border border-white/10 bg-neutral-900">
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
</div>
