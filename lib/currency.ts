export function formatCurrency(
  amount: number,
  currency: string = "ZAR"
): string {
  const formatter = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  });
  return formatter.format(amount);
}
