/* eslint-disable @next/next/no-img-element */
import localizedText from '@/locales/og.json';
import Logo from '../Logo';
import BaseOpenGraph, { BaseOpenGraphProps } from './Base';

interface HomeOpenGraphProps extends BaseOpenGraphProps {
  screenshot: string;
}

export default function HomeOpenGraph({ bg, screenshot, language }: HomeOpenGraphProps) {
  const locale = localizedText[language.code];

  // a function to break long words in chinese and thai
  const breakLongWords = (text: string) => {
    const localesToBreak = new Set(['th']);
    if (localesToBreak.has(language.code)) return text.replace(/([^\s]{10})/g, '$1 ');

    return text;
  };

  const getFontName = () => {
    if (language.code === 'bn') return '"Bengali"';
    if (language.code === 'zh') return '"Chinese"';
    if (language.code === 'th') return '"Thai"';
    return '"Montserrat"';
  };

  const getTitleFontWeight = () => {
    if (language.code === 'th') return 600;
    return 700;
  };

  const getSubtitleTitleFontWeight = () => {
    if (language.code === 'zh') return 400;
    if (language.code === 'th') return 400;
    return 500;
  };

  return (
    <BaseOpenGraph
      bg={bg}
      language={language}
      style={{
        fontFamily: getFontName(),
        flexDirection: 'column',
        padding: '82px 65px',
      }}
    >
      <img
        alt='Screenshot'
        src={screenshot}
        style={{
          width: 750,
          height: 528,
          position: 'absolute',
          top: 48,
          left: 631,
          margin: 'auto',
          objectFit: 'cover',
          borderRadius: 10,
          boxShadow: '0px 4px 50px rgba(0, 0, 0, 0.1)',
          zIndex: '1',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          maxWidth: 512,
        }}
      >
        <Logo
          style={{
            fill: '#000000',
            width: 223,
            height: 40,
          }}
        />

        <h1
          style={{
            fontWeight: getTitleFontWeight(),
            color: '#0F172A',
            marginTop: 85,
            fontSize: language.code === 'ru' ? 36 : 52,
            lineHeight: '54px',
          }}
        >
          {/* Read the Quran with Translations */}
          {breakLongWords(locale.title)}
        </h1>

        <p
          style={{
            color: '#57595C',
            marginTop: 57,
            fontWeight: getSubtitleTitleFontWeight(),
            fontSize: 28,
            lineHeight: '34px',
          }}
        >
          {/* Read the Quran translated into many languages in a simple and easy interface */}
          {breakLongWords(locale['default-description'])}
        </p>
      </div>
    </BaseOpenGraph>
  );
}
