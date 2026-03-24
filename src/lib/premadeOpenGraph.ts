const PNG_CONTENT_TYPE = 'image/png';
const DEFAULT_CACHE_CONTROL = 'public, max-age=2678400, must-revalidate';

type PremadeOpenGraphOptions = {
  fallbackImageUrl: URL;
  localeImageUrl?: string;
};

const toPngResponse = (
  body: ArrayBuffer,
  headers?: HeadersInit,
  status = 200,
): Response => {
  const responseHeaders = new Headers(headers);

  responseHeaders.set('Content-Type', PNG_CONTENT_TYPE);

  if (!responseHeaders.get('Cache-Control')) {
    responseHeaders.set('Cache-Control', DEFAULT_CACHE_CONTROL);
  }

  return new Response(body, {
    status,
    headers: responseHeaders,
  });
};

const fetchPng = async (url: string): Promise<Response> => {
  const response = await fetch(url);

  if (!response.ok) {
    return response;
  }

  const body = await response.arrayBuffer();
  return toPngResponse(body, response.headers, response.status);
};

const fetchFallbackPng = async (url: URL): Promise<Response> => {
  const response = await fetch(url);

  if (!response.ok) {
    return response;
  }

  const body = await response.arrayBuffer();
  return toPngResponse(body);
};

/**
 * Returns a premade OG image while enforcing `image/png` content type.
 */
export const getPremadeOpenGraphResponse = async ({
  fallbackImageUrl,
  localeImageUrl,
}: PremadeOpenGraphOptions): Promise<Response> => {
  if (localeImageUrl) {
    return fetchPng(localeImageUrl);
  }

  return fetchFallbackPng(fallbackImageUrl);
};
