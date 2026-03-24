import type { NextRequest } from 'next/server';
import { findLanguageIdByLocale, getLanguageDataById } from '@/lib/locales';

/**
 * Create a json response
 *
 * @param {object} data any json data
 * @param {number} status status code
 * @returns {Response} response object
 */
export const json = (data: object, status = 200) => {
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

type EdgeExceptionContext = Record<
  string,
  string | number | boolean | null | undefined
>;

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

export const getEdgeBaseUrl = () => {
  const port = process.env.PORT || '3000';
  return `http://127.0.0.1:${port}`;
};

const captureEdgeException = async (
  error: unknown,
  context?: EdgeExceptionContext,
) => {
  const Sentry = await import('@sentry/nextjs');

  Sentry.withScope(scope => {
    if (context) {
      Object.entries(context).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          scope.setExtra(key, value);
        }
      });
    }

    Sentry.captureException(error);
  });

  await Sentry.flush(2000).catch(() => undefined);
};

export const fetchWithEdgeSentry = async (
  url: string | URL,
  context?: EdgeExceptionContext,
) => {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    await captureEdgeException(error, context);
    throw error;
  }

  if (!response.ok) {
    const fetchUrl = typeof url === 'string' ? url : url.toString();
    const error = new Error(
      `Fetch failed with status ${response.status} ${response.statusText} for ${fetchUrl}`,
    );

    await captureEdgeException(error, {
      ...context,
      fetch_url: fetchUrl,
      fetch_status: response.status,
      fetch_status_text: response.statusText,
    });

    throw error;
  }

  return response;
};

const relativeUrl = (url: string) => {
  const baseUrl = getEdgeBaseUrl();
  return `${baseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

const loadFileOnEdgeAsArrayBuffer = async (url: string | URL) => {
  const res = await fetch(typeof url === 'string' ? relativeUrl(url) : url);

  const arrayBuffer = await res.arrayBuffer();
  return arrayBuffer;
};

const loadFileOnEdgeAsBase64 = async (url: string | URL) => {
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

const loadFileOnEdgeAsImage = async (url: string | URL) => {
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
