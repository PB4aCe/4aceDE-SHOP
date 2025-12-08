const BASE = process.env.STRATO_DB_API_URL!;
const SECRET = process.env.STRATO_DB_API_SECRET!;

async function post(path: string, body: any) {
  const res = await fetch(`${BASE}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SECRET}`,
    },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const text = await res.text();
  let json: any = {};
  try { json = text ? JSON.parse(text) : {}; } catch {}
  if (!res.ok) throw new Error(json?.error ?? `HTTP ${res.status}`);
  return json;
}

export const stratoDb = {
  createReview: (payload: {
    productId: string;
    rating: number;
    title?: string;
    text?: string;
    authorName?: string;
    authorEmail?: string;
  }) => post("review-create.php", payload),

  listReviews: (productId: string) =>
    post("review-list.php", { productId }),
};
