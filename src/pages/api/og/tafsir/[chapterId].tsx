import type { PageConfig } from 'next/types';

import { getPremadeOpenGraphResponse } from '@/lib/premadeOpenGraph';

export const config: PageConfig = {
  runtime: 'edge',
};

/**
 * Handler of Tafsir page OpenGraph image.
 *
 * The URL keeps chapter/verse/tafsir params for share metadata context, but the
 * image itself is a premade static asset.
 */
export default async function handler(): Promise<Response> {
  return getPremadeOpenGraphResponse({
    fallbackImageUrl: new URL(
      '/public/premade/og_quran_reader_study_mode_tafsir.png',
      import.meta.url,
    ),
  });
}
