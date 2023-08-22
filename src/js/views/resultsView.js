import icons from 'url:../../img/icons.svg'; //zawsze path musi byc od folderu do ktorego importujemy, wiec jestesmy w controler pliku (czyli w folderze js) to musimy isc o jedne folder wyzej(do folderu src) i dopiero wejsc do img i pozniej podac plik ktory ma byc importowany. I teraz pod zmienna icons bedzie kryl sie path do odpowiadajacego pliku w dist. I teraz uzyjemy ${icons} w czesci hrefa + nazwa icony. Jak importuemy cos co nie jest kodem, czyli jakies plik ze zdj,plik z video,dzwiekiem,plik z ikonami itp to musimy dodac w path na poczatku 'url:path'. importujemy zawsze plik nigdy folder

import View from './View'; // exportujemy parent klase,jak cchcemy extendopwac klasy to nie mozemy uzywac #properties tylko _properties bo tamte jeszcze nie dzialaja w parcelu przy extnedowaniu klas jka np wysiwtelanie spinnera itp

class resulsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again!';
  _message = '';

  _generateMarkup() {
    return this._data.map(rec => this._generateMarkupPreview(rec)).join('');
  } //ta metoda mimo ze sie tak samo nazywa jak w recipeView to bedzie inny html generowala w obydwu view wiec nie moze byc jednej metody dla obydwu klas w klasie rodzicu.

  _generateMarkupPreview(rec) {
    const id = window.location.hash.slice(1); //id z window pobieramy
    return `
    <li class="preview">
        <a class="preview__link ${
          id === rec.id ? 'preview__link--active' : ''
        }" href="#${rec.id}">
            <figure class="preview__fig">
                <img src="${rec.image}" alt="" />
            </figure>
            <div class="preview__data">
                <h4 class="preview__title">${rec.title}</h4>
                <p class="preview__publisher">${rec.publisher}</p>
            </div>
        </a>
    </li>
`;
  }
}

export default new resulsView();
