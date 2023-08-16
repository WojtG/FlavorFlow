import * as model from './model.js';
import recipeView from './views/recipeView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';

const recipeContainer = document.querySelector('.recipe');

///////////////////////////////////////

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1); // hash w url bedzie taki sam jak id naszego przepisu wiec wyciagamy hash i na jego podstawie bedziemy fetchowac dane. musi byc splice(1) bo normlanie sie zwraca z #przed id a my potrzebujemy bez #

    if (!id) return; //trzeba takie sprawdzenie bo inaczej jakbysmy zaladowali strone bez konkertnego przepisu (bez hasha) to by bylo error bo by sie response nie pobral itp bo id wtedy nie istnieje. To jest przypoadek jak wchodzimy na glowna strone. Wiec trzeba dac ze jak nie ma id to funckja returnuje

    recipeView.rednerSpinner();

    //1) loading recipe

    await model.loadRecipe(id); //tutaj wywolujemy tylko funkcje z modelu, to jest logika dzialania aplikacji, cala logika biznesowa tej funckji jest zamknieta w modelu. To jest async fuynckja wiec returnuje promise wiec trzeba awaitowac zeby dosyac jej wynik. jestesmy w  srodku innej async funckji wiec tak jak normlanie w async funckji kazdy promise sie awaituje. nie zamykamy tego w nowym variable bo ten promise ktory returnuje funckja async nie ma zadnej wartosci, (czyli ze funckja async zawsze returnuje promisa ale zeby ten promise mial jakas wartosc to trzeba uzyc return 'cos' w tej funmckji async i to bedzie ta wartosc zreturnowanego promisa)

    //2) rendering the recipe
    recipeView.redner(model.state.recipe); //na obiekcie stworzonym w view recipeView na podstauwe klasy  recipeView wowlujmy metode render ktora jest public api, ktora uruchomi zapisze nam dane z kroku 1 w property i ta protperty bedzie wykorzystana w prywantej metodzie #generateMarkup ktora odpowieddzialna jesy za stworzenie htmla, a nastepnie render method wyrenderuje
  } catch (error) {
    console.log(error.message);
  }
};

// window.addEventListener('hashchange', controlRecipies); jak zaladumemy wyniki wyszukiwania i user kliknie w ktorys przepis zeby sie wyswietlil to wtedy sluchamy na hashchange event czyli na zmaine w url, bo jak klikniemy w jakis przepis to sie zmieni hash w url i ten hash to bedzie taki sam jak id naszego przepisu.

// window.addEventListener('load', controlRecipies); to dajemy w celu jak wkleimy link z url do przepisu (z hashem odpowiadajacym id) to zeby sie strona odrazu zaladowala z tym przepisem. Bo przy wklejeniu url gotowe nie zadziala hashchange bo nic w url sie nie zmieni, wiec sluchamy na load, az sie strona zaladuje iu wtedy odpalamy funckje controlRecipies

['hashchange', 'load'].forEach(ev =>
  window.addEventListener(ev, controlRecipies)
); //w ten sposob mozemy przeloopowac przez evenety do kotrych chcemy podlaczyc ten sam callback

const decimal = 0.75;
