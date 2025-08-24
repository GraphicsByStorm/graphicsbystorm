<script lang="ts">
  import { onDestroy } from 'svelte';

  let {
    images = [] as string[],
    open = $bindable(false),
    alt = 'image',
    title = ''
  } = $props();

  let index = $state(0);
  let overlay = $state<HTMLDivElement | null>(null);
  let imgEl = $state<HTMLImageElement | null>(null);
  let naturalW = $state(0);
  let naturalH = $state(0);
  let dpr = $state(1);
  let imgStyleStr = $state('');

  function updateDPR() { if (typeof window !== 'undefined') dpr = Math.max(1, window.devicePixelRatio || 1); }
  if (typeof window !== 'undefined') {
    updateDPR();
    window.addEventListener('resize', updateDPR, { passive: true });
    window.addEventListener('orientationchange', updateDPR);
  }
  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', updateDPR as EventListener);
      window.removeEventListener('orientationchange', updateDPR as EventListener);
    }
  });

  function handleImgLoad(e: Event) {
    const el = e.currentTarget as HTMLImageElement;
    naturalW = el.naturalWidth || 0;
    naturalH = el.naturalHeight || 0;
  }

  $effect(() => {
    const maxCSSHeight = 'min(92svh, 92vh)';
    const pxW = naturalW ? Math.floor(naturalW / Math.max(1, dpr)) : null;
    const pxH = naturalH ? Math.floor(naturalH / Math.max(1, dpr)) : null;
    const rules: string[] = [
      `max-height: ${maxCSSHeight}`,
      `max-width: min(96vw, 1600px)`,
      `object-fit: contain`
    ];
    if (pxW) rules.push(`width: min(96vw, ${pxW}px)`);
    if (pxH) rules.push(`height: min(${maxCSSHeight}, ${pxH}px)`);
    imgStyleStr = rules.join('; ');
  });

  let scrollYBefore = 0;
  function lockScroll() {
    const html = document.documentElement;
    const body = document.body;
    scrollYBefore = window.scrollY || 0;
    const sbw = window.innerWidth - html.clientWidth;
    if (sbw > 0) body.style.paddingRight = `${sbw}px`;
    body.style.position = 'fixed';
    body.style.top = `-${scrollYBefore}px`;
    body.style.left = '0'; body.style.right = '0'; body.style.width = '100%';
    html.classList.add('scroll-locked'); body.classList.add('scroll-locked');
  }
  function unlockScroll() {
    const html = document.documentElement;
    const body = document.body;
    body.style.position = ''; body.style.top = ''; body.style.left = '';
    body.style.right = ''; body.style.width = ''; body.style.paddingRight = '';
    html.classList.remove('scroll-locked'); body.classList.remove('scroll-locked');
    window.scrollTo(0, scrollYBefore || 0);
  }
  $effect(() => { if (typeof window !== 'undefined') { if (open) lockScroll(); else unlockScroll(); } });
  onDestroy(unlockScroll);

  function close() { open = false; }
  function next() { if (images.length) index = (index + 1) % images.length; }
  function prev() { if (images.length) index = (index - 1 + images.length) % images.length; }

  function onKey(e: KeyboardEvent) {
    if (!open) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  }

  let tx = 0, ty = 0;
  function onTouchStart(e: TouchEvent) { const t = e.changedTouches[0]; tx = t.clientX; ty = t.clientY; }
  function onTouchEnd(e: TouchEvent) {
    const t = e.changedTouches[0]; const dx = t.clientX - tx; const dy = t.clientY - ty;
    if (Math.abs(dx) > Math.max(30, Math.abs(dy))) dx > 0 ? prev() : next();
  }

  let wheelCooldown = $state(false);
  function onOverlayWheel(e: WheelEvent) {
    e.preventDefault();
    if (wheelCooldown) return;
    wheelCooldown = true;
    const vertical = Math.abs(e.deltaY) >= Math.abs(e.deltaX);
    (vertical ? (e.deltaY > 0 ? next() : prev()) : (e.deltaX > 0 ? next() : prev()));
    setTimeout(() => { wheelCooldown = false; }, 160);
  }
</script>

{#if open}
  <div
    bind:this={overlay}
    role="dialog"
    aria-modal="true"
    aria-label="Image viewer"
    class="fixed inset-0 z-[1000] bg-black/90"
    tabindex="-1"
    onkeydown={onKey}
    onwheel={onOverlayWheel}
    ontouchstart={onTouchStart}
    ontouchend={onTouchEnd}
  >
    <!-- Close (square) -->
    <button
      type="button"
      class="absolute right-4 top-4 z-[2000] inline-flex size-10 items-center justify-center border border-white/20 bg-white/10 text-white/95 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-500)]"
      onclick={close}
      aria-label="Close"
    >✕</button>

    <!-- Nav click zones -->
    {#if images.length > 1}
      <button class="absolute inset-y-0 left-0 w-[22%] z-[1020] bg-transparent" onclick={prev} aria-label="Previous image" type="button"></button>
      <button class="absolute inset-y-0 right-0 w-[22%] z-[1020] bg-transparent" onclick={next} aria-label="Next image" type="button"></button>
    {/if}

    <!-- Center image -->
    <div class="absolute inset-0 grid place-items-center px-4">
      {#if images.length}
        <img
          bind:this={imgEl}
          src={images[index]}
          alt={alt}
          class="select-none border border-white/10 shadow-2xl"
          draggable="false"
          style={imgStyleStr}
          onload={handleImgLoad}
          decoding="async"
        />
      {/if}
    </div>

    <!-- Meta (bottom-left) -->
    {#if title}
      <div class="absolute left-4 bottom-4 z-[1040] max-w-[70vw]">
        <div class="mb-1 text-white text-[15px] sm:text-[16px] font-semibold tracking-tight">
          <span class="mr-2 inline-block h-3 w-1.5 translate-y-[2px]" style="background: var(--color-brand-500);"></span>
          {title}
        </div>
      </div>
    {/if}
  </div>
{/if}

<style>
  :global(html.scroll-locked), :global(body.scroll-locked) { overflow: hidden !important; height: 100% !important; }
  @supports (-webkit-touch-callout: none) { :global(body.scroll-locked) { position: fixed !important; width: 100% !important; } }
</style>
