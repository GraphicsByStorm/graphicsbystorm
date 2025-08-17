import type { APIRoute } from "astro";

const BASE = "https://api.commerce.coinbase.com";

export const POST: APIRoute = async ({ request, locals }) => {
  const { name, amount, currency = "USD" } = await request.json();

  const res = await fetch(`${BASE}/checkouts`, {
    method: "POST",
    headers: {
      "X-CC-Api-Key": process.env.COINBASE_COMMERCE_API_KEY!,
      "X-CC-Version": "2018-03-22",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      pricing_type: "fixed_price",
      local_price: { amount, currency }
    })
  });

  const data = await res.json();
  if (!res.ok) return new Response(JSON.stringify(data), { status: 400 });

  // You can persist a pre-order here if you want, using data.data.id
  const hosted_url = data.data?.hosted_url ?? data.hosted_url;
  return new Response(JSON.stringify({ hosted_url }), { headers: { "content-type": "application/json" } });
};
