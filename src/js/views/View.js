import icons from 'url:../../img/icons.svg'; //zawsze path musi byc od folderu do ktorego importujemy, wiec jestesmy w controler pliku (czyli w folderze js) to musimy isc o jedne folder wyzej(do folderu src) i dopiero wejsc do img i pozniej podac plik ktory ma byc importowany. I teraz pod zmienna icons bedzie kryl sie path do odpowiadajacego pliku w dist. I teraz uzyjemy ${icons} w czesci hrefa + nazwa icony. Jak importuemy cos co nie jest kodem, czyli jakies plik ze zdj,plik z video,dzwiekiem,plik z ikonami itp to musimy dodac w path na poczatku 'url:path'. importujemy zawsze plik nigdy folder

export default class View {
  // klasa ktora bedzie parent klasa dla pozostalych klas, exportujemy ją do wsyztskich child klas zeby mozna bylo ją extendowac. dajemy tu metody i porpties ktore beda sie powtarzac w wiekszosci view. Jak cchcemy extendopwac klasy to nie mozemy uzywac #properties tylko _properties bo tamte jeszcze nie dzialaja w parcelu przy extnedowaniu klas

  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError(); //sprawdzenie czy są dane przy ladowaniu search resultow i przy ladowaniu przepisu, ale to imo srednio tu pasuje
    this._data = data; //w tej metodzie stowrzymy #data ktore bedzie trzymalo dane o przepisie, i teraz ten przepis bedzie dostyepny pod tą property data wiec mozemy go wykorzystywac w innych metodach np  w #generateMarkup ktora stworzy nam htmla

    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div> 
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  //renderowanie bledow zawsze musi sie dziac na ekranie UI zeby widzial je uzytkowanik wiec wysiwtelanie i generowanie bledu powinno byc w view zawsze. teraz tą metode sie wezmie i jako ze jest public API to uzyje sie ją w controloerze do handlowania bledów
  renderError(message = this._errorMessage) {
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(msg = this._message) {
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
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
