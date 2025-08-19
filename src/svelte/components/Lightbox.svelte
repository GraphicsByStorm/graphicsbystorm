<script lang="ts">
  import { onDestroy } from 'svelte';

  // Props (Svelte 5 runes)
  let {
    images = [] as string[],
    startIndex = 0,
    open = $bindable(false),
    alt = 'image',
    // Case study meta (optional)
    title = '',
    summary = '',
    slug = ''
  } = $props();

  // State
  let index = $state(startIndex);
  let overlay = $state<HTMLDivElement | null>(null);
  let imgEl = $state<HTMLImageElement | null>(null);
  let naturalW = $state(0);
  let naturalH = $state(0);
  let dpr = $state(1);

  $effect(() => { index = startIndex; });

  // Track device pixel ratio (avoid upscaling → blur)
  function updateDPR() { if (typeof window !== 'undefined') dpr = Math.max(1, window.devicePixelRatio || 1); }
  if (typeof window !== 'undefined') {
    updateDPR();
    window.addEventListener('resize', updateDPR);
    window.addEventListener('orientationchange', updateDPR);
  }
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateDPR);
      window.removeEventListener('orientationchange', updateDPR);
    }
  });

  function handleImgLoad(e: Event) {
    const el = e.currentTarget as HTMLImageElement;
    naturalW = el.naturalWidth || 0;
    naturalH = el.naturalHeight || 0;
  }

  // Page scroll lock
  let cleanupGlobal: (() => void) | null = null;
  function lockScroll() {
    const html = document.documentElement;
    const body = document.body;
    const y = window.scrollY || window.pageYOffset || 0;
    const sbw = window.innerWidth - html.clientWidth;

    html.classList.add('scroll-locked', 'no-overscroll');
    body.classList.add('scroll-locked', 'no-overscroll');

    body.style.position = 'fixed';
    body.style.top = `-${y}px`;
    body.style.left = '0';
    body.style.right = '0';
    body.style.width = '100%';
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;

    const stopTouch = (e: Event) => e.preventDefault();
    const stopKeys = (e: KeyboardEvent) => {
      const k = e.key;
      if (k === ' ' || k === 'PageDown' || k === 'PageUp' || k === 'Home' || k === 'End' || k === 'ArrowUp' || k === 'ArrowDown') e.preventDefault();
    };
    window.addEventListener('touchmove', stopTouch, { passive: false, capture: true });
    document.addEventListener('keydown', stopKeys, { capture: true });

    cleanupGlobal = () => {
      window.removeEventListener('touchmove', stopTouch as EventListener, { capture: true } as any);
      document.removeEventListener('keydown', stopKeys as EventListener, { capture: true } as any);
    };

    queueMicrotask(() => overlay?.focus());
  }
  function unlockScroll() {
    const html = document.documentElement;
    const body = document.body;
    const y = Math.abs(parseInt(body.style.top || '0', 10)) || 0;

    body.style.position = '';
    body.style.top = '';
    body.style.left = '';
    body.style.right = '';
    body.style.width = '';
    body.style.paddingRight = '';
    html.classList.remove('scroll-locked', 'no-overscroll');
    body.classList.remove('scroll-locked', 'no-overscroll');

    if (cleanupGlobal) cleanupGlobal(), (cleanupGlobal = null);
    window.scrollTo(0, y);
  }
  $effect(() => { if (open) lockScroll(); else unlockScroll(); });
  onDestroy(() => { if (cleanupGlobal) cleanupGlobal(); });

  // Navigation
  function close() { open = false; }
  function next() { if (images.length) index = (index + 1) % images.length; }
  function prev() { if (images.length) index = (index - 1 + images.length) % images.length; }
  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  }

  // Touch swipe
  let touchX = 0, touchY = 0;
  function onTouchStart(e: TouchEvent) { const t = e.changedTouches[0]; touchX = t.clientX; touchY = t.clientY; }
  function onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0];
    const dx = t.clientX - touchX, dy = t.clientY - touchY;
    if (Math.abs(dx) > Math.max(30, Math.abs(dy))) dx > 0 ? prev() : next();
  }

  // Wheel on overlay (capture-phase)
  let wheelCooldown = false;
  function handleOverlayWheel(e: WheelEvent) {
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    if (vertical) (e.deltaY > 0 ? next() : prev());
    else (e.deltaX > 0 ? next() : prev());
    setTimeout(() => (wheelCooldown = false), 170);
  }
  let wheelAttached = false;
  function attachOverlayWheel() {
    if (!overlay || wheelAttached) return;
    overlay.addEventListener('wheel', handleOverlayWheel, { passive: false, capture: true });
    wheelAttached = true;
  }
  function detachOverlayWheel() {
    if (overlay && wheelAttached) overlay.removeEventListener('wheel', handleOverlayWheel, { capture: true } as any);
    wheelAttached = false;
  }
  $effect(() => { if (open && overlay) attachOverlayWheel(); else detachOverlayWheel(); });
  onDestroy(detachOverlayWheel);

  // Image CSS cap: never exceed available area OR natural/dpr resolution
  const imgStyle = $derived.by(() => {
    const maxCSSHeight = 'var(--image-max)'; // derived from panel/footer
    const maxCSSWidth  = 'min(100%, calc(100vw - 4rem))';
    const pxW = naturalW ? Math.floor(naturalW / Math.max(1, dpr)) : null;
    const pxH = naturalH ? Math.floor(naturalH / Math.max(1, dpr)) : null;

    const rules: string[] = [
      `max-height: ${maxCSSHeight}`,
      `max-width: ${maxCSSWidth}`
    ];
    if (pxW) rules.push(`width: min(100%, ${pxW}px)`);
    if (pxH) rules.push(`height: min(${maxCSSHeight}, ${pxH}px)`);
    return rules.join('; ');
  });
</script>

{#if open}
  <div
    bind:this={overlay}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 [touch-action:none]"
    tabindex="-1"
    onkeydown={onKey}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    <!-- Backdrop (click to close) -->
    <button type="button" class="absolute inset-0 bg-transparent" onclick={close} aria-label="Close overlay" ></button>

    <!-- Panel (never exceeds viewport) -->
    <div
      class="lb-panel relative mx-4 w-full max-w-6xl overflow-hidden rounded-2xl border border-white/10 bg-[var(--surface-2,#0e0e0e)] shadow-2xl outline-none"
      role="group"
      aria-label="Lightbox content"
      style="--panel-max: 96svh; --chrome-h: clamp(88px, 12svh, 112px); --footer-h: clamp(140px, 22svh, 200px); --image-max: calc(var(--panel-max) - var(--footer-h) - var(--chrome-h)); max-height: var(--panel-max);"
    >
      <!-- brand accent -->
      <div class="absolute left-0 right-0 top-0 h-1.5 rounded-t-2xl"
           style="background: linear-gradient(90deg,
             color-mix(in oklab, var(--color-brand-500,#E2A028) 92%, #fff 8%),
             var(--color-brand-500,#E2A028));"></div>

      <!-- Close -->
      <button
        type="button"
        class="absolute right-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-white/10 text-white/90 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500,#E2A028)]"
        onclick={close}
        aria-label="Close"
      >✕</button>

      <!-- Grid: image → pager → footer (footer always visible) -->
      <div class="grid gap-4 p-6 sm:p-8" style="grid-template-rows: 1fr auto auto; max-height: var(--panel-max);">
        <!-- Image area -->
        {#if images.length}
          <div class="flex items-center justify-center">
            <img
              bind:this={imgEl}
              src={images[index]}
              alt={alt}
              class="rounded-xl border border-white/10 object-contain shadow-lg select-none"
              draggable="false"
              style={imgStyle}
              onload={handleImgLoad}
              decoding="async"
            />
          </div>
        {/if}

        <!-- Pager -->
        {#if images.length > 1}
          <div class="flex items-center justify-between text-white/80">
            <button
              type="button"
              class="rounded-md border border-white/10 bg-white/[.06] px-3 py-2 font-semibold transition hover:bg-white/[.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500,#E2A028)]"
              onclick={prev}
              aria-label="Previous"
            >← Prev</button>

            <span class="rounded-md px-2 py-1 text-sm"
                  style="background: color-mix(in oklab, var(--color-brand-500,#E2A028) 18%, transparent); color: color-mix(in oklab, var(--color-brand-500,#E2A028) 85%, #ffffff 15%);">
              {index + 1} / {images.length}
            </span>

            <button
              type="button"
              class="rounded-md border border-white/10 bg-white/[.06] px-3 py-2 font-semibold transition hover:bg-white/[.12] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500,#E2A028)]"
              onclick={next}
              aria-label="Next"
            >Next →</button>
          </div>
        {/if}

        <!-- Footer (no scrolling; clamped lines keep height consistent) -->
        {#if title || summary || slug}
          <div class="mt-2 text-neutral-200">
            {#if title}
              <h3 class="mb-1 text-xl font-extrabold tracking-tight text-white line-clamp-2">
                <span class="mr-2 inline-block h-3 w-1.5 translate-y-[2px] rounded-full"
                      style="background: var(--color-brand-500,#E2A028);"></span>
                {title}
              </h3>
            {/if}

            {#if summary}
              <p class="text-[15px] leading-relaxed text-neutral-200/95 line-clamp-3">
                {summary}
              </p>
            {/if}

            {#if slug}
              <a
                class="mt-2 inline-block font-semibold underline decoration-[var(--color-brand-500,#E2A028)] underline-offset-4 transition hover:opacity-90"
                href={`/case-study/${slug}`}
              >
                Read full case study →
              </a>
            {/if}
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}

<style>
  /* Global helpers */
  :global(html.scroll-locked), :global(body.scroll-locked) { overflow: hidden !important; height: 100% !important; }
  :global(html.no-overscroll), :global(body.no-overscroll) { overscroll-behavior: none !important; }
  @supports (-webkit-touch-callout: none) { :global(body.scroll-locked) { position: fixed !important; width: 100% !important; } }

  .lb-panel { box-shadow: 0 10px 40px rgba(0,0,0,.45), 0 0 0 1px rgba(255,255,255,.04) inset; }

  /* Multi-line clamp utilities (standard + WebKit) */
  .line-clamp-2{
    /* Standard (draft) */
    line-clamp: 2;
    /* WebKit fallback */
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .line-clamp-3{
    line-clamp: 3;
    -webkit-line-clamp: 3;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
