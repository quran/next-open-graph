import type { PageConfig } from 'next/types';

import { getPremadeOpenGraphResponse } from '@/lib/premadeOpenGraph';

export const config: PageConfig = {
  runtime: 'edge',
};

export default async function handler(): Promise<Response> {
  return getPremadeOpenGraphResponse({
    fallbackImageUrl: new URL(
      '/public/premade/og_quran_reader_study_mode_related_verses.png',
      import.meta.url,
    ),
  });
}
