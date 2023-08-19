class SearchView {
  #parentEl = document.querySelector('.search');

  getQuery() {
    const query = this.#parentEl.querySelector('.search__field').value; // returnuje wpisane query
    this.#clearInput();
    return query;
  }

  #clearInput() {
    this.#parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.#parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    }); //parent element to form, wiec dajemy na nim event submit czyli siue wykona jak sie kliknie przycisk tego forma lub kliknie sie enter przy wpisywaniu w input
  }
}

export default new SearchView();
