import type { APIRoute } from "astro";
import { getPayPalAccessToken, ppBase } from "./_client";
import { prisma } from "$lib/auth/lucia";

export const POST: APIRoute = async ({ request }) => {
  const { orderId } = await request.json();
  const token = await getPayPalAccessToken();

  const res = await fetch(ppBase(`/v2/checkout/orders/${orderId}/capture`), {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
  });

  const data = await res.json();
  if (!res.ok) return new Response(JSON.stringify(data), { status: 400 });

  await prisma.order.updateMany({
    where: { processor: "paypal", processorId: orderId },
    data: { status: "paid" }
  });

  return new Response(JSON.stringify(data), { headers: { "content-type": "application/json" } });
};
