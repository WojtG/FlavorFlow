import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config';
import { getJSON } from './helpers';

export const state = {
  //exportujemy zeby moc uzyc w  controllerze. W state poiiwnny byc zapisane wszytskie data o aplikacji i powinno byc to sychroniczne z view
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}${id}`);
    const { recipe } = data.data; //desctructing, przeipis jest w obiekcie recipe, tworzymy zmienna  zeby zmienic nazwy properties ktore przyszedł z api, zeby sie z konwencją nazewnicrwa JS zgadzaly (bo mają _ zamiast camelCase)

    //refactoring properties names in API's data

    //teraz naz obiekt recipe w state ustawiamy na properties names a ich wartosci ustawiamy na te ktore przyszly z data.data.recipe

    state.recipe = {
      id: recipe.id, //nowaNazwa: wartosc kotra sie kryla pod stara nazwa
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    }; //nadpisujemy ten object i dajemy nazwy ktore chcemy i przypisujemy im wartosc ktore kryły sie pod starymi nazwami.

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    //dzieki temu checkowi przy ladowaniu recipe sprawdzamy czy kotrykowilek z recipes ktore sa w array bookmarks ma takie samo id jak id recipe ktore teraz pobieramy, jak tak to ustawm mu property .bookmarked= true a jak nie to false. Dzieki temu przy ladowaniu z api kazdy przepis bedzie mial ta properties przez co pozniej jak klikniemy w inny przepis i spowrotem w ten to state.recipe.bookmarked dalej bedzie dostepne na tym objectie bo inaczej bez tego przepis pobral by sie z API raz jeszvze i mimo ze w addBookmark() dodajemy ta property to ona sie nie zapisze.
  } catch (err) {
    throw err; //throwujemy go zeby jak wystrapi tu blad to zeby loadRecipe zworcilo rejected promisa ktorego wartosc to bedzie ten error, i zebysmyh mogli uzyc tego w controlerze.
  }
}; //buisness logic i pobranie danych mają tez byc  w modelu. Controller przy wywolywaniu tej funckji poda id jako argument. Ta fucnkja nic nie returnuje tylko zmienia nasz state object w kotrym bedzie zapisany przepis i ten state object bedzie uzyty przed controleler zeby wziac recipe. Zadzial dlatego ze export i import nie dzialaja na kopiach tylko na jednej zmiuennej, wiec jak tu sie nadpisze state to w controloerze gdziue importujemy tez sie nadpisze state

export const loadSearchResults = async function (query) {
  //funckja pobierajaca search resulty, na podstawie query
  try {
    state.search.query = query; //zapisijemy tabele i query w state
    const data = await getJSON(`${API_URL}?search=${query}`);

    state.search.results = data.data.recipes.map(recipe => {
      //zmapujemy wsyztskie wyniki wyszukiwania i zmienimy im properties names.
      return {
        id: recipe.id, //nowaNazwa: wartosc kotra sie kryla pod stara nazwa
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
      };
    });
    state.search.page = 1; //resetujemy wartosc strony zeby przy nowym wyszukaniu nie wyswitelilo nam na numerze strony na ktorym skionczylismy w poprzednim wyszukiwaniu tylko zeby zaczelo od 1 stroy
  } catch (err) {
    throw err;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  //defaultowa wartosc page to 1 i zapisana jest w stejcie, jak nie damy zadnego argumentu to sie przjmie 1 jako page
  state.search.page = page; //storujemy w stejcie aplikacji na ktorej stronie aktualnie jestesmy
  const start = (page - 1) * state.search.resultsPerPage; //tak bieerzemy pierwsza wartosc (page -1) * ilosc wyniukow ktore chcemy miec na jednej stronie, page zaczyna sie od 1 wiec na pierwszej staonie start zacznie generowac od 0 wyrazu w array na drugiej streoanie jak page bedzie 2 to od 10 wyrazu w array i tak dalej
  const end = page * state.search.resultsPerPage; //tak koncowy wyraz page * ilosc wyniukow ktore chcemy miec na jednej stronie. dla strony 1 to 10 dla drugiej 20 i tak dalerj
  return state.search.results.slice(start, end); //slice robi nam wycinek array, tak jak na stringach dziala, od indexu start do indexu end ale end nie wchopdzi w sklad nowej array
}; //nie jest async bo search resulty sa juz zaladowane w tym punkcie gdy bedzimey wywolywac tą fucnkje, nie sa jedynie wyrenederowane.bedziemy po prostu w tej funckji wyciagac z tablicy state.search.results okresloną liczbe wynikow dla kazdej strony i pozniej wkladac ten wycinek do controlera gdzie rendeorwalismy wyniki

export const updateServings = function (newServings) {
  // console.log(state.recipe.ingredients);

  // state.recipe.ingredients = state.recipe.ingredients.map(ing => {
  //   return {
  //     quantity:
  //       ing.quantity !== null ? newServings * ing.quantity : ing.quantity,
  //     unit: ing.unit,
  //     description: ing.description,
  //   };
  // });

  //mozna w ten sposob za pomoca map a wiec stworzyc nową state.recipe.ingredients albo zmutowac tą jedna property quantity za pomocą forEach

  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;

    //nowaIloscSkladnikow = staraIloscSkadników * nowa ilosc porcji/ stara ilosc porcji
    //przyklad nowaIloscSkladnikow = 2 *8/4 =4 powoila sie ilosc porcji wiec podwoji sie ilosc skladnikow.
  });

  state.recipe.servings = newServings;
};

const storeBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}; //funckja ktora bedzie nam zapisac array z bookamarkami w localStorage, podamy ją do addBookmark i deleteBookmark zeby sie updejtowala za kazdym razem jak dodamy lub usuniemy bookmark

export const addBookmark = function (recipe) {
  // Add bookmark
  state.bookmarks.push(recipe); //to dlatego jesty potrzebne ze jak kliknimy inny przepis to stracimy tego state.recipe.bookmarked = true; bo wtedy przy wybraniu nowego przepisu laduje sie on od nowa z api a w api nie ma state.recipe.bookmarked = true dlatego pushuijuemy to do tej tabeli zeby to pozniej wyciganac i wiedziec ktore recipe byly bookmarked

  // Mark current recipe
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //jak recipe bedzie tym samyhm co sie wysiwetla na stronie to sie dodoa propety bookmarked z wartoscia true. Dzieki temu bedzimy mogli wiedziec ze ten przepis jesy bookmarked jak bedziemy uzywac tych danych w recipe view
  storeBookmarks();
}; //otrzyma recipe ktore jest wyswietlane na stronie, pushuje je do array bookmarks w state i tworzy dla tego pushnietego recipe property bookmarked z wartoscia true

export const deleteBookmark = function (id) {
  // Delete bookmark
  const index = state.bookmarks.findIndex(bookmark => bookmark.id === id);
  if (index === -1) return;
  state.bookmarks.splice(index, 1); //usuwamy element z array dzieki czemu przy zmianie na inny recipe i spowortem na ten bedziemy miec zupdejtowane znaczek bookmarka
  // Unmark current recipe
  state.recipe.bookmarked = false; // dzieki temu na current recipe ktory sie wysiwetla usunie nam sie bookmark
  storeBookmarks();
}; //to jest taki pattern w programowaniu ze jak chcemy cos dodac to dajemy jako argfument cale dane a jakc chemy usunac to podajemy jako argument samo id

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
}; ///funckja ktora odrazu po zaladowaniu bedzie wyicgala dane z local storage i zapisywala je odrazu w array z bookmarkami jesli jakies bedą w localStorage.  dzieki temu bedziemy mogly wyrednerowac bookmarki odrazu po zaladowaniu strony

init();

const clearBookmark = function () {
  localStorage.clear('bookmarks');
};
// clearBookmark(); for development purposes
