<script lang="ts">
  import { stopPropagation } from "svelte/legacy";

    // Tags & items are placeholders for wireframing.
    const tags = ['All','Branding','Logo','3D','Motion'] as const;
    let filter = $state<typeof tags[number]>('All');

    type Item = {
        id: number; title: string; slug: string;
        tags: string[]; cover: string; images: string[];
    };

    const items = $state<Item[]>([
        { id:1, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:2, title:'Pit Viper AWP Giveaway Promo', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:3, title:'Elite Build AK-47 Giveaway Promo', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:4, title:'Obsidian Tides Social Package', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:5, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:6, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:7, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:8, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:9, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
        { id:10, title:'Awoke.GG', slug:'awoke-gg', tags:['Branding','Logo'], cover:'/placeholder/1.jpg', images:['/placeholder/1,jpg','/placeholder/2.jpg'] },
    ]);

    $: filtered = filter === 'All' ? items : items.filter(i => i.tags.includes(filter));

    // Modal state
    let modalOpen = $state(false);
    let activeIndex = $state<number | null>(null);
    let slideIndex = $state(0);

    function openModal(i: number) {
        activeIndex = i; slideIndex = 0; modalOpen = true;
        document.documentElement.style.overflow = 'hidden';
    }
    function closeModal() {
        modalOpen = false; activeIndex = null;
        document.documentElement.style.overflow = '';
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

    // Wheel & swipe logic
    let touchX = 0;
    function onTouchStart(e: TouchEvent) { touchX = e.touches[0].clientX; }
    function onTouchEnd(e: TouchEvent) {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    }

    function onWheel(e: WheelEvent) {
        if (!modalOpen) return;
        if (e.deltaY > 0) next(); else prev();
    }
</script>

<div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Filter chips -->
     <div class="mb-6 flex flex-wrap gap-2">
        {#each tags as t}
            <button 
                class="px-3 py-1 rounded-full border border-white text-sm"
                class:bg-white={filter===t}
                class:text-black={filter===t}
                class:text-neutral-300={filter!==t}
                onclick={() => filter = t}
            >
                {t}
            </button>
        {/each}
     </div>

     <!-- Asymmetrical grid -->
      <div class="grid grid-cols-12 gap-4">
        {#each filtered as item, i}
            <article 
                class="group relative cursor-pointer rounded-xl overflow-hidden bg-neutral-900 col-span-12 md:col-span-7 [&:nth-child(2n)]:md:col-span-5 [&:nth-child(3n)]:md:col-span-4 [&:nth-child(4n)]:md:col-span-8"
                onclick={() => openModal(i)}
            >
                <img src={item.cover} alt="" class="size-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div class="absolute bottom-3 left-3 text-sm text-neutral-200">{item.title}</div>
            </article>
        {/each}
      </div>

      <!-- Modal -->
       {#if modalOpen && activeIndex !== null}
        <svelte:window onwheel={onWheel} />
        <div class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onclick={closeModal}>
            <div class="relative max-w-5xl w-full p-4" onclick|stopPropagation ontouchstart={onTouchStart} ontouchend={onTouchEnd}>
                {#if filtered[activeIndex]}
                    <img src={filtered[activeIndex].images[slideIndex]} alt="" class="mx-auto max-h-[70svh] object-contain rounded">
                {/if}
            </div>
        </div>
       {/if}
</div>