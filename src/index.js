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
            .catch(() => { });
    }
};

function toManyCountries(data) {
    list = data;
    if (list.length > 10) { 
        throw new Error(Notify.info('Too many matches found. Please enter a more specific name.'));
    } 
    return list
};

function countryList(list) {
    if (list.length === 1) {
        return list;
    }
    cardEl.innerHTML = '';
    const markup = list
        .map(({ name: { official }, flags: { svg } }) =>
            `<li><img src="${svg}" alt=""><span>${official}</span></li>`)
        .join('');
    listEl.innerHTML = markup;
    listEl.removeEventListener('mouseover', cardFromList);
    listEl.addEventListener('mouseover', cardFromList);
    throw new Error();
};
    function cardFromList(e) {
        if (e.target.nodeName !== "SPAN") {
            return;
        }
    const country = [list.find(el => el.name.official === e.target.textContent)];
        countryCard(country);
};

// function listCC(e) {
//     if (e.target.nodeName !== "SPAN") {
//         return;
//     }
    // console.log(list);
    // console.log(e.target.textContent);
    // const country = list.find(el => official === e.target.textContent);
        // console.log(country);
//     fetchCountries(e.target.textContent)
//             .then(toManyCountries)
//             .then(countryList)
//             .then(countryCard)
//             .catch(() => { });
// }

function countryCard(country) {
    cardEl.classList.add('country-border');
    const [{ name: { official }, capital="none", population, flags: { svg }, languages }] = country;
    const markup = `
        <img src="${svg}" alt="">
        <span class="name">${official}</span>
        <p class="data">Capital: <span>${capital}</span></p>
        <p class="data">Population: <span>${population}</span></p>
        <p class="data">Languages: <span>${Object.values(languages).join(', ')}</span></p>`;
    cardEl.innerHTML = markup;
};