export function formatPrice(value: number) {
  const amount = new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

  return `${amount} đ`;
}
