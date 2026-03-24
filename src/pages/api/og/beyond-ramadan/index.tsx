import { parseRequest } from '@/lib/edge';
import { getPremadeOpenGraphResponse } from '@/lib/premadeOpenGraph';
import type { PageConfig } from 'next/types';
import type { NextRequest } from 'next/server';

export const config: PageConfig = {
  runtime: 'edge',
};

const preMadeLocales = {};

/**
 * Handler of Beyond Ramadan page OpenGraph images.
 * For now, we only have English but in the future we will
 * support other locales.
 *
 * @param {NextRequest} req
 * @returns {Promise<Response>}
 */
export default async function handler(req: NextRequest): Promise<Response> {
  const { language } = parseRequest(req);

  return getPremadeOpenGraphResponse({
    localeImageUrl: preMadeLocales[language.code],
    fallbackImagePath: '/premade/og_beyond_ramadan.png',
  });
}
