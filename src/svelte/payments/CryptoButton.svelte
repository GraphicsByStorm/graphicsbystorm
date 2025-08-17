<script lang="ts">
  const { title, amountStr, currency = "USD" } =
    $props<{ title: string; amountStr: string; currency?: string }>();

  async function pay() {
    const r = await fetch("/api/payments/coinbase/create-checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: title, amount: amountStr, currency })
    });
    const { hosted_url } = await r.json();
    window.location.href = hosted_url;
  }
</script>

<button class="px-3 py-2 rounded border border-white/20" onclick={pay}>
  Pay with Crypto
</button>
