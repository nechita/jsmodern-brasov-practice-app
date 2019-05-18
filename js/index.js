import { convertedCurrency, getExchangeRate, getCurrencyRates } from './helpers';
import { availableCurrencies } from './state';
import {
  app,
  spinner,
  fromAmount,
  toAmount,
  fromCurrencyList,
  toCurrencyList,
  fromCurrencyDisplay,
  toCurrencyDisplay,
  exchangeRateDisplay,
  fromCurrencyHeader,
  toCurrencyHeader,
} from './selectors';

export const state = {
  fromCurrency: 'EUR',
  toCurrency: 'GBP',
};

export const rates = {};

function hideApp() {
  app.style.display = 'none';
}

function showApp() {
  app.style.display = 'block';
  spinner.style.display = 'none';
}

function setToCurrencyList(exclude) {
  toCurrencyList.innerHTML = '';
  availableCurrencies.forEach((currency) => {
    const option = document.createElement('option');
    option.value = currency.symbol;
    option.textContent = currency.symbol;
    if (currency.symbol !== exclude) {
      toCurrencyList.appendChild(option);
    }
  });
  const firstChildValue = toCurrencyList.children[0].value;
  state.toCurrency = firstChildValue;
}

function setExchangeRateDisplay() {
  fromCurrencyDisplay.innerHTML = state.fromCurrency;
  toCurrencyDisplay.innerHTML = state.toCurrency;
  fromCurrencyHeader.innerHTML = state.fromCurrency;
  toCurrencyHeader.innerHTML = state.toCurrency;
}

function runListeners() {
  fromAmount.addEventListener('input', (event) => {
    toAmount.value = convertedCurrency(event.target.value, state.fromCurrency, state.toCurrency).toFixed(0);
  });

  toAmount.addEventListener('input', (event) => {
    fromAmount.value = convertedCurrency(event.target.value, state.toCurrency, state.fromCurrency).toFixed(0);
  });

  fromCurrencyList.addEventListener('change', (event) => {
    state.fromCurrency = event.target.value;
    setToCurrencyList(event.target.value);
    setExchangeRateDisplay();
    exchangeRateDisplay.innerHTML = getExchangeRate(state.fromCurrency, state.toCurrency).toFixed(2);
    if (!toAmount.value) {
      fromAmount.value = 0;
    } else {
      fromAmount.value = convertedCurrency(toAmount.value, state.toCurrency, event.target.value).toFixed(0);
    }
  });

  toCurrencyList.addEventListener('change', (event) => {
    state.toCurrency = event.target.value;
    setExchangeRateDisplay();
    exchangeRateDisplay.innerHTML = getExchangeRate(state.fromCurrency, state.toCurrency).toFixed(2);
    if (!fromAmount.value) {
      toAmount.value = 0;
    } else {
      toAmount.value = convertedCurrency(fromAmount.value, state.fromCurrency, event.target.value).toFixed(0);
    }
  });
}

function initApp() {
  setToCurrencyList('EUR');
  setExchangeRateDisplay();
  runListeners();
  showApp();
  exchangeRateDisplay.innerHTML = getExchangeRate(state.fromCurrency, state.toCurrency).toFixed(2);
}

hideApp();

const getEuro = getCurrencyRates();
const getUSD = getCurrencyRates('USD');
const getGBP = getCurrencyRates('GBP');
const getRON = getCurrencyRates('RON');

Promise.all([getEuro, getUSD, getGBP, getRON])
  .then(responses => Promise.all(responses.map(res => res.json())))
  .then((responses) => {
    responses.map((response) => {
      rates[response.base] = { ...response.rates };
      return response;
    });
    setTimeout(() => {
      initApp();
    }, 2000);
  })
  .catch(error => error);

availableCurrencies.forEach((currency) => {
  const option = document.createElement('option');
  option.value = currency.symbol;
  option.textContent = currency.symbol;
  if (currency.symbol === 'EUR') {
    option.setAttribute('selected', 'selected');
  }
  fromCurrencyList.appendChild(option);
});
