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

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    const newMarkup = this._generateMarkup(); //to jest string w ktorym mamy elementy DOM zapisane ale jako string, wiec nie mozemy tego porownac z DOM elementem ktory juz jest na stronie wiec muismy przekonwerowac ten string na DOM ELEMENT zeby moc porownac z DOM ELEMENTEM ktory jest juz wydrenderowany na stronie

    const newDOM = document.createRange().createContextualFragment(newMarkup); //w ten sposob konwertujemy stringa z htmla do DOM ELEMENTU w celu np wlasnie porownania dom elemntow itp. Mimo ze nie ma go na naszej stronie wyrednerowanego to jest to DOM element i mozemy go uzywac normalnie tak jak uzywamy DOM elementow ktore sa na naszej stronie. On sie normlanie updejtuje itp mimo ze nie jest wyswiuetalny na stronie, zachowuje sie jak normalny dom element(taki wirtualny DOM)

    const newElements = Array.from(newDOM.querySelectorAll('*')); //w ten sposob mozemy wybrac wszytskie elementy jakie są w naszym DOM elemencie newDom. "*" wybiera wsyztskie elementy i musimy zastosowac querySelectorAll i wynikiem tego bedzie nodeList(Node list nalezy konwertowac do prawidzwej array za pomoca Array.from) ze wszytskimi elementami ktore znajdują sie w srodku tego DOM elemnetu newDOM. i kazdu z tych elementow w tablicy ma proprties duzo i jedna z nich jest textContent/innerHTML i stamtad mozemy wyciganac z jakim tekstem by sie wyrenderowal ten element (a u nas sie ten textContent/innerHTML z kazdym klinieciem updejtuje wiec z kazdym kliknieciem ten element odnosnie liczby servings bedzie sie updejtowal)

    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    //zeby porownac ten wirtualny nowy DOM z DOMEM na stronie to trzeba tutaj wybrac te elementy DOMU na stronie ktore odpowiadają elementom zamknietym w newDOM

    newElements.forEach((newEl, i) => {
      const curElement = curElements[i]; // w ten sposob bedziemy loopowac przed curElements tez, przez te dwie array jednoczesnie w celu porownania ich

      //updates changed text
      if (
        !newEl.isEqualNode(curElement) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curElement.textContent = newEl.textContent; //jak nie są taki same text conetenty w w starym i nowym elemencie DOM to w  starym wygenrowany na stronie DOM  zmioeniamy jego textContent na textContent nowego elementu DOM i ten stary sie zamieni na nowy na stronie. Przez to ze to tez zwroci false dla rodzicow elementow w ktorych sie zmienilo cos to musimy jeszcze zrobic tak zeby to dzialalo tylko dla elementow w ktorych jest sam tekst przez co nie bedzie wybierac elemenmtow rodzicow dlatego wszytskie elementy ktore są w arrays(w naszych arrays mamy nie elementy tylko nodes, bo nie kazdy node to element ale kazdy element to node,bo mamy rozne typu nodes, oprocz elementow jest jeszcze text node,comment noder, atrinbute node itp) nalezy na nich uzyc firstChild i firstChild uzyte na node zworci node ktore jest pierwszym dzieckiem tego parent node. Wiec sprawdzamy czy  firstChild to bedzie text node za pomocą nodeValue (jak node jest inny niz text node to zwraca null a jak jest text node to zwraca text) i jeszce uzywamy trim() zebhy uciac whitespaces i przyrownujemy to zeby nie bylo pustym stringiem. to sprawdzenie przejda elementy co maja w sobie tylko text czyli no <btn clas'gowno>esssa</btn> itp
      }

      // nowyElemnt,isEqualNode(StaryElement) sprawdza czy 2 elementy DOM są takie same, zwraca false jak nie sa i zwraca true jak sa. Jak porownujemy tak jak tutaj to nie dosc ze zwroci false w elementach w tkorych cos sie zmienilo to rowniez zwroci false w rodziach tych elementow no bo ich dziecko w srodku sie zmienilo.

      //updates changed atributes
      if (!newEl.isEqualNode(curElement)) {
        // teraz musimy jeszcze zupdejtowac dataSety na batonach - i + bo one maja poczatkowo dataSet ustawiony na servings-1 i servings-1 i z kazdym kliknieciem trzeba zmienic im ten dataSet, nie mozemyu zrobic tego w tym samym ifie co u gory bo tam wchodza tylko nodes co maja w sobie tyko text a nasze btny maja w sobie svg wiec nigdy nie wejda do tego ifa gornego wiec musimy zrobic osobne sprawdzenie dla nich w ktorym sprawdzamy jedynie czy elementy sie roznia miedzy soba
        newEl.attributes; // .atribbutes dla kazdego elementu ktory zworci nam object z jego atrybutami a wiec  dzieki temu ze w tym ifie wykona sie to tylko dla elementow w kotrych cos sie zmienilo to bedziemy mogli wziac ich atrybuty w objecie zmienic na array przeloopowac i  wlozyc do starego htmla przez co sie zupdejtują i bedą dzialac btny(taka sam konwencja jak dla textu)
        Array.from(newEl.attributes).forEach(attr =>
          curElement.setAttribute(attr.name, attr.value)
        ); //bierzemy object z  atrybutami nowegoElementu kotry jest inny niz odpowiadajacym mu staryElement zmieniamy go na array i dal kazdego z tych atrybutow ustwiamy go jako atrybut starego elementu ktory  odpowiada temu nowemuElemetowi i znajduje sie juz na streonie. uzywamy setAtribute(nazwa atrybutu, wartosc atrybutu)
      }
    });
  } //metoda ktroa bedzie updejtowala DOM, zamiast renderowac od zera caly view, bedziemy w wielu miejscach na roznych klasach ją uzywaac wiec stosujemy ją w parent klasie jako public api. Bedziemy w niej porownywac wygenerowany przez render() HTML (DOM ELEMENTY) do tego nowego htmla (DOM ELEMENTU) ktory ma byc jak klikniemy jakis przycisk itp i jak beda sie roznic to bedziemy znajdowac czym sie roznią i te roznice bedziemy wprowadzac do starego htmla ktory jest juz wygenerowany przez co zmienimy jego textContent na stronie

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
