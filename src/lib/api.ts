import { camelizeKeys, decamelizeKeys } from 'humps';
import { ChapterResponse } from '@/types/ApiResponses';
import stringify from './stringify';

// const API_HOST = 'https://api.qurancdn.com';
// const API_ROOT_PATH = '/api/qdc';
const API_HOST = 'https://api.quran.com';
const API_ROOT_PATH = '/api/v4';

/**
 * Generates a url to make an api call to our backend
 *
 * @param {string} path the path for the call
 * @param {Record<string, unknown>} parameters optional query params, {a: 1, b: 2} is parsed to "?a=1&b=2"
 * @returns {string}
 */
export const makeUrl = (path: string, parameters?: Record<string, unknown>): string => {
  if (!parameters) {
    return `${API_HOST}${API_ROOT_PATH}${path}`;
  }

  const decamelizedParams = decamelizeKeys(parameters);

  // The following section parses the query params for convenience
  // E.g. parses {a: 1, b: 2} to "?a=1&b=2"
  const queryParameters = `?${stringify(decamelizedParams)}`;
  return `${API_HOST}${API_ROOT_PATH}${path}${queryParameters}`;
};

/**
 * Compose the url for the chapter's API.
 *
 * @param {string} chapterIdOrSlug the chapter Id or the slug.
 * @param {string} language the user's language code.
 * @returns {string}
 */
export const makeChapterUrl = (chapterIdOrSlug: string, language: string): string =>
  makeUrl(`/chapters/${chapterIdOrSlug}`, { language });

export const fetchChapter = async (chapterIdOrSlug: string, language: string) => {
  try {
    const url = makeChapterUrl(chapterIdOrSlug, language);
    console.log(url);

    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    return camelizeKeys(data) as ChapterResponse;
  } catch (e) {
    console.error(e);
  }
};
