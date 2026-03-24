import { parseRequest } from '@/lib/edge';
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

  if (preMadeLocales[language.code]) {
    return fetch(preMadeLocales[language.code]);
  }

  return fetch(new URL('/public/premade/og_embed.png', import.meta.url));
}
