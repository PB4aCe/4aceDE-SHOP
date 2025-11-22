// data/coupons.ts

export type Coupon = {
  code: string;              // z.B. "HERZ10"
  description?: string;      // Beschreibung im Admin o. Mail
  percentage: number;        // 10 = 10% Rabatt
  productIds?: string[];     // optional: nur auf bestimmte Produkte
  maxUses?: number;          // optional: wie oft einlösbar (später über DB zählbar)
  validFrom?: string;        // optional ISO-Date, z.B. "2025-01-01"
  validUntil?: string;       // optional ISO-Date
  active?: boolean;          // kann man temporär deaktivieren
};

// 👉 Hier kannst du deine Codes pflegen
export const coupons: Coupon[] = [
  {
    code: "TEST10",
    description: "10 % Test-Rabatt auf alle Produkte",
    percentage: 10,
    active: true,
  },
  {
    code: "OHNELIEBE15",
    description: "15 % auf OHNE LIEBE",
    percentage: 15,
    productIds: ["ohne-liebe-001"], // nur dieses Produkt
    active: true,
  },
];
