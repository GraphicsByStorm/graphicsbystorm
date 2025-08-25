<script lang="ts">
  // Svelte 5 runes – props
  let {
    action = "/api/contact.php",
    leftRail = "96px",
    heading = "Start a project",
    blurb = "Tell me a bit about your project and I’ll get back to you.",
  } = $props();

  // ui state
  let status = $state<"ok" | "err" | null>(null);
  let busy = $state(false);

  // read ?sent / ?error on mount
  $effect.root(() => {
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search);
      if (p.has("sent")) status = "ok";
      else if (p.has("error")) status = "err";
    }
  });

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault(); // <- replace modifier with explicit preventDefault
    const form = e.currentTarget as HTMLFormElement;

    try {
      busy = true;
      status = null;

      const fd = new FormData(form);
      fd.append("ajax", "1");

      const res = await fetch(action, { method: "POST", body: fd });
      if (!res.ok) throw new Error("Failed");

      status = "ok";
      form.reset();

      // reflect in URL without leaving page
      const u = new URL(window.location.href);
      u.searchParams.delete("error");
      u.searchParams.set("sent", "1");
      history.replaceState({}, "", u);
    } catch {
      status = "err";
      const u = new URL(window.location.href);
      u.searchParams.delete("sent");
      u.searchParams.set("error", "1");
      history.replaceState({}, "", u);
    } finally {
      busy = false;
    }
  }
</script>

<section
  class="relative isolate w-full border border-white/10 bg-black/30"
  style={`margin-left:${leftRail};`}
  aria-label="Contact form"
>
  <!-- Filmstrip-like header -->
  <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
    <span
      class="inline-block h-3 w-1.5"
      style="background: var(--color-brand-500,#E2A028);"
    ></span>
    <h2
      class="m-0 text-[clamp(1rem,1.8vw,1.2rem)] font-extrabold tracking-tight text-white"
    >
      {heading}
    </h2>
  </div>

  <div class="p-4 sm:p-6">
    {#if blurb}
      <p class="mb-3 text-sm text-neutral-300">{blurb}</p>
    {/if}

    <!-- Status banners -->
    {#if status === "ok"}
      <div
        class="mb-4 rounded border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-emerald-300"
        role="status"
        aria-live="polite"
      >
        Thanks! Your message was sent.
      </div>
    {:else if status === "err"}
      <div
        class="mb-4 rounded border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300"
        role="status"
        aria-live="polite"
      >
        Sorry—there was a problem sending your message. Please try again.
      </div>
    {/if}

    <!-- Intercept submit (Svelte 5: use onsubmit, no modifier) -->
    <form
      {action}
      method="POST"
      class="grid grid-cols-1 gap-4"
      onsubmit={handleSubmit}
      novalidate
    >
      <!-- Honeypot (keep in DOM, hide visually only) -->
      <div class="hp">
        <label for="website">Website (leave empty)</label>
        <input
          id="website"
          name="website"
          type="text"
          tabindex="-1"
          autocomplete="off"
        />
      </div>

      <label class="block">
        <span class="sr-only">Name</span>
        <input
          class="w-full bg-white/[.06] border border-white/10 text-white placeholder:text-neutral-400 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand-500,#E2A028)]"
          type="text"
          name="name"
          required
          placeholder="Your name"
        />
      </label>

      <label class="block">
        <span class="sr-only">Email</span>
        <input
          class="w-full bg-white/[.06] border border-white/10 text-white placeholder:text-neutral-400 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand-500,#E2A028)]"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
        />
      </label>

      <label class="block">
        <span class="sr-only">Subject</span>
        <input
          class="w-full bg-white/[.06] border border-white/10 text-white placeholder:text-neutral-400 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand-500,#E2A028)]"
          type="text"
          name="subject"
          placeholder="Subject (optional)"
        />
      </label>

      <label class="block">
        <span class="sr-only">Message</span>
        <textarea
          class="min-h-[140px] w-full bg-white/[.06] border border-white/10 text-white placeholder:text-neutral-400 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--color-brand-500,#E2A028)]"
          name="message"
          required
          placeholder="Tell me about your project…"
        ></textarea>
      </label>

      <label class="flex items-center gap-2 text-sm text-neutral-300">
        <input
          class="h-4 w-4 accent-[var(--color-brand-500,#E2A028)]"
          type="checkbox"
          name="consent"
        />
        I agree to be contacted about my inquiry.
      </label>

      <div class="pt-2">
        <button
          type="submit"
          class="inline-flex items-center bg-[var(--color-brand-500,#E2A028)] px-4 py-2 text-[13px] font-semibold text-black shadow hover:opacity-90 disabled:opacity-70"
          disabled={busy}
          aria-busy={busy}
        >
          {busy ? "Sending…" : "Send message"}
        </button>
      </div>
    </form>
  </div>
</section>

<style>
  .hp {
    position: absolute;
    left: -9999px;
    width: 1px;
    height: 1px;
    overflow: hidden;
  }
</style>
