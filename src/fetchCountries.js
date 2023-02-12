import { Notify } from "notiflix";

export function fetchCountries(name) {
    fetch(`https://restcountries.com/v3.1/name/${name}`)
        .then(response => {
           
    if (!response.ok) {
        throw new Error(Notify.failure('Oops, there is no country with that name'));
            }
//             resp = response.json();
//  console.log(resp);
    return response.json();
});
};
