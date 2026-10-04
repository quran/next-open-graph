import { expect, test } from '@playwright/test';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

const PREMADE_SHA256: Record<string, string> = {
  'og_about_en.png': '24b589d2af7fed3e65b1efccdd084fe007e3f679aca176cde3bba46e21174723',
  'og_beyond_ramadan.png': 'cd25495585ff06e0312099eb6148683ead201b6217b9eb7fd05a71a3c87c14b5',
  'og_calendar.png': 'd84fc5f5852eb2f5cf66960f33a33686e6e40144a997c1e24a5414faeeee9fe5',
  'og_daily.png': '245a145ba80fa13077674d4565672a918ff7792aa7e25b9c32850b7de5ff113f',
  'og_embed.png': '41f337c61c42c2be1e7039c0d63131cf22a5b4d0ef7f31f9de32a2735f86706c',
  'og_explore_answers.png': '115c6c5847d976bc1272661df8443c0b9d25f42631e62f5e8019b6f047b42a80',
  'og_learning_plans.png': '4f119d4479ec52c2379a8fc82b62a035879d3368b243614c711f9d157272d99d',
  'og_media.png': 'da7127e67e9f1059611a69de8b9de1d5023f674ccb484a8012b811668585575b',
  'og_preparing_for_ramadan.png': '5e27c8afc63614dfa9c2398f0d46d8e592daa58742213ef1211b49d89eaf1a58',
  'og_quran_reader_study_mode_hadith.png': '9bec61c3107305c86953828081e6389c78918850dd1f08646df902398f355798',
  'og_quran_reader_study_mode_layers.png': '350cfc92efdf035e02859d5d75cc5310436ed1a2b9f498614efd0b2cc2f02f44',
  'og_quran_reader_study_mode_lessons.png': '237d2798c65e4e672f18c54289b037005ce71d266ee566f62ef6256e1ec17ef4',
  'og_quran_reader_study_mode_qiraat.png': 'f1f9e880de60f4c46a7f6ad36676bfd15c737c28c0f1858aa34df957bea34f4f',
  'og_quran_reader_study_mode_reflections.png': 'af90c5c52118587ced231a95c02caa84deaebd41457abd8af2b24c3fc063679f',
  'og_quran_reader_study_mode_related_verses.png': 'fadbe14202b9befe6e36afa5e40cdbc83e2c73356991d299a23affcfd95cb047',
  'og_quran_reader_study_mode_tafsir.png': '36b128db486ef24853137510494cf2192a1cdb89560155090e287445d003a324',
  'og_ramadan2026.png': '57be846472a91d34465122b1d6772891179e8bc63637af89441263c233fee140',
  'og_ramadanchallenge.png': '18294847ad07fdb4cb1a9345f00310782cc9f1270e525f2d471d827ebb87bd17',
  'og_what_is_ramadan.png': '7970f79175824799df6648e8937717a8e5e8b8a4ebd212fd6e84b9954448413a',
};

const MAX_PREMADE_TOTAL_BYTES = 3_200_000;
const SHARED_HOME_SHA256 = 'b8f41856bf937e310b9bc4ab9b99879a989aede9f02b6a4f1a21f5b96d28ca37';
const LOCALIZED_ASSET_LOCALES = [
  'ar',
  'bn',
  'en',
  'es',
  'fa',
  'fr',
  'id',
  'ms',
  'nl',
  'sw',
  'tr',
  'ur',
  'vi',
];

test('generated Open Graph images use the official QDC horizontal logo', () => {
  const logoSource = fs.readFileSync(path.join(process.cwd(), 'src/components/Logo.tsx'), 'utf8');
  const logo = fs.readFileSync(path.join(process.cwd(), 'public/qdc-horizontal-dark.png'));

  expect(crypto.createHash('sha256').update(logo).digest('hex')).toBe(
    '2dae9cbd6c36cd8a6ece6015141bcca65e93fe8f2dbff0002253394ca2bdf0f3',
  );
  expect(logoSource).toContain('src={src}');
  expect(logoSource).toContain("objectFit: 'contain'");
});

test('all reviewed premade Open Graph images retain their approved QDC branding', () => {
  Object.entries(PREMADE_SHA256).forEach(([fileName, expectedHash]) => {
    const image = fs.readFileSync(path.join(process.cwd(), 'public/premade', fileName));
    expect(crypto.createHash('sha256').update(image).digest('hex'), fileName).toBe(expectedHash);
  });
});

test('homepage locales resolve to one centered 1200 by 630 QDC logo image', () => {
  const sharedImagePath = path.join(process.cwd(), 'public/premade/og-quran-com.png');
  const routeSource = fs.readFileSync(
    path.join(process.cwd(), 'src/pages/api/og/index.tsx'),
    'utf8',
  );

  expect(fs.existsSync(sharedImagePath), 'shared homepage image').toBe(true);

  const image = fs.readFileSync(sharedImagePath);
  expect(image.readUInt32BE(16), 'image width').toBe(1200);
  expect(image.readUInt32BE(20), 'image height').toBe(630);
  expect(crypto.createHash('sha256').update(image).digest('hex'), 'approved centered layout').toBe(
    SHARED_HOME_SHA256,
  );
  expect(image.byteLength, 'shared homepage image payload').toBeLessThanOrEqual(20_000);

  expect(routeSource).toContain('og-quran-com.png');
  expect(routeSource).not.toContain('searchParams');
  LOCALIZED_ASSET_LOCALES.forEach((locale) => {
    expect(routeSource, locale).not.toContain(`og-${locale}.png`);
    expect(
      fs.existsSync(path.join(process.cwd(), 'public/premade', `og-${locale}.png`)),
      locale,
    ).toBe(true);
  });
});

test('premade Open Graph images stay within their existing payload budget', () => {
  const totalBytes = Object.keys(PREMADE_SHA256).reduce((total, fileName) => {
    return total + fs.statSync(path.join(process.cwd(), 'public/premade', fileName)).size;
  }, 0);

  expect(totalBytes).toBeLessThanOrEqual(MAX_PREMADE_TOTAL_BYTES);
});
