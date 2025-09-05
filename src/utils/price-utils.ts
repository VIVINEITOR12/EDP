// Utility functions for handling prices (number or object with usd/bs)

export type PriceValue = number | { usd: number; bs: number };

export const getPriceAsNumber = (price: PriceValue): number => {
  if (typeof price === 'number') {
    return price;
  }
  return price.usd;
};

export const formatPrice = (price: PriceValue): string => {
  const numericPrice = getPriceAsNumber(price);
  return `$${numericPrice.toFixed(2)}`;
};

export const formatPriceWithBs = (price: PriceValue, rate: number): string => {
  const usdPrice = getPriceAsNumber(price);
  const bsPrice = usdPrice * rate;
  return `$${usdPrice.toFixed(2)} (Bs. ${bsPrice.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`;
};