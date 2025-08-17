<script lang="ts">
  const { amount = "10.00", currency = "USD", title = "Order" } =
    $props<{ amount?: string; currency?: string; title?: string }>();

  let loaded = $state(false);

  async function ensureSdk() {
    if (loaded) return;
    if (!document.querySelector("#paypal-js")) {
      const s = document.createElement("script");
      s.id = "paypal-js";
      s.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.PUBLIC_PAYPAL_CLIENT_ID}`;
      s.onload = renderButtons;
      document.body.appendChild(s);
    } else renderButtons();
    loaded = true;
  }

  async function renderButtons() {
    // @ts-ignore - PayPal injects global
    window.paypal.Buttons({
      createOrder: async () => {
        const r = await fetch("/api/payments/paypal/create", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ amount, currency, title })
        });
        const { id } = await r.json();
        return id;
      },
      onApprove: async (data: any) => {
        await fetch("/api/payments/paypal/capture", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ orderId: data.orderID })
        });
        alert("Payment complete");
      }
    }).render("#paypal-container");
  }
</script>

<div id="paypal-container" class="min-h-12" onmouseenter={ensureSdk}></div>
