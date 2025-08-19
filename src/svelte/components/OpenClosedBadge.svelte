<script lang="ts">
  import { onDestroy } from 'svelte';

  // Types
  type Slot = { start: string; end: string }; // "HH:MM"
  type Schedule = Record<number, Slot[]>;     // 0=Sun..6=Sat
  type Props = {
    timezone?: string;
    schedule?: Schedule;
    force?: 'open' | 'closed' | null;
    adminOverrideKey?: string;
  };

  // Props with defaults — annotate the destructuring (not $props)
  let {
    timezone = 'America/New_York',
    // Mon–Wed & Fri 17:00–20:00
    schedule = {
      1: [{ start: '17:00', end: '20:00' }],
      2: [{ start: '17:00', end: '20:00' }],
      3: [{ start: '17:00', end: '20:00' }],
      5: [{ start: '17:00', end: '20:00' }]
    } as Schedule,
    force = null as 'open' | 'closed' | null,
    adminOverrideKey = 'gbs::openOverride'
  }: Props = $props();

  // State
  let status = $state<'open' | 'closed'>('closed');
  let intervalId: number | null = null;

  // Helpers
  function nowParts(tz: string) {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    }).formatToParts(new Date());

    const map: Record<string, string> = {};
    for (const p of parts) map[p.type] = p.value;

    const w = map.weekday; // Sun, Mon, ...
    const day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(w);
    const hh = parseInt(map.hour ?? '0', 10);
    const mm = parseInt(map.minute ?? '0', 10);
    return { day, minutes: hh * 60 + mm };
  }

  function parseMinutes(s: string): number {
    const [h, m] = s.split(':').map(Number);
    return h * 60 + (m || 0);
  }

  function calcStatus() {
    // Admin/local override first
    try {
      const override = localStorage.getItem(adminOverrideKey);
      if (override === 'open' || override === 'closed') {
        status = override;
        return;
      }
    } catch {}

    // Prop override
    if (force) { status = force; return; }

    const { day, minutes } = nowParts(timezone);
    const slots: Slot[] = schedule[day] ?? []; // ✅ typed, so no implicit any
    status = slots.some((slot: Slot) =>
      minutes >= parseMinutes(slot.start) && minutes < parseMinutes(slot.end)
    ) ? 'open' : 'closed';
  }

  function startTicker() {
    stopTicker();
    intervalId = window.setInterval(calcStatus, 30_000);
  }
  function stopTicker() {
    if (intervalId) { clearInterval(intervalId); intervalId = null; }
  }

  if (typeof window !== 'undefined') {
    calcStatus();
    startTicker();
    window.addEventListener('storage', calcStatus);
  }

  onDestroy(() => {
    stopTicker();
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', calcStatus);
    }
  });
</script>

<span
  class="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[13px] font-semibold text-white"
  style={`background:${status === 'open'
    ? 'color-mix(in oklab, var(--color-brand-500,#E2A028) 20%, #000)'
    : 'rgba(255,255,255,.06)'};`}
  aria-live="polite"
>
  <span class="inline-block size-2 rounded-full"
        style={`background:${status === 'open'
          ? 'var(--color-brand-500,#E2A028)'
          : 'rgba(255,255,255,.35)'};`} ></span>
  {status === 'open' ? 'OPEN NOW' : 'CLOSED'}
  <span class="opacity-70">• Mon–Wed & Fri 5–8 PM ET</span>
</span>
