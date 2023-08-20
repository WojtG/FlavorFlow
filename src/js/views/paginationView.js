import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnEl = e.target.closest('.btn--inline '); //stosujemy tu event delegation. Jakby byl sam btn to spoko nie trzeba closest uzywac wystaczy samo e.target ale jako ze sa rzeczy w btnie to musimy miec pewnosc ze jak klikniemy w dziecko  .btn--inline  to nam sie wybierze i tak btn wiec dlatego srosujemy closest

      if (!btnEl) return; //sprawdzenie bo mozemy w naszym el,meencie rodzicu kliknac na cos co nie ma przodka o klasie btn--inline i wtedy btnEl jest null wiec to zabezpieczenie zeby nie wyhjebalo funckji oprzy odczytuwaniu dataset

      const goToPage = +btnEl.dataset.goto;
      handler(goToPage); //jak mamy jakies rzeczy zwiazne z eventem a wiec e.target e.preventDefault()  to musimy tutaj zrobic callbacka ktory obsluguje tylko rzeczy zwiazane z eventem (Jak musimy podac jakis element htmla jako argument handlera czy jakas wartosc z domu jako argument handlera to tez tak trzeba zrobic) i na koniec wywolac handler. cala logika handlera nie dotyczaca domu i eventow ma byc w kontrolerze. reszta tutaj. Dlatego numer strony pozskakny z dataSet z DOMU podajemy jako aergument handlera zeby mocv go uzyc w kontrolerze
    });
  }

  _gereneteMarkupBtnNextPage(currentPage) {
    return `
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next"> 
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
    `;
    //tworzymy  data-goto="${currentPage + 1}" zeby js wiedzial do kotrej strony ma przejsc po kliknieciu, zczyta se ten data atrybut z htmla
  }

  _gereneteMarkupBtnPreviousPage(currentPage) {
    return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
      `;
  }

  _generateMarkup() {
    //podailismy do render() dla tego view model.search.results w kotrym sa dane na temat na kotrej jestesmy stronie, ilosc wynuikow do wygenerowania itp, te dane zapisują się w zmiennej _data ktora jako pusta zmienna inhertiowana jest do kazdego view i render dla kazdegom view inne dane w niej zapisuje. Funckja ta bedzie renderowac buttno w zaleznosci od astrony na kotrej jestesmy
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    ); //obliczamy ile jest stron, tu wychodzi 5.9 wiec zawsze do gory sie zaokorgla zeby wszytskie wyniki sie zmiescily (dzielimy dlugoisc array z resultami) przez ilosc resultow jakie maja byc na stronie wtedy wiemy ile jest stron, to wsyztsko przyszlo jako argument z render() wywoalnym w kontrolerze i zapisane zostalo w _data. Wartosci te sa zdefiniowane w modelu

    const currentPage = this._data.page;

    // Page 1, there are other pages
    if (currentPage === 1 && numPages > 1)
      return this._gereneteMarkupBtnNextPage(currentPage);
    //sprawdzmy czy jestemy na pierwszej stronie i czy jest wiecej stron niz 1

    //   return `
    //     <button class="btn--inline pagination__btn--next">
    //         <span>Page ${currentPage + 1}</span>
    //         <svg class="search__icon">
    //             <use href="${icons}#icon-arrow-right"></use>
    //         </svg>
    //     </button>
    // `;

    // Last page
    if (numPages === currentPage && currentPage > 1)
      return this._gereneteMarkupBtnPreviousPage(currentPage);
    //sprawdzmy czy ostatnia strona ma taka sama wartosc jak strona akutalna i nie jest pierwszą(bo jakby byla jedna strona to wtedy to tez by byla prawda a musimy rozdzielic te przypadki), jesli tak to jestyesmy na ostatniej stronie

    //   return `
    //     <button class="btn--inline pagination__btn--prev">
    //         <svg class="search__icon">
    //             <use href="${icons}#icon-arrow-left"></use>
    //         </svg>
    //         <span>Page ${currentPage - 1}</span>
    //     </button>
    //   `;

    //Other page
    if (numPages > currentPage && currentPage > 1)
      return `
    ${this._gereneteMarkupBtnPreviousPage(
      currentPage
    )}  ${this._gereneteMarkupBtnNextPage(currentPage)}
  `;
    //   return `
    //         <button class="btn--inline pagination__btn--prev">
    //             <svg class="search__icon">
    //                 <use href="${icons}#icon-arrow-left"></use>
    //             </svg>
    //             <span>Page ${currentPage - 1}</span>
    //         </button>
    //         <button class="btn--inline pagination__btn--next">
    //             <span>Page ${currentPage + 1}</span>
    //             <svg class="search__icon">
    //                 <use href="${icons}#icon-arrow-right"></use>
    //             </svg>
    //         </button>
    //       `;

    //sprawdzamy czy jestesmy na stronie innej niz ostatnia i pierwsza. Sprawqdzmy czy numer stron jest wiekszy niz akutralna strona i czy akutalna strona jest wieksza niz 1

    // Page 1, no other pages
    return ''; //jak wszytskie pozostale warunki nie sa spelnione to znaczy ze jest tylko jedna strona. Returnujemy nic bo nie chcemy zadnego btna w takiej sytuacji renderowac
  }
}

export default new PaginationView();
