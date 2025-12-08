export function isValidEmail(email?: string) {
  if (!email) return false;
  const e = String(email).trim().toLowerCase();

  // bewusst simpel aber solide:
  // - hat genau 1 @
  // - mindestens 1 Punkt im Domain-Teil
  // - keine Spaces
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return basic.test(e);
}
