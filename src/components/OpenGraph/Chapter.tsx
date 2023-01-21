/* eslint-disable @next/next/no-img-element */
import localizedText from '@/locales/og.json';
import BaseOpenGraph, { BaseOpenGraphProps } from './Base';
import { chapterIdToSurahCharacter } from '@/lib/og';
import Chapter from '@/types/Chapter';
import { toLocalizedNumber } from '@/lib/locales';
import Logo from '../Logo';

interface ChapterOpenGraphProps extends BaseOpenGraphProps {
  chapter: Chapter;
  verse?: string;
}

export default function ChapterOpenGraph({
  bg,
  language,
  chapter,
  verse,
}: ChapterOpenGraphProps) {
  const locale = localizedText[language.code];
  const isRtl = language.direction === 'rtl';

  const chapterNumber = Number(chapter.id);

  const localizedChapterNumber = toLocalizedNumber(chapterNumber, language.code);

  const getDescription = () => {
    if (verse) {
      return `${
        locale.surah
      } ${localizedChapterNumber} - ${locale.verse.toLowerCase()} ${toLocalizedNumber(
        Number(verse),
        language.code,
      )}`;
    }
    return `${locale.surah} ${localizedChapterNumber}: ${
      (chapter.translatedName as any).name
    }`;
  };

  return (
    <BaseOpenGraph
      bg={bg}
      language={language}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        padding: '33px 46px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          // justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-100px',
        }}
      >
        <div
          style={{
            fontFamily: '"Surah"',
            color: '#000000',
            fontSize: 350,
          }}
        >
          {chapterIdToSurahCharacter(chapterNumber)}
        </div>

        {!isRtl && (
          <div
            style={{
              color: '#000000',
              fontSize: 43,
              fontWeight: 300,
              fontFamily: '"Main"',
              display: 'flex',
            }}
          >
            {getDescription()}
          </div>
        )}
      </div>

      <Logo
        style={{
          fill: '#000000',
          width: 223,
          height: 40,
          position: 'absolute',
          bottom: 33,
          left: 46,
        }}
      />
    </BaseOpenGraph>
  );
}
