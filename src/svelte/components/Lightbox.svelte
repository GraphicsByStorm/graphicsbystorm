<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  // Svelte 5 runes props
  const {
    images = [] as string[],
    startIndex = 0,
    open = false,
    alt = '' // generic alt for when we don't have per-image alt
  } = $props();

  const dispatch = createEventDispatcher<{ close: void }>();

  let isOpen = open;
  let index = Math.min(Math.max(startIndex, 0), images.length - 1);
  let overlayEl: HTMLDivElement | null = null;

  // lock/unlock page scroll
  function lockScroll(lock: boolean) {
    const html = document.documentElement;
    if (lock) html.classList.add('no-scroll');
    else html.classList.remove('no-scroll');
  }

  function close() {
    isOpen = false;
    lockScroll(false);
    dispatch('close');
  }

  function next() {
    if (!images.length) return;
    index = (index + 1) % images.length;
  }
  function prev() {
    if (!images.length) return;
    index = (index - 1 + images.length) % images.length;
  }

  // keyboard
  function onKey(e: KeyboardEvent) {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
  }

  // wheel/touch — prevent page scroll while the modal is open
  const prevent = (e: Event) => { if (isOpen) e.preventDefault(); };
  let touchStartX = 0;
  let touchStartY = 0;

  function onTouchStart(e: TouchEvent) {
    if (!isOpen) return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
  }
  function onTouchEnd(e: TouchEvent) {
    if (!isOpen) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;
    // horizontal swipe threshold, ignore vertical drags
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? next() : prev();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', onKey, { capture: true });
    window.addEventListener('wheel', prevent, { passive: false });
    window.addEventListener('touchmove', prevent, { passive: false });
    return () => {
      window.removeEventListener('keydown', onKey, { capture: true } as any);
      window.removeEventListener('wheel', prevent as any);
      window.removeEventListener('touchmove', prevent as any);
    };
  });

  $effect(() => {
    lockScroll(isOpen);
  });
</script>

{#if isOpen}
  <div
    bind:this={overlayEl}
    class="lightbox-overlay"
    role="dialog"
    aria-modal="true"
    on:click={(e) => { if (e.target === overlayEl) close(); }}
    on:wheel|preventDefault
    on:touchmove|preventDefault
    on:touchstart={onTouchStart}
    on:touchend={onTouchEnd}
  >
    <button
      class="lightbox-close"
      aria-label="Close"
      on:click|stopPropagation={close}
    >
      &times;
    </button>

    <button class="lightbox-nav lightbox-prev" aria-label="Previous" on:click|stopPropagation={prev}>&lsaquo;</button>
    <figure class="lightbox-frame">
      <img class="lightbox-img" src={images[index]} alt={alt} />
    </figure>
    <button class="lightbox-nav lightbox-next" aria-label="Next" on:click|stopPropagation={next}>&rsaquo;</button>
  </div>
{/if}

<style>
  /* page scroll lock */
  html.no-scroll, body.no-scroll { overflow: hidden !important; }

  .lightbox-overlay {
    position: fixed; inset: 0;
    display: grid; grid-template-columns: 1fr auto 1fr;
    align-items: center; justify-items: center;
    background: rgba(0,0,0,.85);
    z-index: 90;
    /* prevent page-ish scrolling/bounce inside */
    overscroll-behavior: contain;
    touch-action: none;
  }

  .lightbox-frame {
    grid-column: 2;
    width: min(92vw, 1200px);
    max-height: 88vh;
    margin: 0;
    display: grid;
    place-items: center;
  }

  .lightbox-img {
    max-width: 100%;
    max-height: 88vh;
    object-fit: contain;
    display: block;
  }

  /* clean white X, no bg by default */
  .lightbox-close {
    position: absolute;
    top: .75rem; right: .75rem;
    font-size: 1.75rem; line-height: 1;
    color: #fff;
    background: transparent;
    border: 0;
    padding: .25rem .5rem;
    cursor: pointer;
    z-index: 91;
    border-radius: .5rem;
    transition: background-color .2s ease, transform .08s ease;
  }
  .lightbox-close:hover { background: rgba(255,255,255,.06); }
  .lightbox-close:active { transform: scale(.96); }

  .lightbox-nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    font-size: 2rem; line-height: 1;
    color: #fff; background: rgba(0,0,0,.2);
    border: 0; width: 44px; height: 44px; border-radius: 9999px;
    display: grid; place-items: center; cursor: pointer;
    transition: background-color .15s ease, transform .08s ease;
    user-select: none;
  }
  .lightbox-nav:hover { background: rgba(255,255,255,.08); }
  .lightbox-prev { left: .75rem; }
  .lightbox-next { right: .75rem; }
</style>
