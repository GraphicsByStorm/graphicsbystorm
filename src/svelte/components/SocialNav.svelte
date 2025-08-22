<script lang="ts">
  import Icon from '@iconify/svelte';
  import { SOCIAL_LINKS } from '$lib/social';
  import { iconNameById } from '$lib/social-icons';
</script>

<!-- Desktop: left vertical rail -->
<nav
  aria-label="Social links"
  class="hidden text-neutral-100 lg:flex fixed left-3 top-1/2 -translate-y-1/2 z-40 flex-col gap-3"
>
  {#each SOCIAL_LINKS as s (s.id)}
    <a
      href={s.href}
      target={s.href.startsWith('http') ? '_blank' : undefined}
      rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
      aria-label={s.aria ?? s.label}
      class="group relative grid place-items-center h-11 w-11 rounded-2xl text-neutral-100 bg-neutral-900/70 backdrop-blur border border-white/10 shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5"
    >
      <Icon icon={iconNameById[s.id] ?? 'simple-icons:linktree'} width="22" height="22" class="text-brand-500 opacity-90 group-hover:opacity-100" />
      <span class="pointer-events-none absolute left-12 whitespace-nowrap px-2 py-1 rounded-lg text-xs bg-neutral-900/90 border border-white/10 opacity-0 group-hover:opacity-100 translate-x-1 group-hover:translate-x-0 transition-all">
        {s.label}
      </span>
    </a>
  {/each}
  <div class="mx-auto h-10 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
</nav>

<!-- Mobile: sticky bottom bar -->
<nav
  aria-label="Social links"
  class="lg:hidden fixed inset-x-0 bottom-0 z-40"
  style="padding-bottom: max(env(safe-area-inset-bottom), 0px);"
>
  <div class="mx-auto max-w-screen-xl px-3 pb-2">
    <div class="rounded-2xl bg-neutral-900/80 backdrop-blur border border-white/10 shadow-2xl">
      <ul class="flex items-center justify-around text-white">
        {#each SOCIAL_LINKS as s (s.id)}
          <li>
            <a
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              aria-label={s.label}
              class="flex flex-col items-center gap-1 p-3 active:scale-95 transition"
            >
              <Icon icon={iconNameById[s.id] ?? 'simple-icons:linktree'} width="22" height="22" />
              <span class="text-[10px] leading-none opacity-80">{s.id}</span>
            </a>
          </li>
        {/each}
      </ul>
    </div>
  </div>
</nav>