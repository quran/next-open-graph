import type { NextRequest } from 'next/server';
import { findLanguageIdByLocale, getLanguageDataById } from '@/lib/locales';

/**
 * Create a json response
 *
 * @param {object} data any json data
 * @param {number} status status code
 * @returns {Response} response object
 */
export const jsonResponse = (data: object, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
};

type ParsedRequest = {
  language: ReturnType<typeof getLanguageDataById>;
  languageId: number;
  searchParams: URLSearchParams;
};

/**
 *  Parse request object
 *
 * @param {import('next/server').NextRequest} req request object
 * @returns {ParsedRequest} parsed request object
 */
export const parseRequest = (req: NextRequest): ParsedRequest => {
  const { searchParams } = new URL(req.url);
  const language = searchParams.get('lang') ?? 'en';

  let languageId = findLanguageIdByLocale(language);

  // if language is not found, fallback to english
  if (!languageId) languageId = findLanguageIdByLocale('en');

  const languageData = getLanguageDataById(languageId);

  return {
    languageId,
    language: languageData,
    searchParams,
  };
};

const loadFileOnEdgeAsArrayBuffer = async (url: string) => {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000';
  const res = await fetch(`${baseUrl}${url.startsWith('/') ? url : `/${url}`}`);

  const arrayBuffer = await res.arrayBuffer();
  return arrayBuffer;
};

const loadFileOnEdgeAsBase64 = async (url: string) => {
  const arrayBuffer = await loadFileOnEdgeAsArrayBuffer(url);

  // convert arrayBuffer to base64 using browser's api
  const base64 = btoa(
    new Uint8Array(arrayBuffer).reduce(
      (data, byte) => data + String.fromCharCode(byte),
      '',
    ),
  );

  return base64;
};

const loadFileOnEdgeAsImage = async (url: string) => {
  const base64 = await loadFileOnEdgeAsBase64(url);
  return `data:image/png;base64,${base64}`;
};

// @ts-ignore
const loadFileOnEdge:
  | typeof loadFileOnEdgeAsArrayBuffer & {
      asArrayBuffer: typeof loadFileOnEdgeAsArrayBuffer;
      asBase64: typeof loadFileOnEdgeAsBase64;
      asImage: typeof loadFileOnEdgeAsImage;
    } = loadFileOnEdgeAsArrayBuffer;
loadFileOnEdge.asArrayBuffer = loadFileOnEdgeAsArrayBuffer;
loadFileOnEdge.asBase64 = loadFileOnEdgeAsBase64;
loadFileOnEdge.asImage = loadFileOnEdgeAsImage;

export { loadFileOnEdge };
