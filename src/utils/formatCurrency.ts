export const formatCurrency = (
  amount?: number | null,
  currency?: string | null
) => {
  if (!amount || !currency) return null;

  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(amount / 100);
};
