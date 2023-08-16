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

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (err) {
    throw err; //dajemy throw zeby zworcila fuinckja promisa rejected z wartoscia errora jak sie nie uda sfetchowac, zeby moc sie zajac tym errorem juz w innym module do ktorego importujemy
  }
};
