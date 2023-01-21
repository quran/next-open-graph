import { ImageResponse } from '@vercel/og';
import HomeOpenGraph from '@/components/OpenGraph/Home';
import { parseRequest } from '@/lib/edge';
import { loadOpenGraphBackground, loadScreenshot } from '@/lib/og';
import type { PageConfig } from 'next/types';
import type { NextRequest } from 'next/server';
import bengali from '@/lib/fonts/bengali';
import thai from '@/lib/fonts/thai';
import chinese from '@/lib/fonts/chinese';
import montserrat from '@/lib/fonts/montserrat';

export const config: PageConfig = {
  runtime: 'experimental-edge',
};

const loadFont = (language: string) => {
  if (language === 'bn') return bengali();
  if (language === 'th') return thai([400, 600]);
  if (language === 'zh') return chinese();
  return montserrat([500, 700]);
};

const premadeLocales = {
  ar: new URL('/public/premade/og-ar.png', import.meta.url),
  fa: new URL('/public/premade/og-fa.png', import.meta.url),
  ur: new URL('/public/premade/og-ur.png', import.meta.url),
};

export default async function handler(req: NextRequest) {
  const { language } = parseRequest(req);

  if (premadeLocales[language.code]) return fetch(premadeLocales[language.code]);

  const [bgSrc, screenshotSrc, fontsData] = await Promise.all([
    loadOpenGraphBackground(),
    loadScreenshot(language.code),
    loadFont(language.code),
  ]);

  const fonts = [];

  if (language.code === 'bn') {
    fonts.push({
      name: 'Bengali',
      data: fontsData,
      style: 'normal',
      weight: 400,
    });
  } else if (language.code === 'th') {
    fonts.push(
      {
        name: 'Thai',
        data: fontsData[400],
        style: 'normal',
        weight: 400,
      },
      {
        name: 'Thai',
        data: fontsData[600],
        style: 'normal',
        weight: 600,
      },
    );
  } else if (language.code === 'zh') {
    fonts.push({
      name: 'Chinese',
      data: fontsData,
      style: 'normal',
      weight: 400,
    });
  } else {
    fonts.push(
      {
        name: 'Montserrat',
        data: fontsData[500],
        style: 'normal',
        weight: 500,
      },
      {
        name: 'Montserrat',
        data: fontsData[700],
        style: 'normal',
        weight: 700,
      },
    );
  }

  return new ImageResponse(
    <HomeOpenGraph bg={bgSrc} screenshot={screenshotSrc} language={language} />,
    {
      width: 1200,
      height: 630,
      fonts,
    },
  );
}
