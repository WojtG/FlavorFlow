import 'regenerator-runtime/runtime';
import 'core-js/stable';
import icons from 'url:../img/icons.svg'; //zawsze path musi byc od folderu do ktorego importujemy, wiec jestesmy w controler pliku (czyli w folderze js) to musimy isc o jedne folder wyzej(do folderu src) i dopiero wejsc do img i pozniej podac plik ktory ma byc importowany. I teraz pod zmienna icons bedzie kryl sie path do odpowiadajacego pliku w dist. I teraz uzyjemy ${icons} w czesci hrefa + nazwa icony. Jak importuemy cos co nie jest kodem, czyli jakies plik ze zdj,plik z video,dzwiekiem,plik z ikonami itp to musimy dodac w path na poczatku 'url:path'. importujemy zawsze plik nigdy folder

const recipeContainer = document.querySelector('.recipe');

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

///////////////////////////////////////
const rednerSpinner = function (parentEl) {
  const markup = `
  <div class="spinner">
    <svg>
      <use href="${icons}#icon-loader"></use>
    </svg>
  </div> 
`;
  parentEl.innerHTML = '';
  parentEl.insertAdjacentHTML('afterbegin', markup);
  //bedzie dzialalo jak spinner dzieki animacji w css
};

const showRecipe = async function () {
  try {
    //loading recipe

    rednerSpinner(recipeContainer);

    const response = await fetch(
      'https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886'
    );
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    let { recipe } = data.data;

    //refactoring properties names in API's data

    recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };

    // rendering the recipe

    //przy tworzeniu nowych elementow trzeba pamietac o tym ze po uzyciu parcela, tworzy sie nowy folder dist i to jest folder ktory bedzie wyswietlany w przegladrce, parcel tam zmienia roniwez nazwy itp przez to jak tworzymy za pomocą kodu nowe elementy na stronie i chcemy wrzucic jakies zdj ktore są w naszym folderze img to nie mozemy uzyc normalnego hrefa do nich bo tegn href nie bedzie znaleziony w folderze dist bo parcel zmienia nazwy, przez to trzeba href ustawic na folder w parcelu odpowiadajacy naszemu folderowi img. Zeby to zrobic najlepiej sobie zaimportowac tutaj ten nasz folder orginalny, bo to co my tu piszemy to sie wykonuje w folderze dist, w ktorym sa inne nazwy i ten normlany href by tam nie odnalazl sie.(importowanie na gorze kodu)

    const markup = `
      <figure class="recipe__fig">
      <img src="${recipe.image}" alt="${recipe.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${recipe.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          recipe.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          recipe.servings
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
      ${recipe.ingredients
        .map(ing => {
          // nie moizemy uzywac forEach tu bo nie damy rady dodac tego elementu do czegos co jeszcze nie istenije na stronie. Musimy uzyc czegos co nam zreturnuje za kazdym razem stringa z HTML , wiec wezmiemy zmapujemy te skladniki w taki sposob ze w nowej array zamkna sie elementy htmlowskie opisujace kazdy skladnik, i pozniej łaczymy je za pomoca join("") i wtedy to zadziala tak samo jakbysmy dla kazdego skladnika recznie napisali takiego html template
          return `
          <li class="recipe__ingredient">
          <svg class="recipe__icon">
            <use href="${icons}#icon-check"></use>
          </svg>
          <div class="recipe__quantity">${ing.quantity}</div>
          <div class="recipe__description">
            <span class="recipe__unit">${ing.unit}</span>
           ${ing.description}
          </div>
        </li>`;
        })
        .join('')}
        
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          recipe.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href="${recipe.sourceUrl}"
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
    recipeContainer.innerHTML = '';
    recipeContainer.insertAdjacentHTML('afterbegin', markup);
  } catch (error) {
    console.log(error.message);
  }
};

showRecipe();

const chuj = document.querySelector('.search-results');
