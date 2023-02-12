import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';
console.log(fetchCountries);

const DEBOUNCE_DELAY = 300;
inputEl = document.querySelector('#search-box');
listEl = document.querySelector('.country-list');
cardEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(func, 1000));

function func(e) {
    listEl.innerHTML = '';
    cardEl.innerHTML = '';
    cardEl.classList.remove('country-border');
    if (e.target.value.trim()) {
        fetchCountries(e.target.value.trim())
            .then(toManyCountries)
            .then(countryList)
            .then(countryCard)
            .catch(() => { });
    }
};

// function onError(response) {
//     if (!response.ok) {
//         throw new Error(Notify.failure('Oops, there is no country with that name'));
//     }
//     return response.json();
// };

function toManyCountries(list) {
    console.log(list);
    if (list.length > 10) { 
        throw new Error(Notify.info('Too many matches found. Please enter a more specific name.'));
    } 
    return list
};

function countryList(list) {
    if (list.length === 1) { return list; }
    cardEl.innerHTML = '';
    const markup = list.map(el => {
        const { name: { official }, flags: { svg } } = el;
        return(`
            <li>
                <img src="${svg}" alt="">
                <span>${official}</span>
            </li>`)
    }).join('');
    listEl.innerHTML = markup;
    throw new Error();
};

function countryCard(country) {
    cardEl.classList.add('country-border');
    const [{ name: { official }, capital="none", population, flags: { svg }, languages }] = country;
    markup = `
        <img src="${svg}" alt="">
        <span class="name">${official}</span>
        <p class="data">Capital: <span>${capital}</span></p>
        <p class="data">Population: <span>${population}</span></p>
        <p class="data">Languages: <span>${Object.values(languages).join(', ')}</span></p>`;
    cardEl.innerHTML = markup;
};