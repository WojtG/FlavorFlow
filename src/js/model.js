import { async } from 'regenerator-runtime';
import { API_URL } from './config';
import { getJSON } from './helpers';
export const state = {
  //exportujemy zeby moc uzyc w  controllerze. W state poiiwnny byc zapisane wszytskie data o aplikacji i powinno byc to sychroniczne z view
  recipe: {},
  search: {
    query: '',
    results: [],
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
