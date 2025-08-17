const base = (path: string) =>
  `https://api-m.${process.env.PAYPAL_ENV === "live" ? "" : "sandbox."}paypal.com${path}`;

export async function getPayPalAccessToken() {
  const res = await fetch(base("/v1/oauth2/token"), {
    method: "POST",
    headers: {
      Authorization:
        "Basic " + Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ grant_type: "client_credentials" })
  });
  if (!res.ok) throw new Error("PayPal auth failed");
  const data = await res.json();
  return data.access_token as string;
}
export const ppBase = base;
