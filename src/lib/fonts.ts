import { loadFileOnEdge } from './edge';

// for chapters 1-59
const FIRST_SURAH_FONT_URL = '/fonts/surah-names/surah_font.ttf';

// for chapters 60-114
const SECOND_SURAH_FONT_URL = '/fonts/surah-names/surah_font_2.ttf';

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
  300: '/fonts/Montserrat/Montserrat-Light.ttf',
  500: '/fonts/Montserrat/Montserrat-Medium.ttf',
  700: '/fonts/Montserrat/Montserrat-Bold.ttf',
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

const CHINESE_URL = '/fonts/chinese/ZCOOLQingKeHuangYou-Regular.ttf';
const chinese = () => loadFileOnEdge(CHINESE_URL);

const THAI_URLS = {
  300: '/fonts/thai/Kanit-Light.ttf',
  400: '/fonts/thai/Kanit-Regular.ttf',
  600: '/fonts/thai/Kanit-SemiBold.ttf',
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

const BENGALI_FONT_URL = '/fonts/bengali/NotoSerifBengali-Regular.ttf';

const bengali = () => loadFileOnEdge(BENGALI_FONT_URL);

const edgeFonts = {
  surahNames,
  montserrat,
  chinese,
  thai,
  bengali,
};

export default edgeFonts;
