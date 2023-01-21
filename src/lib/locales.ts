export const LANG_LOCALE_MAP = {
  en: 'en-US',
  ar: 'ar-EG',
  bn: 'bn-BD',
  fa: 'fa-IR',
  fr: 'fr-FR',
  id: 'id-ID',
  it: 'it-IT',
  nl: 'nl-NL',
  pt: 'pt-BR',
  ru: 'ru-RU',
  sq: 'sq-AL',
  th: 'th-TH',
  tr: 'tr-TR',
  ur: 'ur-PK',
  zh: 'zh-CN',
  ms: 'ms-MY',
};

export enum Direction {
  LTR = 'ltr',
  RTL = 'rtl',
}

export const Languages = {
  9: {
    // Arabic,
    dir: Direction.RTL,
    locale: 'ar',
  },
  20: {
    // Bengali
    locale: 'bn',
  },
  34: {
    font: 'divehi',
    locale: 'dv',
    dir: Direction.RTL,
  },
  38: {
    // English
    locale: 'en',
  },
  43: {
    // Persian/Farsi
    dir: Direction.RTL,
    locale: 'fa',
  },
  49: {
    // French
    locale: 'fr',
  },
  59: {
    // Hebrew
    dir: Direction.RTL,
    locale: 'he',
  },
  67: {
    // Indonesian
    locale: 'id',
  },
  74: {
    // Italian
    locale: 'it',
  },
  89: {
    font: 'kurdish',
    locale: 'ku',
    dir: Direction.RTL,
  },
  110: {
    // Malay
    locale: 'ms',
  },
  133: {
    // Portuguese
    locale: 'pt',
  },
  118: {
    // Dutch
    locale: 'nl',
  },
  138: {
    // Russian
    locale: 'ru',
  },
  151: {
    // Albanian
    locale: 'sq',
  },
  161: {
    // Thai
    locale: 'th',
  },
  167: {
    // Turkish
    locale: 'tr',
  },
  172: {
    // Uyghur/Uighur
    dir: Direction.RTL,
    locale: 'ug',
  },
  174: {
    font: 'urdu',
    dir: Direction.RTL,
    locale: 'ur',
  },
  185: {
    // Chinese
    locale: 'zh',
  },
};

interface LanguageData {
  direction: string;
  font: string;
  code: string;
}

/**
 * Get direction and font name of language by language id
 *
 * @param {number} languageId
 * @returns {LanguageData}
 */
export const getLanguageDataById = (languageId: number): LanguageData => {
  const lang = Languages[languageId];

  return {
    font: lang?.font,
    direction: lang?.dir || Direction.LTR,
    code: lang?.locale || 'en',
  };
};

/**
 * Find language Id by its locale
 *
 * @param {string} locale
 * @returns {number} language id
 */
export const findLanguageIdByLocale = (locale: string): number => {
  const languageId = Object.keys(Languages).find(id => Languages[id].locale === locale);

  return languageId ? parseInt(languageId, 10) : 0;
};

/**
 * Takes a number and returns a localized string based on the provided locale.
 *
 * @param {number} value
 * @param {string} locale
 * @param {boolean} showLeadingZero
 * @param {Intl.NumberFormatOptions} options
 * @returns {string}
 */
// Intl.NumberFormat is performance heavy so we are caching the formatter.
let numberFormatter: Intl.NumberFormat = null;
let currentLanguageLocale: string = null;
export const toLocalizedNumber = (
  value: number,
  locale: string,
  showLeadingZero = false,
  options: Intl.NumberFormatOptions = {},
) => {
  if (numberFormatter && currentLanguageLocale === locale) {
    return getFormattedNumber(numberFormatter, value, showLeadingZero);
  }
  currentLanguageLocale = locale;
  const fullLocale = LANG_LOCALE_MAP[locale];
  numberFormatter = new Intl.NumberFormat(fullLocale, options);
  return getFormattedNumber(numberFormatter, value, showLeadingZero);
};

/**
 * Get the formatted localized number. This either returns
 * the original value or prepends a leading 0 to the beginning
 * of the string if it's allowed and the value is below 10.
 *
 * @param {Intl.NumberFormat} formatter
 * @param {number} value
 * @param {boolean} showLeadingZero
 * @returns {string}
 */
const getFormattedNumber = (
  formatter: Intl.NumberFormat,
  value: number,
  showLeadingZero: boolean,
): string => {
  const formattedNumber = formatter.format(value);
  if (!showLeadingZero || value >= 10) {
    return formattedNumber;
  }
  return `${formatter.format(0)}${formattedNumber}`;
};
