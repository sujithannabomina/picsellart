// Deterministic, sane price bands from filename.
export function priceForName(name) {
  // sample101.jpg -> 101; create stable price buckets
  const digits = (name.match(/\d+/)?.[0] ?? "399");
  const n = parseInt(digits, 10) || 399;
  const bucket = n % 5;
  return [399, 499, 599, 749, 999][bucket];
}

export function priceToPaise(rupees) {
  // Razorpay expects paise
  return Math.round(Number(rupees) * 100);
}
