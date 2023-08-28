import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config';
import { AJAX } from './helpers';

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

const createRecipeObject = function (data) {
  //jak argument dosytaje obiekt data
  const { recipe } = data.data; //desctructing, przeipis jest w obiekcie recipe, tworzymy zmienna  zeby zmienic nazwy properties ktore przyszedł z api, zeby sie z konwencją nazewnicrwa JS zgadzaly (bo mają _ zamiast camelCase)

  //refactoring properties names in API's data

  //teraz naz obiekt recipe w state ustawiamy na properties names a ich wartosci ustawiamy na te ktore przyszly z data.data.recipe
  return {
    id: recipe.id, //nowaNazwa: wartosc kotra sie kryla pod stara nazwa
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }), //w ten sposob mozemy conditionaly dodawac do obiektu properties z jakas wartoscia. Uzywamy tutaj and operatora ktory jak trafi na false value to ją resturnuje, a jak nie trafi na zadna false value to returnuje ostanią rzecz a wiec tutaj and operator sprawdza czy na obiekcie recipe istnieje property .key jak nie istenieje tj false to ją zwraca (pozniej spreaduje ale spredowanie niczego to dalej nic) a jak istnieje to idze dalej i zwraca ostatnia rzecz  w tym wyrazeniu czyli object {key:recipe.key} i wystraczy go teraz zespredowac i doda sie property key z wartoscia recipe.key a jak nie isntnieje recipe.key to nie doda sie nic. Musimy zamknac { key: recipe.key } w obiekcie i pozniej to spreadowac bo inaczej nie zadziala jak nie wykonammy tych dwoch rzeczy
  }; //nadpisujemy ten object i dajemy nazwy ktore chcemy i przypisujemy im wartosc ktore kryły sie pod starymi nazwami.
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${KEY}`);
    //do wszytkich AJAX calls podajemy key kotry sluzy do obslugi wyslanych danych, mimo ze tutaj pobieramy dane to jak uwzglednimy key to pobiorą sie nam rowniez rzeczy kotre sami przeslalismy do API (nasze przepisy). Jak juz mamy jeden paramter w URL w to kolejny nie dajemy ? tylko &
    state.recipe = createRecipeObject(data);

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
    const data = await AJAX(`${API_URL}?search=${query}&key=${KEY}`); //do wszytkich AJAX calls podajemy key kotry sluzy do obslugi wyslanych danych, mimo ze tutaj pobieramy dane to jak uwzglednimy key to w searchResultach wyskoczą nam rowniez rzeczy kotre sami przeslalismy do API (nasze przepisy). Jak juz mamy jeden paramter w URL w to kolejny nie dajemy ? tylko &

    state.search.results = data.data.recipes.map(recipe => {
      //zmapujemy wsyztskie wyniki wyszukiwania i zmienimy im properties names.
      return {
        id: recipe.id, //nowaNazwa: wartosc kotra sie kryla pod stara nazwa
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
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
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true; //jak recipe bedzie tym samyhm co sie wysiwetla na stronie(current recipe zapisanym w state.recipe) to sie dodoa propety bookmarked z wartoscia true. Dzieki temu bedzimy mogli wiedziec ze ten przepis jesy bookmarked jak bedziemy uzywac tych danych w recipe view
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

export const uploadRecipe = async function (newRecipe) {
  try {
    // const ingredients = Object.entries(newRecipe)
    //   .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    //   .map(ing => ing[1].replaceAll(' ','').split(','))
    //   .map(ing => {
    //     return {
    //       quantity: ing[0],
    //       unit: ing[1],
    //       description: ing[2],
    //     };
    //   });
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].split(',').map(el => el.trim()); //w ten sposob wszytskie podwojne spacje wyjbiemy z kazdej litery osobno
        if (ingArr.length !== 3)
          //dzieki temu sprawdzmay czy jesy dobry formart wprowadzony, w sensie czu iser wprowadzil quantity, unit, description
          throw new Error(
            'Wrong ingredient format! Please use the correct format'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      }); //Zamieniamy obiekt ktory przyszedl na array entries zeby moznma bylo przeiterowac i filtrujemy z niego array z ingrideints sprawdzajac w tej array entries czy na pierwszym miejscu czyli tam gdziie jesy key to czy zaczyna sie z property z nazwą ingredients, jesli tak to wrzuci to do tej array ktora tworzymy. startsWith(string) to metoda dla stringow ktora sprawdza czy string zaczyna sie na dany string jaki podalismy w nawiasie. Pozniej opis ingredient sa zamkaniete na indexie 1 w tej array z entries wiec mapujemy je i splitujemy z przecinkiem a nastepenie na podsyawie tej array robimy desctructing i  tworzymy obiekt w tym samym formacie co przyjmuje API

    const recipe = {
      //teraz tworzymy obiekt ktory wyglada tak samo jak ten ktory dostajemy z API (jeszcze przed tym jak zmienimy mu property names) i to on bedzie wysylany do API
      // nie podajemy id: no bo go nie ma ,
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${KEY}`, recipe); //sprawdzaj dokumenctacje ale prawie zawsze rozne rzeczy na api sie robi tak ze po podaniu glownego linka pisze sie ?nazwaParametruPodanaWDokumentacji=wartosc kotra chcemy mu dac. Ta fucnkja to promise wiec trzeba awaitowac i ona oddaje dane wiec trzeba ja zamknac w zmiennej. do tej funckji podajemy url razem z API key bo zeby wysylac rzeczy do api to trzeba miec API key i podajemy rowniez dane ktore chcemy wsylac do API
    state.recipe = createRecipeObject(data);
    //Teraz jak sie udalo wyslac do API i dostalismy response z danymi to trzeba spowrotem stworzyc nowy obiekt na podstawie danych z obiektu kotry przeszedl z API, Ten obiekt musi miec takie same property names jak na poczatku okreslalaismy zeby funckje dzialaly tez na tym obiekcie (czyli ammy taka sama sytuacje jak w linicje 39) + musi miec jeszzce property z wartoiscia API KEY
    // state.recipe.key = data.data.recipe.key; mozna tu dodac key do tego obiektu ale zrobimy to w funkcji createRecipeObject() i bedziemy conditionaly dodawac tą property jak istnieje

    addBookmark(state.recipe); //dodajemy bookamrka dla tego przepisu
  } catch (err) {
    throw err;
  }
};

// clearBookmark(); for development purposes
