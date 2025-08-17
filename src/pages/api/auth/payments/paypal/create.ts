import type { APIRoute } from "astro";
import { getPayPalAccessToken, ppBase } from "./_client";
import { prisma } from "$lib/auth/lucia";

export const POST: APIRoute = async ({ request, locals }) => {
  const { amount, currency = "USD", title = "Order" } = await request.json();
  const token = await getPayPalAccessToken();

  const res = await fetch(ppBase("/v2/checkout/orders"), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [{ amount: { currency_code: currency, value: amount }, description: title }]
    })
  });

  const data = await res.json();
  if (!res.ok) return new Response(JSON.stringify(data), { status: 400 });

  const session = await locals.auth.validate();
  await prisma.order.create({
    data: {
      userId: session?.user.userId ?? null,
      amountCents: Math.round(Number(amount) * 100),
      currency,
      processor: "paypal",
      processorId: data.id,
      status: "created"
    }
  });

  return new Response(JSON.stringify({ id: data.id }), { headers: { "content-type": "application/json" } });
};
