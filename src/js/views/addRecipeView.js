import View from './View';
import icons from 'url:../../img/icons.svg';

class addRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'The recipe has been uploaded successfully';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();

    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  closeWindow() {
    [this._window, this._overlay].forEach(el => el.classList.add('hidden'));
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this));
  }
  _addHandlerHideWindow() {
    [this._btnClose, this._overlay].forEach(ev =>
      ev.addEventListener('click', this._toggleWindow.bind(this))
    );
    document.body.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this._toggleWindow();
      }
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)];
      const data = Object.fromEntries(dataArray);
      handler(data);
    });
  }
}

export default new addRecipeView();
