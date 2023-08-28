//w tym module trzymamy funckje ktore beda reusowane w projekcie kilka razy

import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
}; // funckja ktora robi ze promise bedzie rejected po ilus tam skeundach. uzyjemy jej w  Promise.race() z fetchowaniuem zeby upewnic sie ze fetchowanie bedzie odrzucone jak bedzie wyukonywac sie dluzej niz okresliumy tu sekundy w funckji timeout

//funckja ktora moze wysylac lub odbierac dane z API
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPromise = uploadData
      ? fetch(url, {
          method: 'POST', //jak wysylamy cos do api to zawsz musimy okreslic method: 'POST
          headers: {
            //zawsze tez trzeba okreslic headers w ktorym okreslamy jaki typ dancych chcemy wyslac, bez okreslenia typu danych w headerze API nie zadziala, jest kilka standartowych header. Ten header uzywamy jak chcemy wyslac do API cos co jest JSON
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData), //tutaj podajemy dane ktore chcemy wyslac i musza byc w formacie zgodnym z headerem dlatego uzywamy JSON.stringify bo w headerze okreslilismy ze dane przyjdą jako JSON
        })
      : fetch(url);
    console.log(fetchPromise);

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

/*
funckja pobierajaca dane z api

export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err; //dajemy throw zeby zworcila fuinckja promisa rejected z wartoscia errora jak sie nie uda sfetchowac, zeby moc sie zajac tym errorem juz w innym module do ktorego importujemy
  }
};

funckja ktora wysyla dane do API

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPromise = fetch(url, {
      method: 'POST', //jak wysylamy cos do api to zawsz musimy okreslic method: 'POST
      headers: {
         zawsze tez trzeba okreslic headers w ktorym okreslamy jaki typ dancych chcemy wyslac, bez okreslenia typu danych w headerze API nie zadziala, jest kilka standartowych header. Ten header uzywamy jak chcemy wyslac do API cos co jest JSON
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData), //tutaj podajemy dane ktore chcemy wyslac i musza byc w formacie zgodnym z headerem dlatego uzywamy JSON.stringify bo w headerze okreslilismy ze dane przyjdą jako JSON
    });

     jak chcemy cos wyslac do API a pobrac to oprocvz url tego API w fetchu (TEN URL MUSI ZAWIERAC API KEY BO ZEBY WYSYLAC RZERCZY DO API TRZEBA MIEC API KEY) trzba dodac obiket z opcjami. A nastepnie jak juz wyslemy fetcha do APi to wszytsko robimy jakbysmy pobierali dane bezposrednio z API a wiec awaitujemy response itp, wszytsko to co pod spodem

    const response = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err; //dajemy throw zeby zworcila fuinckja promisa rejected z wartoscia errora jak sie nie uda sfetchowac, zeby moc sie zajac tym errorem juz w innym module do ktorego importujemy
  }
};
*/
