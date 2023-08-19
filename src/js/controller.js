//Controller łączy funckje, metody zmienne z view i z modelu. do view i modelu nie importujemy zadnych rzeczy z kontrolera ani do view/modelu nie importujemy nic z modelu/view
import * as model from './model.js';
import recipeView from './views/recipeView.js'; //imprtujemy obiekt stworzonyt na podsyawie jakiejs klasy wiec mozmey tu uzywac na nim wsyztskich metod i properties kotre sa public API tego obiektu.
import searchView from './views/searchView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';

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
    recipeView.renderError(); //dzieki throw err w modelu w loadRecipe, to jak wystapi tam blad w funckji to zretunruje sie promise z wartoscia tego errora i dzieki throw error w catrchu bedziemy mogli go tu obsluzyc, juz w linicje 21 awaitowalismy wynik tej async funkcji loadRecipe i jak tam bedzie error to on zejdzie tutaj do catcha. Ale nie chcemy nic z tego errora wyciagac tylko w view sobie error mesage piszemy w stringu i podajemy jako deafult value do funkcji.
  }
};

//W MVC event powinien byc sluchany w view natomiast kod jaki sie ma wykonac dla tego eventu powinien byc w controlerze. Dlatego nalezy zastosowac PUBLISHER-SUBSCRIBER pattern (pattern do oblusgi eventlistenerow w MVC architekturze).Tworzymy w view metode na naszym obiekcie  ktora bedzie tworzyla eventListenera (musi byc w public API) i jako callback funckje dajemy argument handler. Nastepnie w controlerze tworzymy funkcje init ktora zadziala przy starcie strony i w niej wywolujemy tą metode  addHandlerRender() na tym obieckie zaimportowanym z recipeView dla ktorego stworzylismy tą metode, i podajemy do niej  odpowiedni handler z controlera przez co stworzy sie dzialajacy event listener ktorego logika bedzie w controlorze a sluchanie na event w view

const controlSearchResults = async function () {
  try {
    // 1) Get search query
    const query = searchView.getQuery(); //query z searchview pobieramy i podajemy tutaj jako osoban funckja, bo nie chcemy miec w kontroloerze zadnych dom elementow

    if (!query) return;

    // 2) Load search query
    await model.loadSearchResults(query); //nie zamykamy tego w zmiennej bo loadSearchResults zwraca undefined, ona jednie modykifuje state

    // 3) Render results
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};

const init = function () {
  recipeView.addHandlerRender(controlRecipies); //sama logika w controlerze, bez eventlistnera ktory jest w view
  searchView.addHandlerSearch(controlSearchResults);
};

init();
