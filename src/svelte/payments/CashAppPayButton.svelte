<script lang="ts">
  const { amountCents, currency = "USD", title = "Order" } =
    $props<{ amountCents: number; currency?: string; title?: string }>();

  let started = $state(false);

  async function init() {
    if (started) return; started = true;
    if (!document.querySelector("#sq-payments")) {
      const s = document.createElement("script");
      s.id = "sq-payments";
      s.src = "https://sandbox.web.squarecdn.com/v1/square.js";
      s.onload = setup;
      document.body.appendChild(s);
    } else setup();
  }

  async function setup() {
    // @ts-ignore - Square injects global
    const payments = window.Square.payments(
      import.meta.env.PUBLIC_SQUARE_APP_ID,
      import.meta.env.PUBLIC_SQUARE_LOCATION_ID
    );

    const request = payments.paymentRequest({
      countryCode: "US",
      currencyCode: currency,
      total: { amount: (amountCents / 100).toFixed(2), label: title }
    });

    const cap = await payments.cashAppPay(request, { redirectURL: window.location.href });
    cap.addEventListener("ontokenization", async (e: any) => {
      const { token } = e.detail;
      await fetch("/api/payments/square/create-payment", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, amountCents, currency, title })
      });
      alert("Payment complete");
    });
    await cap.attach("#cashapp-container");
  }
</script>

<div id="cashapp-container" class="min-h-10" onmouseenter={init}></div>
