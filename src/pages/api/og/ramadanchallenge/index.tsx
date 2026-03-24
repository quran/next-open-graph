import { parseRequest } from '@/lib/edge';
import type { PageConfig } from 'next/types';
import type { NextRequest } from 'next/server';

export const config: PageConfig = {
  runtime: 'edge',
};

const preMadeLocales: Record<string, string> = {};

/**
 * Handler of Ramadan Challenge page OpenGraph images.
 *
 * @param {NextRequest} req
 * @returns {Promise<Response>}
 */
export default async function handler(req: NextRequest): Promise<Response> {
  const { language } = parseRequest(req);

  if (preMadeLocales[language.code]) {
    return fetch(preMadeLocales[language.code]);
  }

  return fetch(new URL('/public/premade/og_ramadanchallenge.png', import.meta.url));
}
