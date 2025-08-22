<script lang="ts">
  import { onDestroy } from 'svelte';

  // — Props (Svelte 5 runes) —
  let {
    images = [] as string[],
    startIndex = 0,
    open = $bindable(false),
    alt = 'image',
    title = '',
    summary = '',
    slug = '',

    // NEW: compact meta shown in details column
    tags = [] as string[],
    tools = [] as string[],
    highlights = [] as string[],

    // NEW: long-form rubric fields (optional; render only if present)
    details = {} as {
      tools?: string;
      design?: string;
      creativity?: string;
      critique?: string;
      directions?: string;
      craftsmanship?: string;
    }
  } = $props();

  // — State —
  let index = $state(startIndex);
  let overlay = $state<HTMLDivElement | null>(null);
  let imgEl = $state<HTMLImageElement | null>(null);
  let naturalW = $state(0);
  let naturalH = $state(0);
  let dpr = $state(1);

  $effect(() => { index = startIndex; });

  // DPR tracking (avoid blurry upscaling)
  function updateDPR(){ if (typeof window!=='undefined') dpr = Math.max(1, window.devicePixelRatio||1); }
  if (typeof window!=='undefined'){
    updateDPR(); window.addEventListener('resize', updateDPR); window.addEventListener('orientationchange', updateDPR);
  }
  onDestroy(()=>{ if (typeof window!=='undefined'){ window.removeEventListener('resize', updateDPR); window.removeEventListener('orientationchange', updateDPR); }});

  function handleImgLoad(e: Event){ const el = e.currentTarget as HTMLImageElement; naturalW = el.naturalWidth||0; naturalH = el.naturalHeight||0; }

  // — Scroll lock (reversible, no layout jank) —
  type Restore=()=>void; let restoreScroll:Restore|null=null;
  function lockScroll(){
    if(restoreScroll||typeof window==='undefined') return;
    const html=document.documentElement, body=document.body;
    const prev={ htmlOverflow: html.style.overflow, bodyOverflow: body.style.overflow,
      htmlOverscroll:(html.style as any).overscrollBehavior||'',
      bodyOverscroll:(body.style as any).overscrollBehavior||'',
      bodyTouch:(body.style as any).touchAction||'' };
    html.style.overflow='hidden'; body.style.overflow='hidden';
    (html.style as any).overscrollBehavior='contain'; (body.style as any).overscrollBehavior='contain';
    (body.style as any).touchAction='none';
    const eatWheel=(e:WheelEvent)=>e.preventDefault(), eatTouch=(e:TouchEvent)=>e.preventDefault();
    document.addEventListener('wheel', eatWheel as EventListener, {passive:false, capture:true});
    document.addEventListener('touchmove', eatTouch as EventListener, {passive:false, capture:true});
    restoreScroll=()=>{ document.removeEventListener('wheel', eatWheel as EventListener, {capture:true} as any);
      document.removeEventListener('touchmove', eatTouch as EventListener, {capture:true} as any);
      html.style.overflow=prev.htmlOverflow; body.style.overflow=prev.bodyOverflow;
      (html.style as any).overscrollBehavior=prev.htmlOverscroll; (body.style as any).overscrollBehavior=prev.bodyOverscroll;
      (body.style as any).touchAction=prev.bodyTouch; };
    queueMicrotask(()=>overlay?.focus());
  }
  function unlockScroll(){ restoreScroll?.(); restoreScroll=null; }
  $effect(()=>{ open ? lockScroll() : unlockScroll(); });
  onDestroy(()=>unlockScroll());

  // — Navigation + input —
  function close(){ open=false; }
  function next(){ if(images.length) index=(index+1)%images.length; }
  function prev(){ if(images.length) index=(index-1+images.length)%images.length; }
  function onKey(e: KeyboardEvent){ if(!open) return; if(e.key==='Escape') close(); if(e.key==='ArrowRight') next(); if(e.key==='ArrowLeft') prev(); }

  // Touch swipe
  let touchX=0, touchY=0;
  function onTouchStart(e:TouchEvent){ const t=e.changedTouches[0]; touchX=t.clientX; touchY=t.clientY; }
  function onTouchEnd(e:TouchEvent){ const t=e.changedTouches[0]; const dx=t.clientX-touchX, dy=t.clientY-touchY;
    if(Math.abs(dx)>Math.max(30,Math.abs(dy))) dx>0?prev():next(); }

  // Wheel → image nav (except over details column which scrolls)
  let wheelCooldown=false, wheelAttached=false;
  function handleOverlayWheel(e:WheelEvent){
    const el = e.target as HTMLElement | null;
    const inDetails = el?.closest?.('.lb-details-scroll');
    if (inDetails) return; // allow natural scroll in details column
    e.preventDefault(); if(wheelCooldown) return; wheelCooldown=true;
    const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    vertical ? (e.deltaY>0?next():prev()) : (e.deltaX>0?next():prev());
    setTimeout(()=>wheelCooldown=false,170);
  }
  function attachOverlayWheel(){ if(!overlay||wheelAttached) return; overlay.addEventListener('wheel', handleOverlayWheel, {passive:false, capture:true}); wheelAttached=true; }
  function detachOverlayWheel(){ if(overlay&&wheelAttached) overlay.removeEventListener('wheel', handleOverlayWheel, {capture:true} as any); wheelAttached=false; }
  $effect(()=>{ if(open&&overlay) attachOverlayWheel(); else detachOverlayWheel(); });
  onDestroy(detachOverlayWheel);

  // Image sizing inside consistent shell
  const imgStyle = $derived.by(()=> {
    const maxCSSHeight='calc(var(--modal-h) - var(--chrome-h))';
    const maxCSSWidth='min(100%, var(--modal-w))';
    const pxW = naturalW ? Math.floor(naturalW/Math.max(1,dpr)) : null;
    const pxH = naturalH ? Math.floor(naturalH/Math.max(1,dpr)) : null;
    const rules=[`max-height:${maxCSSHeight}`,`max-width:${maxCSSWidth}`];
    if(pxW) rules.push(`width:min(100%,${pxW}px)`); if(pxH) rules.push(`height:min(${maxCSSHeight},${pxH}px)`);
    return rules.join('; ');
  });
</script>

{#if open}
  <div
    bind:this={overlay}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    class="fixed inset-0 z-[100] grid place-items-center bg-black/80 [touch-action:none]"
    tabindex="-1"
    onkeydown={onKey}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    <!-- Backdrop -->
    <button type="button" class="absolute inset-0 bg-transparent" onclick={close} aria-label="Close overlay"></button>

    <!-- CONSISTENT-SIZE SHELL -->
    <div
      class="lb-shell relative w-[min(96vw,1200px)] max-w-[1200px] h-[min(92svh,800px)] max-h-[800px] rounded-2xl border border-white/10 bg-[var(--surface-2,#0e0e0e)] shadow-2xl overflow-hidden"
      style="--modal-w: min(96vw, 1200px); --modal-h: min(92svh, 800px); --chrome-h: 116px;"
      role="group"
      aria-label="Lightbox content"
      onwheel={(e)=>handleOverlayWheel(e)}
    >
      <div class="absolute left-0 right-0 top-0 h-1.5"
           style="background: linear-gradient(90deg,
             color-mix(in oklab, var(--color-brand-500,#E2A028) 92%, #fff 8%),
             var(--color-brand-500,#E2A028));"></div>

      <button
        type="button"
        class="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500,#E2A028)] z-10"
        onclick={close}
        aria-label="Close"
      >✕</button>

      <!-- GRID: image | details -->
      <div class="lb-content-grid absolute inset-0 grid gap-0" style="grid-template-columns: 1.2fr 1fr;">
        <!-- IMAGE COLUMN -->
        <div class="relative flex items-center justify-center p-6 sm:p-8">
          {#if images.length}
            <img bind:this={imgEl} src={images[index]} alt={alt}
                 class="rounded-xl border border-white/10 object-contain shadow-lg select-none max-w-full max-h-full"
                 draggable="false" style={imgStyle} onload={handleImgLoad} decoding="async" />
          {/if}

          {#if images.length > 1}
            <button class="absolute inset-y-0 left-0 w-1/3" aria-label="Previous" onclick={prev}></button>
            <button class="absolute inset-y-0 right-0 w-1/3" aria-label="Next" onclick={next}></button>
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs px-2 py-1 rounded-lg bg-neutral-900/80 border border-white/10 text-white">
              {index + 1} / {images.length}
            </div>
          {/if}
        </div>

        <!-- DETAILS COLUMN (scrollable) -->
        <aside class="lb-details-scroll relative border-l border-white/10 bg-black/20 text-neutral-100">
          <div class="h-full overflow-auto px-5 py-6 sm:px-6 sm:py-7 space-y-4">
            <!-- Header (title / summary / tags / tools / link) -->
            {#if title || summary || slug}
              <header class="pb-3 border-b border-white/10">
                {#if title}
                  <h3 class="text-[1.05rem] sm:text-[1.15rem] font-extrabold tracking-tight text-white">
                    <span class="mr-2 inline-block h-3 w-1.5 translate-y-[2px] rounded-full"
                          style="background: var(--color-brand-500,#E2A028);"></span>
                    {title}
                  </h3>
                {/if}
                {#if summary}
                  <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{summary}</p>
                {/if}
                {#if tags.length || tools.length}
                  <div class="mt-2 flex flex-wrap gap-2">
                    {#each tags as t}
                      <span class="rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px]">{t}</span>
                    {/each}
                    {#each tools as t}
                      <span class="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[11px]">{t}</span>
                    {/each}
                  </div>
                {/if}
                {#if slug}
                  <a class="mt-2 inline-block text-[.9rem] font-semibold underline decoration-[var(--color-brand-500,#E2A028)] underline-offset-4 hover:opacity-90"
                     href={`/case-study/${slug}`}>View full case study →</a>
                {/if}
              </header>
            {/if}

            <!-- Highlights -->
            {#if highlights.length}
              <section class="mt-3">
                <h4 class="font-bold text-white/90">Highlights</h4>
                <ul class="mt-1 space-y-1 text-[.95rem] leading-relaxed text-neutral-200/95">
                  {#each highlights as h}
                    <li class="flex gap-2"><span aria-hidden="true">•</span><span>{h}</span></li>
                  {/each}
                </ul>
              </section>
            {/if}

            <!-- Rubric sections (render only if present) -->
            {#if details.tools}
              <section>
                <h4 class="font-bold text-white/90">Working Knowledge of Software & Digital Tools</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.tools}</p>
              </section>
            {/if}
            {#if details.design}
              <section>
                <h4 class="font-bold text-white/90">Elements & Principles of Design</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.design}</p>
              </section>
            {/if}
            {#if details.creativity}
              <section>
                <h4 class="font-bold text-white/90">Creative Self-Expression & Originality</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.creativity}</p>
              </section>
            {/if}
            {#if details.critique}
              <section>
                <h4 class="font-bold text-white/90">Thoughtful & Appropriate Critique Skills</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.critique}</p>
              </section>
            {/if}
            {#if details.directions}
              <section>
                <h4 class="font-bold text-white/90">Evidence of Following Directions</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.directions}</p>
              </section>
            {/if}
            {#if details.craftsmanship}
              <section>
                <h4 class="font-bold text-white/90">Craftsmanship & Attention to Detail</h4>
                <p class="mt-1 text-[.95rem] leading-relaxed text-neutral-200/95">{details.craftsmanship}</p>
              </section>
            {/if}
          </div>
        </aside>
      </div>
    </div>
  </div>
{/if}

<style>
  .lb-shell { box-shadow: 0 10px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset; }
  @media (max-width: 900px){
    .lb-content-grid{ grid-template-columns: 1fr !important; }
    .lb-details-scroll{ border-left: none; border-top: 1px solid rgba(255,255,255,.10); }
  }
</style>
