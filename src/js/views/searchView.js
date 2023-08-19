class SearchView {
  _parentEl = document.querySelector('.search');

  getQuery() {
    const query = this._parentEl.querySelector('.search__field').value; // returnuje wpisane query
    this._clearInput();
    return query;
  }

  _clearInput() {
    this._parentEl.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    }); //parent element to form, wiec dajemy na nim event submit czyli siue wykona jak sie kliknie przycisk tego forma lub kliknie sie enter przy wpisywaniu w input
  }
}

export default new SearchView();
