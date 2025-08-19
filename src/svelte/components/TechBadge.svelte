<script lang="ts">
  import Icon from '@iconify/svelte';
  import type { IconEntry } from '$lib/icons/tech';
  import { iconFor } from '$lib/icons/tech';

  let {
    name,
    small = false,
    tint = true
  }: { name: string; small?: boolean; tint?: boolean } = $props();

  // ✅ correct: returns IconEntry | undefined
  const entry: IconEntry | undefined = $derived(iconFor(name));
  const size = $derived(small ? 14 : 16);

  const pillClass =
    'inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] text-neutral-100';

  // Always a string to keep TS happy
  const bgStyle = $derived.by<string>(() => {
    if (!tint) return '';
    return [
      'background: color-mix(in oklab, var(--color-brand-500,#E2A028) 14%, transparent)',
      'box-shadow: 0 0 0 1px rgba(255,255,255,.08) inset'
    ].join('; ');
  });
</script>

<span class={pillClass} style={bgStyle} aria-label={name}>
  {#if entry}
    <Icon icon={entry.icon} width={size} height={size} inline aria-hidden="true" class="shrink-0 text-white/90" />
  {/if}
  <span class="leading-none">{name}</span>
</span>
