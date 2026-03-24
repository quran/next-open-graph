import { parseRequest } from '@/lib/edge';
import { getPremadeOpenGraphResponse } from '@/lib/premadeOpenGraph';
import type { PageConfig } from 'next/types';
import type { NextRequest } from 'next/server';

export const config: PageConfig = {
  runtime: 'edge',
};

const preMadeLocales = {};

/**
 * Handler of Embed Builder page OpenGraph image.
 *
 * @param {NextRequest} req
 * @returns {Promise<Response>}
 */
export default async function handler(req: NextRequest): Promise<Response> {
  const { language } = parseRequest(req);

  return getPremadeOpenGraphResponse({
    localeImageUrl: preMadeLocales[language.code],
    fallbackImagePath: '/premade/og_embed.png',
  });
}
