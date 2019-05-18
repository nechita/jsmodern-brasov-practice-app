export const availableCurrencies = [
  { name: 'Euro', symbol: 'EUR' },
  { name: 'US Dollar', symbol: 'USD' },
  { name: 'Romanian Leu', symbol: 'RON' },
  { name: 'British Pound', symbol: 'GBP' }
];
export let state = {
  fromCurrency: 'EUR',
  toCurrency: 'GBP'
};

export function setFromCurrencies(exclude) {
  return availableCurrencies.filter((currency) => currency.name !== exclude);
}

export function setToCurrencies(exclude) {
  return availableCurrencies.filter((currency) => currency.name !== exclude);
}
