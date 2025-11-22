// lib/paypal.ts
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE!;
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.warn("⚠️ PayPal Env Variablen fehlen");
}

export async function getPayPalAccessToken() {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

  const res = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    console.error("PayPal Token Fehler:", await res.text());
    throw new Error("Fehler beim Abrufen des PayPal Tokens");
  }

  const data = await res.json();
  return data.access_token as string;
}
