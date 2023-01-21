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
  // ar: new URL('/public/screenshot-ar.png', import.meta.url),
  // fa: new URL('/public/screenshot-fa.png', import.meta.url),
  // ur: new URL('/public/screenshot-ur.png', import.meta.url),
  bn: new URL('/public/screenshots/screenshot-bn.png', import.meta.url),
  en: new URL('/public/screenshots/screenshot.png', import.meta.url),
  fr: new URL('/public/screenshots/screenshot-fr.png', import.meta.url),
  id: new URL('/public/screenshots/screenshot-id.png', import.meta.url),
  it: new URL('/public/screenshots/screenshot-it.png', import.meta.url),
  ms: new URL('/public/screenshots/screenshot-ms.png', import.meta.url),
  nl: new URL('/public/screenshots/screenshot-nl.png', import.meta.url),
  pt: new URL('/public/screenshots/screenshot-pt.png', import.meta.url),
  ru: new URL('/public/screenshots/screenshot-ru.png', import.meta.url),
  sq: new URL('/public/screenshots/screenshot-sq.png', import.meta.url),
  th: new URL('/public/screenshots/screenshot-th.png', import.meta.url),
  tr: new URL('/public/screenshots/screenshot-tr.png', import.meta.url),
  zh: new URL('/public/screenshots/screenshot-zh.png', import.meta.url),
};

export const loadScreenshot = (locale: string) =>
  loadFileOnEdge.asImage(screenshots[locale]);

export const loadOpenGraphBackground = () =>
  loadFileOnEdge.asImage(new URL('/public/bg.png', import.meta.url));
