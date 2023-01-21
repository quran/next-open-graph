import { loadFileOnEdge } from './edge';

// for chapters 1-59
const FIRST_SURAH_FONT_URL = new URL(
  '/public/fonts/surah-names/surah_font.ttf',
  import.meta.url,
);

// for chapters 60-114
const SECOND_SURAH_FONT_URL = new URL(
  '/public/fonts/surah-names/surah_font_2.ttf',
  import.meta.url,
);

/**
 * A function to load the surah name font file based on the chapter id.
 *
 * @param {number} chapterId
 * @returns {Promise<ArrayBuffer>} the font file as an ArrayBuffer
 */
const surahNames = async (chapterId: number) => {
  let fileName = FIRST_SURAH_FONT_URL;
  if (chapterId > 59) fileName = SECOND_SURAH_FONT_URL;

  return loadFileOnEdge(fileName);
};

const MONTSERRAT_URLS = {
  100: new URL('/public/fonts/Montserrat/Montserrat-Thin.ttf', import.meta.url),
  300: new URL('/public/fonts/Montserrat/Montserrat-Light.ttf', import.meta.url),
  400: new URL('/public/fonts/Montserrat/Montserrat-Regular.ttf', import.meta.url),
  500: new URL('/public/fonts/Montserrat/Montserrat-Medium.ttf', import.meta.url),
  600: new URL('/public/fonts/Montserrat/Montserrat-SemiBold.ttf', import.meta.url),
  700: new URL('/public/fonts/Montserrat/Montserrat-Bold.ttf', import.meta.url),
  800: new URL('/public/fonts/Montserrat/Montserrat-ExtraBold.ttf', import.meta.url),
};

const montserrat = async (weights: Array<keyof typeof MONTSERRAT_URLS>) => {
  const urls = weights.map(w => MONTSERRAT_URLS[w]);

  const responses = await Promise.all(urls.map(url => loadFileOnEdge(url)));

  // @ts-ignore
  const result: Record<Weight, ArrayBuffer> = {};

  weights.forEach((weight, i) => {
    result[weight] = responses[i];
  });

  return result;
};

const CHINESE_URL = new URL(
  '/public/fonts/chinese/ZCOOLQingKeHuangYou-Regular.ttf',
  import.meta.url,
);
const chinese = () => loadFileOnEdge(CHINESE_URL);

const THAI_URLS = {
  100: new URL('/public/fonts/thai/Kanit-Thin.ttf', import.meta.url),
  300: new URL('/public/fonts/thai/Kanit-Light.ttf', import.meta.url),
  400: new URL('/public/fonts/thai/Kanit-Regular.ttf', import.meta.url),
  500: new URL('/public/fonts/thai/Kanit-Medium.ttf', import.meta.url),
  600: new URL('/public/fonts/thai/Kanit-SemiBold.ttf', import.meta.url),
  700: new URL('/public/fonts/thai/Kanit-Bold.ttf', import.meta.url),
  800: new URL('/public/fonts/thai/Kanit-ExtraBold.ttf', import.meta.url),
  900: new URL('/public/fonts/thai/Kanit-Black.ttf', import.meta.url),
};

const thai = async (weights: Array<keyof typeof THAI_URLS>) => {
  const urls = weights.map(w => THAI_URLS[w]);

  const responses = await Promise.all(urls.map(url => loadFileOnEdge(url)));

  // @ts-ignore
  const result: Record<Weight, ArrayBuffer> = {};

  weights.forEach((weight, i) => {
    result[weight] = responses[i];
  });

  return result;
};

const BENGALI_FONT_URL = new URL(
  '/public/fonts/bengali/NotoSerifBengali-Regular.ttf',
  import.meta.url,
);

const bengali = () => loadFileOnEdge(BENGALI_FONT_URL);

const edgeFonts = {
  surahNames,
  montserrat,
  chinese,
  thai,
  bengali,
};

export default edgeFonts;
