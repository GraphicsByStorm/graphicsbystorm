<!-- File: src/svelte/components/UserMenu.svelte -->
<script lang="ts">
  // Svelte 5 runes + SSR-safe
  type User = { id: string; name: string; email: string; avatar?: string };

  let {
    user = null as User | null,
    align = 'right' as 'left' | 'right',
    strategy = 'fixed' as 'fixed' | 'absolute', // fixed avoids clipping
  } = $props();

  // state
  let open = $state(false);
  let theme = $state<'dark' | 'light'>('dark');

  // DOM refs must be $state when mutated by bind:this
  let btn = $state<HTMLButtonElement | null>(null);
  let menu = $state<HTMLDivElement | null>(null);

  // placement
  type Coords = { left: number; top: number };
  let coords = $state<Coords>({ left: 0, top: 0 });

  // ---------- THEME ----------
  let themeInited = $state(false);

  // choose initial theme (client only)
  $effect(() => {
    if (themeInited) return;
    themeInited = true;
    try {
      const saved = typeof localStorage !== 'undefined' && localStorage.getItem('gbs::theme');
      theme =
        saved === 'dark' || saved === 'light'
          ? (saved as 'dark' | 'light')
          : (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    } catch {}
  });

  // apply theme on change (client only)
  $effect(() => {
    if (typeof document === 'undefined') return;
    const html = document.documentElement;
    html.dataset.theme = theme;
    html.classList.toggle('dark', theme === 'dark');
    html.style.colorScheme = theme;
    try { localStorage.setItem('gbs::theme', theme); } catch {}
  });

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
  }

  // ---------- PLACEMENT ----------
  function place() {
    if (!btn || strategy !== 'fixed' || typeof window === 'undefined') return;
    const r = btn.getBoundingClientRect();
    const menuWidth = menu?.offsetWidth ?? 240;
    const vw = window.innerWidth;
    const gutter = 8;

    let left = align === 'right' ? r.right - menuWidth : r.left;
    left = Math.max(gutter, Math.min(left, vw - menuWidth - gutter));
    const top = r.bottom + 8;

    coords = { left: Math.round(left), top: Math.round(top) };
  }

  // ---------- OPEN/CLOSE ----------
  function openMenu() { open = true; }
  function closeMenu(focusButton = true) {
    open = false;
    if (focusButton) btn?.focus();
  }
  function toggleMenu() { open ? closeMenu(false) : openMenu(); }

  // Hover intent (open on hover, close shortly after leaving)
  let hoverCloseTimer: number | null = null;
  function cancelHoverClose() {
    if (hoverCloseTimer !== null) {
      clearTimeout(hoverCloseTimer);
      hoverCloseTimer = null;
    }
  }
  function scheduleHoverClose() {
    cancelHoverClose();
    hoverCloseTimer = window.setTimeout(() => closeMenu(false), 180);
  }
  function onHoverEnter() {
    cancelHoverClose();
    openMenu();
  }

  // when menu opens: place + global listeners + focus first item
  $effect(() => {
    if (!open || typeof window === 'undefined') return;

    const onRelayout = () => place();
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (menu?.contains(t) || btn?.contains(t)) return;
      closeMenu(false);
    };

    // next tick for correct measurement
    queueMicrotask(place);

    window.addEventListener('pointerdown', onPointerDown, { capture: true });
    window.addEventListener('resize', onRelayout);
    window.addEventListener('scroll', onRelayout, true);
    (globalThis as any).visualViewport?.addEventListener?.('resize', onRelayout);

    // focus first item (for keyboard users)
    queueMicrotask(() => {
      const first = menu?.querySelector<HTMLElement>('[role="menuitem"]:not([aria-hidden="true"])');
      first?.focus();
    });

    // cleanup when `open` flips to false
    return () => {
      window.removeEventListener('pointerdown', onPointerDown, true);
      window.removeEventListener('resize', onRelayout);
      window.removeEventListener('scroll', onRelayout, true);
      (globalThis as any).visualViewport?.removeEventListener?.('resize', onRelayout);
    };
  });

  // keyboard nav inside menu
  function onMenuKey(e: KeyboardEvent) {
    if (!open) return;
    const items = Array.from(menu?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-hidden="true"])') ?? []);
    const idx = items.findIndex((el) => el === (document.activeElement as HTMLElement));
    const last = items.length - 1;

    if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); (items[(idx + 1) > last ? 0 : idx + 1] ?? items[0])?.focus(); }
    else if (e.key === 'ArrowUp')   { e.preventDefault(); (items[(idx - 1) < 0 ? last : idx - 1] ?? items[last])?.focus(); }
    else if (e.key === 'Home')      { e.preventDefault(); items[0]?.focus(); }
    else if (e.key === 'End')       { e.preventDefault(); items[last]?.focus(); }
  }

  // real logout calling API
  async function logout() {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    closeMenu(false);
    if (typeof window !== 'undefined') window.location.assign('/');
  }

  const initials = (name?: string) =>
    (name ?? '').split(/\s+/).map(s => s[0]?.toUpperCase()).slice(0,2).join('') || 'U';
</script>

<div class="relative">
  <!-- Trigger -->
  <button
    bind:this={btn}
    type="button"
    class="user-trigger"
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls="user-menu"
    onclick={toggleMenu}
    onmouseenter={onHoverEnter}
    onmouseleave={scheduleHoverClose}
    onkeydown={(e) => {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!open) openMenu();
        else menu?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
      }
    }}
    title={user ? user.name : 'Account'}
  >
    {#if user?.avatar}
      <img src={user.avatar} alt="" class="avatar-img" />
    {:else}
      <span class="avatar-fallback">{initials(user?.name || 'User')}</span>
    {/if}
    <svg viewBox="0 0 20 20" class="chev" aria-hidden="true"><path fill="currentColor" d="M5.5 7.5l4.5 4 4.5-4 1 1-5.5 5-5.5-5z"/></svg>
  </button>

  <!-- Dropdown -->
  {#if open}
    <div
      bind:this={menu}
      id="user-menu"
      role="menu"
      aria-label="User menu"
      class={"menu " + (strategy === 'fixed' ? 'menu-fixed' : (align === 'right' ? 'menu-right' : 'menu-left'))}
      tabindex="-1"
      onkeydown={onMenuKey}
      onmouseenter={cancelHoverClose}
      onmouseleave={scheduleHoverClose}
      style={strategy === 'fixed' ? `left:${coords.left}px;top:${coords.top}px;` : undefined}
    >
      {#if user}
        <div class="menu-section" role="none">
          <div class="menu-user" role="none">
            {#if user?.avatar}
              <img src={user.avatar} alt="" class="menu-avatar" />
            {:else}
              <span class="menu-avatar-fallback">{initials(user?.name || 'User')}</span>
            {/if}
            <div class="menu-user-meta">
              <div class="menu-user-name">{user.name}</div>
              <div class="menu-user-mail">{user.email}</div>
            </div>
          </div>
        </div>

        <a href="/account" role="menuitem" class="menu-item">Account</a>
        <a href="/orders" role="menuitem" class="menu-item">Order history</a>
        <button type="button" role="menuitem" class="menu-item" onclick={toggleTheme}>
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>
        <div class="menu-sep" role="none"></div>
        <button type="button" role="menuitem" class="menu-item danger" onclick={logout}>Log out</button>
      {:else}
        <a href="/login" role="menuitem" class="menu-item">Log in</a>
        <a href="/register" role="menuitem" class="menu-item">Register</a>
        <div class="menu-sep" role="none"></div>
        <button type="button" role="menuitem" class="menu-item" onclick={toggleTheme}>
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        </button>
      {/if}
    </div>
  {/if}
</div>

<style>
  .user-trigger {
    display: inline-flex; align-items: center; gap: .5rem;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,.12);
    background: rgba(255,255,255,.05);
    color: #fff; font-weight: 700; padding: .25rem .5rem .25rem .25rem;
    transition: background .12s ease, border-color .12s ease, transform .08s ease;
  }
  .user-trigger:hover { background: rgba(255,255,255,.08); border-color: rgba(255,255,255,.2); }
  .user-trigger:focus-visible { outline: 2px solid var(--color-brand-500,#E2A028); outline-offset: 2px; }
  .chev { width: 16px; height: 16px; opacity: .8; }

  .avatar-img, .menu-avatar { width: 28px; height: 28px; border-radius: 999px; object-fit: cover; }
  .avatar-fallback, .menu-avatar-fallback {
    width: 28px; height: 28px; border-radius: 999px; display: grid; place-items: center;
    font-size: .8rem; font-weight: 800; color: #0b0b0b;
    background: var(--color-brand-500,#E2A028);
  }

  .menu {
    min-width: 220px; max-width: 340px;
    border-radius: 14px; border: 1px solid rgba(255,255,255,.12);
    background: color-mix(in oklab, #000 88%, var(--color-brand-500,#E2A028) 12%);
    padding: .4rem;
    box-shadow: 0 14px 28px rgba(0,0,0,.4);
    z-index: 2147483647; /* above everything */
  }
  .menu-fixed { position: fixed; }
  .menu-right { position: absolute; top: calc(100% + 8px); right: 0; }
  .menu-left  { position: absolute; top: calc(100% + 8px); left: 0; }

  .menu-section { padding: .25rem .25rem .35rem; }
  .menu-user { display: flex; align-items: center; gap: .6rem; }
  .menu-user-meta { line-height: 1.1; }
  .menu-user-name { color: #fff; font-weight: 900; font-size: .95rem; }
  .menu-user-mail { color: rgba(230,230,230,.8); font-size: .78rem; }

  .menu-item {
    width: 100%; text-align: left;
    display: block; padding: .5rem .6rem;
    border-radius: 10px; color: #f3f4f6; font-weight: 700; font-size: .9rem;
    background: transparent; border: 0; cursor: pointer;
  }
  .menu-item:hover, .menu-item:focus { background: rgba(255,255,255,.09); outline: none; }
  .menu-sep { height: 1px; background: rgba(255,255,255,.12); margin: .35rem .25rem; }
  .danger { color: #ffdcdc; }
  .danger:hover, .danger:focus { background: rgba(255,0,0,.12); }
</style>
