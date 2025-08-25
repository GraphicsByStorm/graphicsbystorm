<script lang="ts">
  // Runes props: no `export let` (Svelte 5)
  let {
    endpoint = $bindable<string>("https://formspree.io/f/your-id"), // ← replace with your form endpoint
    leftRail = $bindable<string>("96px"), // clears the social rail
    heading = $bindable<string>("Start a project"),
    blurb = $bindable<string>(
      "Tell me a bit about your project and I’ll get back within 1–2 business days."
    ),
  } = $props();

  // UI state
  let sending = $state(false);
  let done = $state(false);
  let fail = $state<string | null>(null);

  // Prefill from query (?service=Branding)
  let service = $state<string>("");
  if (typeof window !== "undefined") {
    const q = new URLSearchParams(window.location.search);
    service = q.get("service") ?? "";
  }

  // Basic client validation
  function validEmail(v: string) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  // Progressive enhancement: AJAX submit if possible
  async function onsubmit(e: SubmitEvent) {
    fail = null;
    if (!endpoint) return; // allow default navigation if no endpoint
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement;
    const fd = new FormData(form);

    // simple honeypot check
    if ((fd.get("_company") as string)?.trim()) {
      // bot—pretend success to avoid signal
      done = true;
      return;
    }

    const name = (fd.get("name") as string)?.trim();
    const email = (fd.get("email") as string)?.trim();
    const message = (fd.get("message") as string)?.trim();

    if (!name || !validEmail(email || "") || !message) {
      fail = "Please fill name, a valid email, and your message.";
      return;
    }

    sending = true;
    try {
      const r = await fetch(endpoint, {
        method: "POST",
        body: fd,
        mode: "cors",
      });
      if (r.ok) {
        done = true;
        form.reset();
        service = "";
      } else {
        fail =
          "Something went wrong sending your message. Please try again or email directly.";
      }
    } catch {
      fail = "Network error. Please try again or email directly.";
    } finally {
      sending = false;
    }
  }
</script>

<section class="contact-bleed" style={`--left-rail:${leftRail};`}>
  <article
    class="group relative isolate w-[100vw] overflow-hidden border-y border-white/10 bg-black/30 transition-colors hover:bg-black/40 focus-within:bg-black/40"
  >
    <!-- “filmstrip” body -->
    <div class="row">
      <!-- brand tick -->
      <div class="tick" />

      <div class="content">
        <h2 class="title">{heading}</h2>
        <p class="lead">{blurb}</p>

        {#if !done}
          <form
            class="form"
            method="POST"
            action={endpoint}
            accept-charset="UTF-8"
            {onsubmit}
          >
            <!-- honeypot -->
            <input
              type="text"
              name="_company"
              tabindex="-1"
              autocomplete="off"
              class="hp"
            />

            <!-- timestamp (spam dampener) -->
            <input type="hidden" name="_ts" value={Date.now().toString()} />

            <div class="grid">
              <label class="field">
                <span class="k">Name</span>
                <input
                  class="input"
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Doe"
                />
              </label>

              <label class="field">
                <span class="k">Email</span>
                <input
                  class="input"
                  type="email"
                  name="email"
                  required
                  placeholder="jane@email.com"
                />
              </label>

              <label class="field">
                <span class="k">Service (optional)</span>
                <input
                  class="input"
                  type="text"
                  name="service"
                  placeholder="Branding, Social package, ..."
                  value={service}
                  oninput={(e) =>
                    (service = (e.currentTarget as HTMLInputElement).value)}
                />
              </label>

              <label class="field col-span-full">
                <span class="k">Message</span>
                <textarea
                  class="textarea"
                  name="message"
                  rows="5"
                  required
                  placeholder="What problem are we solving? Goals, audience, timeline, and budget range help."
                />
              </label>
            </div>

            {#if fail}
              <p class="err">{fail}</p>
            {/if}

            <div class="actions">
              <button class="btn" disabled={sending} type="submit">
                {sending ? "Sending…" : "Send message"}
              </button>
              <a class="alt" href="mailto:storm@graphicsbystorm.com">
                or email storm@graphicsbystorm.com →
              </a>
            </div>
          </form>
        {:else}
          <div class="success">
            <h3>Thanks! 🎉</h3>
            <p>
              I’ll reach back out shortly. If you need to add anything, reply to
              the confirmation email.
            </p>
          </div>
        {/if}
      </div>
    </div>
  </article>
</section>

<style>
  /* full-bleed wrapper like your filmstrips */
  .contact-bleed {
    position: relative;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    width: 100vw;
  }
  .row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding-left: calc(var(--left-rail, 96px) + 1rem);
    padding-right: 1rem;
    min-height: 320px;
    transition:
      min-height 0.28s ease,
      padding 0.28s ease;
  }
  .group:hover .row,
  .group:focus-within .row {
    min-height: 380px;
  }

  .tick {
    width: 6px;
    height: 12px;
    background: var(--color-brand-500, #e2a028);
  }

  .content {
    width: 100%;
    max-width: 960px;
  }
  .title {
    color: #fff;
    font-weight: 900;
    letter-spacing: 0.2px;
    font-size: clamp(1.05rem, 2.2vw, 1.25rem);
  }
  .lead {
    color: #cbd1d6;
    margin: 0.35rem 0 0.9rem;
    max-width: 70ch;
    line-height: 1.55;
  }

  .form {
    display: grid;
    gap: 0.9rem;
  }
  .grid {
    display: grid;
    gap: 0.75rem;
    grid-template-columns: 1fr 1fr;
  }
  .field {
    display: grid;
    gap: 0.35rem;
  }
  .field.col-span-full {
    grid-column: 1 / -1;
  }

  .k {
    color: #cfd3d7;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .input,
  .textarea {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.12);
    color: #fff;
    padding: 0.6rem 0.7rem;
    outline: none;
    width: 100%;
  }
  .input:focus,
  .textarea:focus {
    border-color: rgba(226, 160, 40, 0.5);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
  }
  .btn {
    background: var(--color-brand-500, #e2a028);
    color: #000;
    font-weight: 800;
    padding: 0.55rem 0.9rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .alt {
    color: #dfe3e7;
    text-decoration: underline;
  }
  .err {
    color: #ffb4b4;
    font-size: 0.9rem;
  }
  .success {
    color: #e6f3e6;
  }
  .hp {
    position: absolute;
    left: -9999px;
    top: -9999px;
  }

  @media (max-width: 720px) {
    .grid {
      grid-template-columns: 1fr;
    }
  }
</style>
