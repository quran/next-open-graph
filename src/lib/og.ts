// NOTE: In this file, we cannot concatinate strings and pass them to the URL constructor due to webpack
import { loadFileOnEdge } from './edge';

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

/**
 * We use a special font for surah names (https://www.fontspace.com/quran-surah-svg2-font-f55995) which has a special character for each surah.
 *
 * @param {number} chapterId
 * @returns {string} the character for the surah
 */
export const chapterIdToSurahCharacter = (chapterId: number) => {
  // from 1-9 return the number
  if (chapterId < 10) return chapterId.toString();

  // from 10-33 return a letter from A to X lowercase
  if (chapterId >= 10 && chapterId <= 33) return letters[chapterId - 10].toLowerCase();

  // 34-59 return a letter from A to Z uppercase
  if (chapterId >= 34 && chapterId <= 59) return letters[chapterId - 34];

  // 60-85 return a letter from A to Z lowercase
  if (chapterId >= 60 && chapterId <= 85) return letters[chapterId - 60].toLowerCase();

  // 86-105 return a letter from A to Z uppercase
  if (chapterId >= 86 && chapterId <= 105) return letters[chapterId - 86];

  // 106-114 return a number from 1 to 9
  return (chapterId - 106 + 1).toString();
};

const screenshots = {
  bn: '/screenshot-bn.png',
  en: '/screenshot.png',
  fr: '/screenshot-fr.png',
  id: '/screenshot-id.png',
  it: '/screenshot-it.png',
  ms: '/screenshot-ms.png',
  nl: '/screenshot-nl.png',
  pt: '/screenshot-pt.png',
  ru: '/screenshot-ru.png',
  sq: '/screenshot-sq.png',
  th: '/screenshot-th.png',
  tr: '/screenshot-tr.png',
  zh: '/screenshot-zh.png',
};

export const loadScreenshot = (locale: string) =>
  loadFileOnEdge.asImage(`/screenshots/screenshot-${locale}.png`);

export const loadOpenGraphBackground = () => loadFileOnEdge.asImage('/bg.png');
