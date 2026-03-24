import { parseRequest } from '@/lib/edge';
import { getPremadeOpenGraphResponse } from '@/lib/premadeOpenGraph';
import type { PageConfig } from 'next/types';
import type { NextRequest } from 'next/server';

export const config: PageConfig = {
  runtime: 'edge',
};

const preMadeLocales: Record<string, string> = {};

/**
 * Handler of Ramadan 2026 page OpenGraph images.
 *
 * @param {NextRequest} req
 * @returns {Promise<Response>}
 */
export default async function handler(req: NextRequest): Promise<Response> {
  const { language } = parseRequest(req);

  return getPremadeOpenGraphResponse({
    localeImageUrl: preMadeLocales[language.code],
    fallbackImageUrl: new URL('/public/premade/og_ramadan2026.png', import.meta.url),
  });
}
