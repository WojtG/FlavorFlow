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
