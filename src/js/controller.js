import * as model from './model.js';
import recipeView from './views/recipeView.js'; //imprtujemy obiekt stworzonyt na podsyawie jakiejs klasy wiec mozmey tu uzywac na nim wsyztskich metod i properties kotre sa public API tego obiektu.
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

//W MVC event powinien byc sluchany w view natomiast kod jaki sie ma wykonac dla tego eventu powinien byc w controlerze. Dlatego nalezy zastosowac PUBLISHER-SUBSCRIBER pattern (pattern do oblusgi eventlistenerow w MVC architekturze).Tworzymy w view metode na naszym obiekcie  ktora bedzie tworzyla eventListenera (musi byc w public API) i jako callback funckje dajemy argument handler. Nastepnie w controlerze tworzymy funkcje init ktora zadziala przy starcie strony i w niej wywolujemy tą metode  addHandlerRender() na tym obieckie zaimportowanym z recipeView dla ktorego stworzylismy tą metode, i podajemy do niej  odpowiedni handler z controlera przez co stworzy sie dzialajacy event listener ktorego logika bedzie w controlorze a sluchanie na event w view

const init = function () {
  recipeView.addHandlerRender(controlRecipies); //sama logika w controlerze, bez eventlistnera ktory jest w view
};

init();
