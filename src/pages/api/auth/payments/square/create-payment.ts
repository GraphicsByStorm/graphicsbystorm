import type { APIRoute } from "astro";
import { SquareClient, SquareEnvironment } from "square";

export const POST: APIRoute = async ({ request }) => {
  const { token, amountCents, currency = "USD", title = "Order" } = await request.json();

  const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN!,
    environment: SquareEnvironment.Sandbox, // change to Production for live
  });

  const res = await client.payments.create({
    sourceId: token,
    amountMoney: { amount: BigInt(amountCents), currency },
    locationId: process.env.SQUARE_LOCATION_ID!,
    idempotencyKey: crypto.randomUUID(),
    note: title,
  });

  return new Response(JSON.stringify(res), {
    headers: { "content-type": "application/json" }
  });
};