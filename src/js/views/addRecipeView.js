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
    super(); //nawet jak zadnej property nie chcemy odziedzyczc w klasie dziecku zbey byla odrazu stworzona na jej instacjach( bo i tak mozemy z nich korzytsac bo beda w prototypie) to i tak musimy napisac super() i zostawic puste chyba ze nie ma wgl contrutora. Tu bedzie bo addHandlerShowWindow robi rzeczy tylko zwiazane z domem, wiec nie trzeba go podawac do controlera i wystraczy go wywolwac w consturtorze zeby przy zaladowaniu strony juz odpalil i zeby sie ten addEventListener dodal do btnOpen i czekal na event, jedyne co trzeba zrobic z controlerem to imoprotowac do niego instancje tej klasy

    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  _toggleWindow() {
    this._window.classList.toggle('hidden'); //dzieki temu toggle a nie remove i add w obydwu funckjach tych pod spodem mozemy uzyc tej funckji
    this._overlay.classList.toggle('hidden');
  }

  closeWindow() {
    [this._window, this._overlay].forEach(el => el.classList.add('hidden'));
  }

  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this._toggleWindow.bind(this)); //bindujemy this zeby pokazywalo this na klase a nie na element na kotrym wywolaimsy eventListener
  }
  _addHandlerHideWindow() {
    [this._btnClose, this._overlay].forEach(ev =>
      ev.addEventListener('click', this._toggleWindow.bind(this))
    );
    document.body.addEventListener('keydown', e => {
      //arow funckja zeby, bo arrow funkjce nie maja swojego this tylko wezma this z najblizszego przodka ktore jest okreslone wiec tu wezmie this z klasy i zadziala tak jak trzeba
      if (e.key === 'Escape') {
        this._toggleWindow();
      }
    });
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      const dataArray = [...new FormData(this)]; //new FormData to API ktory wyciaga wszytskie dane z inputow z forma i zamyka w dziwnym obiekcie  ktorego nie da sie uzyc dlatego musimy te dane zamknac w nowej array uzywajac spread operatora ta array co powsytanie to bedzie array w ktorej na kazdym miejscu bedzie array z 2 wartosciami, pierwszą bedzie name jaki byl przypisany do inputu a drugi to value wpisana do inputu. Piszemy new FormData(element DOM ktory jest formem) tutaj napisalismy this bo wywolujmey na tym formie eventListenera wiec this w eventListenrze to element na kotrym wywolalismy eventListenera wiec w tym przypadku nasz form
      const data = Object.fromEntries(dataArray); //jako ze dataArray dala nam tablice z entries a nasze przepisy byly zamkniete jako object to uzywamy Object.fromEntries(tablica z entries) i stworzy nowy obiekt na podstawie tej tablicy z entries ktora podalismy, jhest to ptzeciwiesntwo metody Object.entries(nazwa obiektu) ktory zmienial obiekt na tablice z entries
      handler(data); //podajermy te dane z forma do kontrolera w postaci argumentu
    });
  }
}

export default new addRecipeView();
