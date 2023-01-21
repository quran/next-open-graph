import { loadFileOnEdge } from '../edge';

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

export default surahNames;
