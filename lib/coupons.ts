// lib/coupons.ts
import { coupons, type Coupon } from "@/data/coupons";

export type CartItemInput = {
  id: string;      // product.id
  price: number;   // Einzelpreis
  quantity: number;
};

export type CouponResult = {
  subtotal: number;
  discountAmount: number;
  finalTotal: number;
  appliedCoupon: Coupon | null;
};

function isCouponValidByDate(coupon: Coupon): boolean {
  const now = new Date();

  if (coupon.validFrom) {
    const from = new Date(coupon.validFrom);
    if (now < from) return false;
  }

  if (coupon.validUntil) {
    const until = new Date(coupon.validUntil);
    if (now > until) return false;
  }

  return true;
}

/**
 * Wendet einen Coupon auf den Warenkorb an.
 * - Wenn kein oder ungültiger Code → kein Rabatt
 * - Wenn productIds gesetzt → Rabatt nur auf diese Produkte
 */
export function applyCouponToCart(
  items: CartItemInput[],
  code?: string | null
): CouponResult {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!code) {
    return { subtotal, discountAmount: 0, finalTotal: subtotal, appliedCoupon: null };
  }

  const normalized = code.trim().toUpperCase();
  const coupon = coupons.find(
    (c) =>
      c.code.toUpperCase() === normalized &&
      (c.active ?? true) &&
      isCouponValidByDate(c)
  );

  if (!coupon) {
    return { subtotal, discountAmount: 0, finalTotal: subtotal, appliedCoupon: null };
  }

  // Rabatt-Basis: entweder kompletter Warenkorb oder nur ausgewählte Produkte
  let eligibleTotal = subtotal;

  if (coupon.productIds && coupon.productIds.length > 0) {
    eligibleTotal = items
      .filter((item) => coupon.productIds!.includes(item.id))
      .reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  const discountAmount = +(eligibleTotal * (coupon.percentage / 100)).toFixed(2);
  const finalTotal = Math.max(0, +(subtotal - discountAmount).toFixed(2));

  return {
    subtotal,
    discountAmount,
    finalTotal,
    appliedCoupon: coupon,
  };
}
