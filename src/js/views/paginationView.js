import View from './View';
import icons from 'url:../../img/icons.svg';
import { RES_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btnEl = e.target.closest('.btn--inline ');

      if (!btnEl) return;

      const goToPage = +btnEl.dataset.goto;
      handler(goToPage);
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
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    const currentPage = this._data.page;

    // Page 1, there are other pages

    if (currentPage === 1 && numPages > 1)
      return this._gereneteMarkupBtnNextPage(currentPage);

    // Last page

    if (numPages === currentPage && currentPage > 1)
      return this._gereneteMarkupBtnPreviousPage(currentPage);

    //Other page

    if (numPages > currentPage && currentPage > 1)
      return `
    ${this._gereneteMarkupBtnPreviousPage(
      currentPage
    )}  ${this._gereneteMarkupBtnNextPage(currentPage)}
  `;

    // Page 1, no other pages

    return '';
  }
}

export default new PaginationView();
