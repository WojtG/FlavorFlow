import View from './View'; // exportujemy parent klase,jak cchcemy extendopwac klasy to nie mozemy uzywac #properties tylko _properties bo tamte jeszcze nie dzialaja w parcelu przy extnedowaniu klas jka np wysiwtelanie spinnera itp
import previewView from './previewView'; //to nie jest klasa tylko instancja, bedziemy tutaj tego uzywac bo kod sie powtarza dla dwoch view taki sam i zrobilismy taka child klase previreewView ktora rendeeruje element i teraz bedziemy uzywac jej public api do tego
import icons from 'url:../../img/icons.svg'; //zawsze path musi byc od folderu do ktorego importujemy, wiec jestesmy w controler pliku (czyli w folderze js) to musimy isc o jedne folder wyzej(do folderu src) i dopiero wejsc do img i pozniej podac plik ktory ma byc importowany. I teraz pod zmienna icons bedzie kryl sie path do odpowiadajacego pliku w dist. I teraz uzyjemy ${icons} w czesci hrefa + nazwa icony. Jak importuemy cos co nie jest kodem, czyli jakies plik ze zdj,plik z video,dzwiekiem,plik z ikonami itp to musimy dodac w path na poczatku 'url:path'. importujemy zawsze plik nigdy folder

class bookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage =
    "You haven't added any bookmarks yet. Discover a delightful recipe and save it!";
  _message = '';

  addHandlerRender(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    //to tradycyjnie sie odpali jak render zadziala(nie ten render w srodku funckji! tylko booksmarkView.render(jakies dane))
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join(''); ///dla kazego bookmarka odpalamy funkje render, w render jest ustawiany _data wiec mozemy tego uzyc teraz w previewView w celu tworzenia htmla. Dodajemy drugi argument do rendera bo tutaj w generate markup my mui8usmy zwrocic stringa z markupem, dlatego w renderze dajemy drugi argumenr render i jak ustawimy go na false to wtedy render nie wydernerduje tylko zreturnuje htmla w stringu wiec to co chcemy
  }

  //   _generateMarkupPreview(rec) {
  //     const id = window.location.hash.slice(1); //id z window pobieramy
  //     return `
  //     <li class="preview">
  //         <a class="preview__link ${
  //           id === rec.id ? 'preview__link--active' : ''
  //         }" href="#${rec.id}">
  //             <figure class="preview__fig">
  //                 <img src="${rec.image}" alt="" />
  //             </figure>
  //             <div class="preview__data">
  //                 <h4 class="preview__title">${rec.title}</h4>
  //                 <p class="preview__publisher">${rec.publisher}</p>
  //             </div>
  //         </a>
  //     </li>
  // `;
  //   }
}

export default new bookmarksView();
