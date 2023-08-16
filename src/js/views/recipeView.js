import icons from 'url:../../img/icons.svg'; //zawsze path musi byc od folderu do ktorego importujemy, wiec jestesmy w controler pliku (czyli w folderze js) to musimy isc o jedne folder wyzej(do folderu src) i dopiero wejsc do img i pozniej podac plik ktory ma byc importowany. I teraz pod zmienna icons bedzie kryl sie path do odpowiadajacego pliku w dist. I teraz uzyjemy ${icons} w czesci hrefa + nazwa icony. Jak importuemy cos co nie jest kodem, czyli jakies plik ze zdj,plik z video,dzwiekiem,plik z ikonami itp to musimy dodac w path na poczatku 'url:path'. importujemy zawsze plik nigdy folder
import { Fraction } from 'fractional';

class RecipeView {
  #parentElement = document.querySelector('.recipe');
  #data;
  #errorMessage = 'We could not find that recipe. Please try another one!';
  #message = '';

  redner(data) {
    this.#data = data; //w tej metodzie stowrzymy #data ktore bedzie trzymalo dane o przepisie, i teraz ten przepis bedzie dostyepny pod tą property data wiec mozemy go wykorzystywac w innych metodach np  w #generateMarkup ktora stworzy nam htmla
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  rednerSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
  `;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //renderowanie bledow zawsze musi sie dziac na ekranie UI zeby widzial je uzytkowanik wiec wysiwtelanie i generowanie bledu powinno byc w view zawsze. teraz tą metode sie wezmie i jako ze jest public API to uzyje sie ją w controloerze do handlowania bledów
  renderError(message = this.#errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(msg = this.#message) {
    //renderuje wiadomosc pozytywna
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
`;
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRender(handler) {
    //tj publisher i musi dostac dostep do subscribera zeby sie mogl wykonac event, ale nie woilno nam imoprtowac niz z kontrolera do view, wiec tworzymy funckje ktora jako argument przyjmie event handlera

    ['hashchange', 'load'].forEach(ev => window.addEventListener(ev, handler)); //w ten sposob mozemy przeloopowac przez evenety do kotrych chcemy podlaczyc ten sam callback

    //W MVC event powinien byc sluchany w view natomiast kod jaki sie ma wykonac dla tego eventu powinien byc w controlerze. Dlatego nalezy zastosowac PUBLISHER-SUBSCRIBER pattern (pattern do oblusgi eventlistenerow w MVC architekturze).Tworzymy w view metode na naszym obiekcie  ktora bedzie tworzyla eventListenera (musi byc w public API) i jako callback funckje dajemy argument handler. Nastepnie w controlerze tworzymy funkcje init ktora zadziala przy starcie strony i w niej wywolujemy tą metode  addHandlerRender() na tym obieckie zaimportowanym z recipeView dla ktorego stworzylismy tą metode, i podajemy do niej  odpowiedni handler z controlera przez co stworzy sie dzialajacy event listener ktorego logika bedzie w controlorze a sluchanie na event w view

    //wytlumaczenie eventów:

    // window.addEventListener('hashchange', handler); jak zaladumemy wyniki wyszukiwania i user kliknie w ktorys przepis zeby sie wyswietlil to wtedy sluchamy na hashchange event czyli na zmaine w url, bo jak klikniemy w jakis przepis to sie zmieni hash w url i ten hash to bedzie taki sam jak id naszego przepisu.

    // window.addEventListener('load',handler); to dajemy w celu jak wkleimy link z url do przepisu (z hashem odpowiadajacym id) to zeby sie strona odrazu zaladowala z tym przepisem. Bo przy wklejeniu url gotowe nie zadziala hashchange bo nic w url sie nie zmieni, wiec sluchamy na load, az sie strona zaladuje iu wtedy odpalamy funckje controlRecipies
  }

  #generateMarkup() {
    //przy tworzeniu nowych elementow trzeba pamietac o tym ze po uzyciu parcela, tworzy sie nowy folder dist i to jest folder ktory bedzie wyswietlany w przegladrce, parcel tam zmienia roniwez nazwy itp przez to jak tworzymy za pomocą kodu nowe elementy na stronie i chcemy wrzucic jakies zdj ktore są w naszym folderze img to nie mozemy uzyc normalnego hrefa do nich bo tegn href nie bedzie znaleziony w folderze dist bo parcel zmienia nazwy, przez to trzeba href ustawic na folder w parcelu odpowiadajacy naszemu folderowi img. Zeby to zrobic najlepiej sobie zaimportowac tutaj ten nasz folder orginalny, bo to co my tu piszemy to sie wykonuje w folderze dist, w ktorym sa inne nazwy i ten normlany href by tam nie odnalazl sie.(importowanie na gorze kodu)

    return `
      <figure class="recipe__fig">
      <img src="${this.#data.image}" alt="${
      this.#data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this.#data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this.#data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this.#data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>


    
    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
      ${this.#data.ingredients
        .map(ing => this.#generateMarkupIngredient(ing))
        // nie moizemy uzywac forEach tu bo nie damy rady dodac tego elementu do czegos co jeszcze nie istenije na stronie. Musimy uzyc czegos co nam zreturnuje za kazdym razem stringa z HTML , wiec wezmiemy zmapujemy te skladniki w taki sposob ze w nowej array zamkna sie elementy htmlowskie opisujace kazdy skladnik, i pozniej łaczymy je za pomoca join("") i wtedy to zadziala tak samo jakbysmy dla kazdego skladnika recznie napisali takiego html template. mozna tez by bylo to zapisac jako .map( this.#generateMarkupIngredient) wtedy automayucznie kazdy elementy z mapewnowej array stanie sie arguemntem w kazdej kolejnej iteracji
        .join('')}
        
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this.#data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${this.#data.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
  }

  #generateMarkupIngredient(ing) {
    return `
          <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${
            ing.quantity ? new Fraction(ing.quantity).toString() : ''
          }</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
           ${ing.description}
          </div>
        </li>`;
  }
} //wszytskie view najlepiej robic w klasach, bo czesto jest glowna klasa view ktora bedzie inhertiowana przez wsyztsie inne view,oraz beda tez metody i zmienne prywatne dla kazdej z klas, kazdy view jako klasa powinien byc w osobnym pliku.

export default new RecipeView(); //tworzymy nowy object i na podstawie klasy i ekportujemy go do kontrolera, nie podajemy zadnych danych wiec nawey nie potrzebujemy constructora w klasie. Nidgy nie eksportuj calej klasy tylko obiekt stworzony na podsatwie tej klasy. Robimy jako piublic api te metody kotrych bedziemy chcieli uzyc w controlerze na tym stworzonym obiekcie.
