//Controller łączy funckje, metody zmienne z view i z modelu. do view i modelu nie importujemy zadnych rzeczy z kontrolera ani do view/modelu nie importujemy nic z modelu/view
import * as model from './model.js';
import recipeView from './views/recipeView.js'; //imprtujemy obiekt stworzonyt na podsyawie jakiejs klasy wiec mozmey tu uzywac na nim wsyztskich metod i properties kotre sa public API tego obiektu.
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import 'regenerator-runtime/runtime';
import 'core-js/stable';
import { async } from 'regenerator-runtime';

// if (module.hot) {
//   module.hot.accept();
// }
//to 0d 9 do 11 linijki nie jest js tylko to jest stricte z parcela i to jak napiszemyu to jak zrobimy zmiany w kodzie to strona nasza sie zupdejtuje ale nie stracimy stejtu aplikajci bo nie odswiezy sie strona,wiec to przydatne do developingu jak chcemy zachowac stan aplikajci a na koniec robot to wyjebviemy

const controlRecipies = async function () {
  try {
    const id = window.location.hash.slice(1); // hash w url bedzie taki sam jak id naszego przepisu wiec wyciagamy hash i na jego podstawie bedziemy fetchowac dane. musi byc splice(1) bo normlanie sie zwraca z #przed id a my potrzebujemy bez #

    if (!id) return; //trzeba takie sprawdzenie bo inaczej jakbysmy zaladowali strone bez konkertnego przepisu (bez hasha) to by bylo error bo by sie response nie pobral itp bo id wtedy nie istnieje. To jest przypoadek jak wchodzimy na glowna strone. Wiec trzeba dac ze jak nie ma id to funckja returnuje

    //0 ) Update results view to mark selected search result

    resultsView.update(model.getSearchResultsPage()); //upodejtujemy strone na ktorej jestesmy
    bookmarksView.update(model.state.bookmarks); //dajemy tu z tego pwoodu zeby przy kazdym ladowaniu sie nowego przepisu to uruchomic bo inaczej nie dziala klasa active w tym bookmark contenerze

    recipeView.renderSpinner();

    //1) loading recipe

    await model.loadRecipe(id); //tutaj wywolujemy tylko funkcje z modelu, to jest logika dzialania aplikacji, cala logika biznesowa tej funckji jest zamknieta w modelu. To jest async fuynckja wiec returnuje promise wiec trzeba awaitowac zeby dosyac jej wynik. jestesmy w  srodku innej async funckji wiec tak jak normlanie w async funckji kazdy promise sie awaituje. nie zamykamy tego w nowym variable bo ten promise ktory returnuje funckja async nie ma zadnej wartosci, (czyli ze funckja async zawsze returnuje promisa ale zeby ten promise mial jakas wartosc to trzeba uzyc return 'cos' w tej funmckji async i to bedzie ta wartosc zreturnowanego promisa)

    //2) rendering the recipe
    recipeView.render(model.state.recipe); //na obiekcie stworzonym w view recipeView na podstauwe klasy  recipeView wowlujmy metode render ktora jest public api, ktora uruchomi zapisze nam dane z kroku 1 w property i ta protperty bedzie wykorzystana w prywantej metodzie #generateMarkup ktora odpowieddzialna jesy za stworzenie htmla, a nastepnie render method wyrenderuje
  } catch (error) {
    recipeView.renderError(); //dzieki throw err w modelu w loadRecipe, to jak wystapi tam blad w funckji to zretunruje sie promise z wartoscia tego errora i dzieki throw error w catrchu bedziemy mogli go tu obsluzyc, juz w linicje 21 awaitowalismy wynik tej async funkcji loadRecipe i jak tam bedzie error to on zejdzie tutaj do catcha. Ale nie chcemy nic z tego errora wyciagac tylko w view sobie error mesage piszemy w stringu i podajemy jako deafult value do funkcji.
  }
};

//W MVC event powinien byc sluchany w view natomiast kod jaki sie ma wykonac dla tego eventu powinien byc w controlerze. Dlatego nalezy zastosowac PUBLISHER-SUBSCRIBER pattern (pattern do oblusgi eventlistenerow w MVC architekturze).Tworzymy w view metode na naszym obiekcie  ktora bedzie tworzyla eventListenera (musi byc w public API) i jako callback funckje dajemy argument handler. Nastepnie w controlerze tworzymy funkcje init ktora zadziala przy starcie strony i w niej wywolujemy tą metode  addHandlerRender() na tym obieckie zaimportowanym z recipeView dla ktorego stworzylismy tą metode, i podajemy do niej  odpowiedni handler z controlera przez co stworzy sie dzialajacy event listener ktorego logika bedzie w controlorze a sluchanie na event w view

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();

    // 1) Get search query
    const query = searchView.getQuery(); //query z searchview pobieramy i podajemy tutaj jako osoban funckja, bo nie chcemy miec w kontroloerze zadnych dom elementow

    if (!query) return;

    // 2) Load search query
    await model.loadSearchResults(query); //nie zamykamy tego w zmiennej bo loadSearchResults zwraca undefined, ona jednie modykifuje state

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    // 4) Render pagination btns
    paginationView.render(model.state.search); //bedziemy potrzbowali tutaj podac model.state.search, wtedy render zapisze te dane w _data i uzjemy tego _data w _generateMarkup ktory jest wywolywany przez render
  } catch (err) {
    resultsView.renderError(); //tu nawet nie handlujemy erroa bo handlowanyt jest w srodku funckji render, ale imo lepiej tu go handlowac, tak jak w funckji controlRecipies() throwac go z modelu i tu go lapac, dlatrego tu go jednak handlowalem
  }
};

const controlPagination = function (goToPage) {
  //goToPage to numer strony z domu do ktorej mamy isc po klikneciu btna

  // 1) Render new results
  resultsView.render(model.getSearchResultsPage(goToPage)); //renderuja sie nowe resulty wzgledem goToPage, tamte sie usuwaja bo render ma w srodku siebie metode clear() ktora usuwa htmla z rodzica przed dodaniem nowytch wyniukow. paginationView.render(model.state.search zostaje takie samo bo getSearchResultsPage(goToPage) nadpiduje dane w model.state.search.page odnosnie numeru strony

  // 2) Render new pagination btns
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //newSerwings to liczba serwings ktora przyjdzie z domu i zeby ją tu podac to wywoamy tam handlera z arguemntem ktory bedzie odpowiadal wlasnie liczbe nowych serwings / tak samo stosowalismy w controlPagination przy podawaniu goToPage
  // 1) update recipe ingredients and servings
  model.updateServings(newServings);
  // 2) Redner the recipe view
  // recipeView.render(model.state.recipe); //rendderujemy jeszcze raz caly view przepisu zamiast tylko recipe ingredients wiec to chujowe bo sie bedzie pobieralo jeszcze zdj itp wiec musimy to zmienic zeby tylko recipe ingredients sie rnederowaly przy nacisnieciu guzika
  recipeView.update(model.state.recipe); //to bedzie updejtowalo tylko text i atrybuty w DOM a nie ze bedzie cale wysiwetlanie przpeisu jeszcze raz sie bedzie musialo zrobic tak jak w tym wczesnijeszym sposobie
};

const controlAddBookmarks = function () {
  // 1) Add/remove bookmarks
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  //dodajemy bookmarka dla current recipe i pozniej updejtujemy wysiwtelamy na stronie DOM
  else model.deleteBookmark(model.state.recipe.id);
  // 2) Update recipe view
  recipeView.update(model.state.recipe);

  // 3) Update bookmarks view
  bookmarksView.render(model.state.bookmarks); //za kazdym razem jak nacisniemy bedzie sie renderowac cala array z bookmarkami przez co sie bedzie updejtowac DOM w zaleznosic czy dodamy czy usuniemY bookmark. Dlatego tez w state potrzebowalismy array bookmarks zeby pozniej moc wyrenderowac w miejscu przeznaczonym dla bookamarkow te ktore sa w tej array
}; //jak recipe nie jest bookmarked to chcemy dodac bookamrka po klinieciu a jak jest bookmarked to chcemy po klikenicu usunac bookmarka, jest taki pattern w programowaniu ze jak cos dodajemy to sie podaje wszytskie dane a jak cos usuwamy to tylko id
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
}; //potrzebujemy tą funckje zeby jak sie zaladuje strona to zeby wyrenderowalo bookmarki z localStorage, bo pozniej wywolujmey update a nie damy rady updejtowac htmla jak zaden nie jest wyrenderowany

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipies); //sama logika w controlerze, bez eventlistnera ktory jest w view
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmarks);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
};

init();
