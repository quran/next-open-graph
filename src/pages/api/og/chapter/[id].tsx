import { ImageResponse } from '@vercel/og';
import type { NextRequest } from 'next/server';
import type { PageConfig } from 'next/types';
import ChapterOpenGraph from '@/components/OpenGraph/Chapter';
import { json, parseRequest } from '@/lib/edge';
import { loadOpenGraphBackground } from '@/lib/og';
import edgeFonts from '@/lib/fonts';
import { isValidChapterId, isValidVerseNumber } from '@/lib/validator';
import { fetchChapter } from '@/lib/api';

export const config: PageConfig = {
  runtime: 'edge',
};

const loadFont = (language: string) => {
  if (language === 'bn') return edgeFonts.bengali();
  if (language === 'th') return edgeFonts.thai([300]).then(data => data[300]);
  if (language === 'zh') return edgeFonts.chinese();

  return edgeFonts.montserrat([300]).then(data => data[300]);
};

export default async function handler(req: NextRequest) {
  const { searchParams, language } = parseRequest(req);

  const chapterId = searchParams.get('id');
  if (!isValidChapterId(chapterId)) return json({ error: 'Invalid chapter id' }, 400);

  const [bgSrc, surahFontData, mainFontData, { chapter }] = await Promise.all([
    loadOpenGraphBackground(),
    edgeFonts.surahNames(Number(chapterId)),
    loadFont(language.code),
    fetchChapter(chapterId, language.code),
  ]);

  const verse = searchParams.get('verse');
  if (verse && (!isValidVerseNumber(verse) || chapter.versesCount < Number(verse))) {
    return json({ error: 'Invalid verse number' }, 400);
  }

  return new ImageResponse(
    <ChapterOpenGraph bg={bgSrc} chapter={chapter} language={language} verse={verse} />,
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Surah',
          data: surahFontData,
          style: 'normal',
        },
        {
          name: 'Main',
          data: mainFontData,
          style: 'normal',
          weight: 300,
        },
      ],
    },
  );
}
