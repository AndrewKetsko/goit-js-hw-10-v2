import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const cardEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(func, 1000));


let list;
function func(e) {
  listEl.innerHTML = '';
  cardEl.innerHTML = '';
  cardEl.classList.remove('country-border');

  if (e.target.value.trim()) {
    fetchCountries(e.target.value.trim())
      .then(toManyCountries)
      .then(countryList)
      .then(countryCard)
      .catch(() => {});
  }
}

function toManyCountries(data) {
  list = data;
  if (list.length > 10) {
    throw new Error(
      Notify.info('Too many matches found. Please enter a more specific name.')
    );
  }
  return list;
}

function countryList(list) {
  if (list.length === 1) {
    return list;
  }
  cardEl.innerHTML = '';
  const markup = list
    .map(
      ({ name: { official }, flags: { svg } }) =>
        `<li><img src="${svg}" alt="flag"><span>${official}</span></li>`
    )
    .join('');
  listEl.innerHTML = markup;
  listEl.removeEventListener('mouseover', cardFromList);
  listEl.addEventListener('mouseover', cardFromList);
}
function cardFromList(e) {
  if (e.target.nodeName !== 'SPAN') {
    return;
  }
  const country = [];
  country.push(list.find(el => el.name.official === e.target.textContent));

//   if (country.length === 0) {
//     throw new Error();
//   }
  countryCard(country);
}

function countryCard(country) {
//   if (!country) {
//     return;
//   }
  cardEl.classList.add('country-border');
  const [
    {
      name: { official },
      capital = 'none',
      population,
      flags: { svg },
      languages,
    },
  ] = country;
  const markup = `
        <img src="${svg}" alt="">
        <span class="name">${official}</span>
        <p class="data">Capital: <span>${capital}</span></p>
        <p class="data">Population: <span>${population}</span></p>
        <p class="data">Languages: <span>${Object.values(languages).join(
          ', '
        )}</span></p>`;
  cardEl.innerHTML = markup;
}