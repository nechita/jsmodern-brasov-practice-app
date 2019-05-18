import { availableCurrencies } from './state';
import { rates } from './index';

function applySymbols(url, exclude) {
  let symbols = [];
  availableCurrencies.forEach((currency) => {
    if (currency.symbol !== exclude) {
      symbols.push(currency.symbol);
    }
  });
  url += `&symbols=${symbols.join(',')}`;
  return url;
}

export function getCurrencyRates(symbol = 'EUR') {
  let url = `https://api.exchangeratesapi.io/latest?base=${symbol}`;
  url = applySymbols(url, symbol);
  return fetch(url);
}

export function convertedCurrency(amount, from, to) {
  const exchangeRate = rates[from][to];
  return amount * exchangeRate;
}

export function getExchangeRate(from, to) {
  return rates[from][to];
}
