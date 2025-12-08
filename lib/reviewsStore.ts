import fs from "fs/promises";
import path from "path";

export type Review = {
  id: string;
  productId: string;
  rating: number; // 1-5
  title?: string;
  text?: string;
  name?: string;
  email?: string; // für "nur 1x"
  createdAt: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "reviews.json");

async function ensureFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(FILE_PATH);
  } catch {
    await fs.writeFile(FILE_PATH, JSON.stringify({ reviews: [] }, null, 2), "utf8");
  }
}

export async function readReviews(): Promise<Review[]> {
  await ensureFile();
  const raw = await fs.readFile(FILE_PATH, "utf8");
  const json = JSON.parse(raw || "{}");
  return Array.isArray(json.reviews) ? json.reviews : [];
}

export async function writeReviews(reviews: Review[]) {
  await ensureFile();
  await fs.writeFile(FILE_PATH, JSON.stringify({ reviews }, null, 2), "utf8");
}

export function makeId() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
