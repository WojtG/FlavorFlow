//w prawidzym zyciu jest taki plik config.js w ktorym trzymamy zmienne ktora sa const i ktore bedą reusowane w projekcie, pozowli nam to na konfigurowanie szybkie naszego projektu poprzez zmienienie wartosci zmiennej w pliku config. Nie wkladamy tutaj wszytskich zmiennych tylko te wazne z punktu dzialania aplikacji, np adres url API itp bo np jak sie adres url API zmieni to wystraczy ze zupdejtujemy go tutaj i wszytsko bedzie dzialac, zamiast w kazdym miejscu zmieniac tą wartosc

export const API_URL = 'https://forkify-api.herokuapp.com/api/v2/recipes/';
//tutaj dajemy tylkjo zmienne const ktore naprawde nigdy nie zmienia swojej wartosci i zawsz beda mialy ta wartosc i sa wazne jesli chodzi o dzialanie aplikacji, onzwaczyamy je nie camelCase tylko DUZYMI_LITERMAI
export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 10;
