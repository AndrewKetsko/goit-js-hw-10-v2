import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const cardEl = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(func, 1000));
// listEl.addEventListener('click', listCC)


function func(e) {
    listEl.innerHTML = '';
    cardEl.innerHTML = '';
    cardEl.classList.remove('country-border');
    // listEl.removeEventListener('mouseover', listCC);
    if (e.target.value.trim()) {
        fetchCountries(e.target.value.trim())
            .then(toManyCountries)
            .then(countryList)
            .then(countryCard)
            .catch(() => { });
    }
};

function toManyCountries(list) {
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
    console.log(list);
    listEl.addEventListener('mouseover', cardFromList);
    throw new Error();

    function cardFromList(e) {
        if (e.target.nodeName !== "SPAN") {
            return;
        }
            // console.log(list);
    // console.log(e.target.textContent);
    const country = [list.find(el => el.name.official === e.target.textContent)];
        console.log(country);
        countryCard(country);
        // listEl.removeEventListener('click', cardFromList);
        // listEl.addEventListener('click', cardFromList);

    }
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